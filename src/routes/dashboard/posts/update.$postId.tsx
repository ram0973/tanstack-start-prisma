"use client"
import { BlockNoteTextEditor } from '@/components/BlockNoteTextEditor'
import { FormInput } from '@/components/FormInput'
import { NotFound } from '@/components/NotFound'
import { PageLoader } from '@/components/PageLoader'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { getPost, updatePost } from '@/server/posts'
import { uploadImage } from '@/server/uploads'
import { UpdatePost } from '@/types/posts/UpdatePost'
import { useCreateBlockNote } from '@blocknote/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, ErrorComponent, useRouter, type ErrorComponentProps } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { CircleAlert, LoaderCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import slugify from '@sindresorhus/slugify'
import { toast } from 'sonner'
import type { z } from 'zod'

const postQueryOptions = (id: string) =>
	queryOptions({
		queryKey: ["posts", id],
		queryFn: () => getPost({ data: id }),
	});

export const Route = createFileRoute('/dashboard/posts/update/$postId')({
	ssr: 'data-only',
	loader: async ({ context, params: { postId } }) => {
		await context.queryClient.ensureQueryData(postQueryOptions(postId))
	},
	errorComponent: PostErrorComponent,
	notFoundComponent: () => {
		return <NotFound>Post not found</NotFound>
	},
	component: UpdatePostComponent,
})

function PostErrorComponent({ error }: ErrorComponentProps) {
	return <ErrorComponent error={error} />
}

function UpdatePostComponent() {
	const params = Route.useParams()
	const { data: post, isLoading, isFetching, isError, error } = useSuspenseQuery(postQueryOptions(params.postId))

	if (isLoading || isFetching) {
		return <PageLoader type='page' />
	}

	if (isError) {
		return (<span>Error: {error.message}</span>)
	}

	if (!post) {
		return (<span>Post not found</span>)
	}

	return <UpdatePostForm post={post} />
}


const UpdatePostForm = ({ post }: { post: z.infer<typeof UpdatePost> }) => {
	const form = useForm<z.infer<typeof UpdatePost>>({
		resolver: zodResolver(UpdatePost),
		defaultValues: {
			id: post.id,
			slug: post.slug,
			title: post.title,
			excerpt: post.excerpt,
			content: post.content,
			contentJson: post.contentJson || '[]'
		},
	})

	const updatePostMutation = useMutation({
		mutationFn: useServerFn(updatePost),
	})

	const router = useRouter()
	const queryClient = useQueryClient();

	const [loaded, setLoaded] = useState<boolean>(false)

	const editor = useCreateBlockNote({
		initialContent: form.getValues("contentJson") ? JSON.parse(form.getValues("contentJson")) : [{ type: "paragraph", content: "" }],
		uploadFile: async (file: File) => {
			const formData = new FormData();
			formData.append("file", file);
			const result = await uploadImage({ data: formData })
			return result.data?.url || "";
		},
	})



	// Добавляем эффект для подписки на изменения редактора
	// useEffect(() => {
	//   if (!editor) return;

	//   const handleEditorChange = async () => {
	//     try {
	//       // Обновляем значения формы при каждом изменении редактора
	//       const contentJson = JSON.stringify(editor.document);
	//       const content = await editor.blocksToHTMLLossy(editor.document);

	//       form.setValue('contentJson', contentJson, { shouldValidate: true });
	//       form.setValue('content', content, { shouldValidate: true });
	//     } catch (error) {
	//       console.error('Error updating editor content:', error);
	//     }
	//   };

	//   // Подписываемся на изменения документа
	//   editor.onChange(handleEditorChange);

	//   // Отписываемся при размонтировании
	//   return () => {
	//     editor.onChange(()=>{});
	//   };
	// }, [editor, form]);
	// useEffect(() => {
	// 	// В useEffect - код, использующий document (то есть только на клиенте)
	// 	const parsedContent = post.contentJson ? JSON.parse(post.contentJson) : []

	// 	const newEditor = useCreateBlockNote({
	// 		//initialContent: //form.watch("contentJson")
	// 		//? JSON.parse(form.watch("contentJson"))
	// 		//[{
	// 		//        type: "paragraph",
	// 		//        content: "Start editing your post here..."
	// 		//      }],
	// 		uploadFile: async (file: File) => {
	// 			const formData = new FormData();
	// 			formData.append("file", file);
	// 			const result = await uploadImage({ data: formData })
	// 			return result.data?.url || "";
	// 		},
	// 	})

	// 	setEditor(newEditor)

	// 	// Очистка редактора при размонтировании компонента
	// 	return () => {
	// 		newEditor.destroy()
	// 	}
	// }, [post.contentJson])
	// Используем хук для создания редактора
	useEffect(() => {
		setLoaded(true)
	}, [])

	if (!loaded || !editor) {
		// Пока редактор не инициализирован (например, на сервере или при первой загрузке)
		return <PageLoader type="page" />
	}

	async function onSubmit(values: z.infer<typeof UpdatePost>) {
		try {
			// ДОБАВИТЬ ВОТ ЭТИ ИЗМЕНЕНИЯ в ПОЛЯХ формы при изменении текста в редакторе
			values.contentJson = JSON.stringify(editor.document)
			values.content = await editor.blocksToHTMLLossy(editor.document)
			if (!values.slug || values.slug.trim() === '') {
				values.slug = slugify(values.title, {lowercase: true, customReplacements: [['.', '']]})
			}
			await updatePostMutation.mutateAsync({ data: values })
			toast('Post has been updated')
			router.invalidate()
			queryClient.invalidateQueries({
				queryKey: ['posts'],
			})
			queryClient.invalidateQueries({
				queryKey: ['posts', values.slug],
			})
			router.navigate({ to: '/dashboard/posts' })
		} catch (error: unknown) {
			toast(`Error while editing post: ${error}`, {
				style: {
					color: 'red',
				},
				icon: <CircleAlert />,
			})
		}
	}

	return (
		<div className='mt-6'>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-9">
					<FormInput form={form} name="slug" label="Slug" placeholder="Enter post slug" />
					<FormField
						control={form.control}
						name='title'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Title</FormLabel>
								<FormControl>
									<Input placeholder="Enter post title" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='excerpt'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Excerpt</FormLabel>
								<FormControl>
									<Input placeholder="Enter post excerpt" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='contentJson'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Content</FormLabel>
								<FormControl>

									<BlockNoteTextEditor
										className="min-h-[300px] rounded-md border"
										editor={editor}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" disabled={form.formState.isSubmitting}>
						{form.formState.isSubmitting && <LoaderCircle className="animate-spin" />}
						{form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
					</Button>
				</form>
			</Form>
		</div>
	)
}
