import { BlockNoteTextEditor } from '@/components/BlockNoteTextEditor'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { createPost } from '@/server/posts'
import { uploadImage } from '@/server/uploads'
import { createHighlighter } from '@/shiki.bundle'
import { CreatePost } from '@/types/posts/CreatePost'
import { useCreateBlockNote } from "@blocknote/react"
import { zodResolver } from '@hookform/resolvers/zod'
import slugify from '@sindresorhus/slugify'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, ErrorComponent, type ErrorComponentProps, useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { CircleAlert, LoaderCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'

export const Route = createFileRoute('/dashboard/posts/create')({
	component: CreatePostForm,
	errorComponent: PostErrorComponent,
})

function PostErrorComponent({ error }: ErrorComponentProps) {
	return <ErrorComponent error={error} />
}

function CreatePostForm() {

	const form = useForm<z.infer<typeof CreatePost>>({
		resolver: zodResolver(CreatePost),
		defaultValues: {
			slug: '',
			title: '',
			excerpt: '',
			content: '',
			contentJson: '',
		},
	})

	const createPostMutation = useMutation({
		mutationFn: useServerFn(createPost),
	})

	const router = useRouter()
	const queryClient = useQueryClient();
	const editor = useCreateBlockNote({
		initialContent: [{ type: "paragraph", content: "" }],
		uploadFile: async (file: File) => {
			const formData = new FormData();
			formData.append("file", file);
			const result = await uploadImage({ data: formData })
			return result.data?.url || "";
		},
		codeBlock: {
			indentLineWithTab: true,
			defaultLanguage: "typescript",
			supportedLanguages: {
				typescript: {
					name: "TypeScript",
					aliases: ["ts"],
				},
				javascipt: {
					name: "JavaScript",
					aliases: ["js"],
				},
				java: {
					name: "Java",
					aliases: ["java"],
				},
			},
			createHighlighter: () =>
				createHighlighter({
					themes: ['github-dark-dimmed', 'github-light-default'],
					langs: ['typescript', 'javascript', 'java',],
				}),

		},
	})

	async function onSubmit(values: z.infer<typeof CreatePost>) {
		try {
			values.contentJson = JSON.stringify(editor.document)
			values.content = await editor.blocksToHTMLLossy(editor.document)
			if (!values.slug || values.slug.trim() === '') {
				values.slug = slugify(values.title, { lowercase: true, customReplacements: [['.', '']] })
			}
			await createPostMutation.mutateAsync({ data: values })
			toast('Post has been created')
			router.invalidate()
			queryClient.invalidateQueries({
				queryKey: ['posts'],
			})
			router.navigate({ to: "/dashboard/posts" })
		} catch (error: unknown) {
			toast(`Error while creating post: ${error}`, {
				style: {
					color: 'red'
				},
				icon: <CircleAlert />
			})
		}
	}

	return (
		<>
			<title>Posts | Create post</title>
			<h1 className="mt-5 mb-5 text-3xl">Create post</h1>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<FormField
						control={form.control}
						name="slug"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Slug</FormLabel>
								<FormControl>
									<Input placeholder="Enter post slug" {...field} />
								</FormControl>
								<FormDescription></FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Title</FormLabel>
								<FormControl>
									<Input placeholder="Enter post title" {...field} />
								</FormControl>
								<FormDescription></FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="excerpt"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Excerpt</FormLabel>
								<FormControl>
									<Input placeholder="Enter post excerpt" {...field} />
								</FormControl>
								<FormDescription></FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="contentJson"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Content</FormLabel>
								<FormControl>
									<BlockNoteTextEditor className="min-h-[300px] rounded-md border" editor={editor}
									/>
								</FormControl>
								<FormDescription></FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" disabled={form.formState.isSubmitting}>
						{form.formState.isSubmitting && <LoaderCircle className="animate-spin" />}
						{form.formState.isSubmitting ? 'Submitting...' : 'Submit'}</Button>
				</form>
			</Form>
		</>
	)
}
