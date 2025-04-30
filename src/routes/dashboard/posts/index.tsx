import { getAllPosts } from '@/server/posts'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { columns } from './-columns'
import { DataTable } from '@/components/DataTable'
import { Button } from '@/components/ui/button'

const postsQueryOptions = () =>
  queryOptions({
    queryKey: ['posts'],
    queryFn: getAllPosts,
  })

export const Route = createFileRoute('/dashboard/posts/')({
  component: Posts,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(postsQueryOptions())
  },
  head: () => ({
    meta: [{ title: 'Dashboard | Posts' }],
  }),
})

function Posts() {
  const { data: posts } = useSuspenseQuery(postsQueryOptions())

  return (
	<><div className="mt-5 flex justify-end">
		<Button>
			<Link to={"/dashboard/posts/create"}>Create post</Link>
		</Button>
	</div><DataTable data={posts ?? []} columns={columns} findByField="title" /></>)
}
