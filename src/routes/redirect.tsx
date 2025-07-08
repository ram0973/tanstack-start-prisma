import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/redirect')({
  beforeLoad: async () => {
    throw redirect({
      to: '/dashboard/users',
    })
  },
})
