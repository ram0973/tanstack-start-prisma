import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/blog/edit/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  return <div>Post ID: {id}</div>
}
