import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start';
import { auth } from '~/lib/auth';

const getMe = createServerFn({ method: "GET" }).handler(async () => {
  const me = await auth.api.getSession({headers: {}})
  console.info(me);
  return me;
});

export const Route = createFileRoute('/users/me')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/users/me"!</div>
}
