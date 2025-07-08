import { NotFound } from '@/components/NotFound';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { getPostBySlug } from '@/server/posts';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import type { ErrorComponentProps } from '@tanstack/react-router';
import { createFileRoute, ErrorComponent } from '@tanstack/react-router';
import { Fragment } from 'react/jsx-runtime';

const postQueryOptions = (slug: string) =>
	queryOptions({
		queryKey: ["posts", slug],
		queryFn: () => getPostBySlug({ data: slug }),
	})

export const Route = createFileRoute('/(home)/posts/$slug')({
	loader: async ({ context, params: { slug } }) => {
		await context.queryClient.ensureQueryData(postQueryOptions(slug))
	},
	errorComponent: PostErrorComponent,
	component: PostComponent,
	notFoundComponent: PostNotFoundComponent,
})

function PostErrorComponent({ error }: ErrorComponentProps) {
	return <ErrorComponent error={error} />
}

function PostNotFoundComponent() {
	return <NotFound>Post not found</NotFound>
}

function PostComponent() {
	const params = Route.useParams()
	const { data: post } = useSuspenseQuery(postQueryOptions(params.slug))
	const paths = location.pathname.split('/').filter(Boolean)
	const breadcrumbs = paths.map((path, index) => ({
		label: path,
		href: `/${paths.slice(0, index + 1).join('/')}`,
	}))

	return (
		<div className='flex flex-col'>
			<Breadcrumb className='mb-6'>
				<BreadcrumbList>
					{/* Главный элемент (домашняя страница) */}
					<BreadcrumbItem key="home">
						<BreadcrumbLink href="/" className="text-sm capitalize">
							Home
						</BreadcrumbLink>
					</BreadcrumbItem>

					{/* Остальные элементы */}
					{breadcrumbs.map((item) => (
						<Fragment key={item.href}>
							<BreadcrumbSeparator key={`${item.href}-sep`} />
							<BreadcrumbItem>
								<BreadcrumbLink href={item.href} className="text-sm capitalize">
									{item.label}
								</BreadcrumbLink>
							</BreadcrumbItem>
						</Fragment>
					))}
				</BreadcrumbList>
			</Breadcrumb>

			<div className="space-y-2">
				<h2 className="font-bold text-xl">{post?.title}</h2>
				{/** biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
				<div dangerouslySetInnerHTML={{ __html: post ? post.content : '' }} />
			</div>
		</div>
	)
}
