import { prisma } from '@/lib/prisma'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

export const fetchPosts = createServerFn({ method: 'GET' }).handler(
  async () => {
    const posts = await prisma.post.findMany()
    if (!posts) {
      throw new Error('Failed to fetch posts')
    }
    return posts
  },
)

export const Route = createFileRoute('/dashboard/blog/posts')({
  loader: async () => fetchPosts(),
  component: PostsLayoutComponent,
})

function PostsLayoutComponent() {
  const posts = Route.useLoaderData()
  console.log(posts)
  return (
  <>
  <div>Hello "/dashboard/blog/posts"!</div>
  {posts.map((post) => (
    <div key={post.id}>{post.title}</div>
  ))}
  </>
)

}
