import Navbar from '@/components/navbar/Navbar'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const REDIRECT_URL = '/dashboard'
    // if (context.user) {
    //   throw redirect({
    //     to: REDIRECT_URL,
    //   })
    // }
    return {
      redirectUrl: REDIRECT_URL,
    }
  },
})

function RouteComponent() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar className="h-16" /> {/* Фиксированная высота навбара */}
      <div className="flex flex-1 items-center justify-center bg-background p-6 md:p-10">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
