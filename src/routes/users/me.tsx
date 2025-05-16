import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { auth } from '@/lib/auth'

const getMe = createServerFn({ method: 'GET' }).handler(async () => {
  const me = await auth.api.getSession({ headers: {} })
  return me
})

export const Route = createFileRoute('/users/me')({
  component: RouteComponent,
  loader: () => {
    return getMe()
  },
})

function RouteComponent() {
  const me = Route.useLoaderData()
  return <div>{JSON.stringify(me)}</div>
}
