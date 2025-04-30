import { createFileRoute, Link } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Calendar, ClockIcon } from 'lucide-react'
import { categories } from './-categories'
import { getHomePosts } from '@/server/posts'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

const postsQueryOptions = () =>
  queryOptions({
    queryKey: ['homePosts'],
    queryFn: getHomePosts,
  })

export const Route = createFileRoute('/(home)/')({
  component: Home,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(postsQueryOptions())
  },
  head: () => ({
    meta: [{ title: 'Home sweet home' }],
  }),
})

function Home() {
  const { data: posts } = useSuspenseQuery(postsQueryOptions())

  return (
    <div>
      <div className="mt-4 space-y-12">
        <h2 className="font-bold text-3xl tracking-tight">Posts</h2>
        {posts?.map((post) => (
          <Card
            key={post.slug}
            className="flex flex-col gap-4 overflow-hidden border-none shadow-none sm:flex-row sm:gap-6"
          >
            <div className="flex-shrink-0 sm:w-56">
              <div className="aspect-video rounded-lg bg-muted sm:aspect-square" />
            </div>
            <div className="flex-1 p-4 sm:p-6">
              <div className="flex items-center gap-6">
                <Badge className="bg-primary/5 text-primary shadow-none hover:bg-primary/5">Technology</Badge>
              </div>
              <h3 className="mt-4 font-semibold text-2xl tracking-tight">
                <Link to={`/posts/${post.slug}`}>{post.title}</Link>
              </h3>
              {post.excerpt?.substring(0, 150)} ...
              <div className="mt-4 flex items-center gap-6 font-medium text-muted-foreground text-sm">
                <div className="flex items-center gap-2">
                  <ClockIcon className="h-4 w-4" /> 5 min read
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> {post.createdAt.toLocaleString()}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
