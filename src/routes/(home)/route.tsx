import Navbar from '@/components/navbar/Navbar'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { categories } from './-categories'

export const Route = createFileRoute('/(home)')({
  component: HomeLayoutComponent,
})

function HomeLayoutComponent() {
  return (
    <>
      <Navbar />
      <div className="mx-auto flex max-w-screen-xl flex-col justify-between gap-12 px-6 py-10 lg:flex-row lg:py-16 xl:px-0">
        <Outlet />
        <aside className="sticky top-8 w-full shrink-0 lg:max-w-sm">
          <h3 className="font-bold text-3xl tracking-tight">Categories</h3>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1">
            {categories.map((category) => (
              <div
                key={category.name}
                className={cn(
                  'flex items-center justify-between gap-2 rounded-md bg-muted bg-opacity-15 p-3 dark:bg-opacity-25',
                  category.background
                )}
              >
                <div className="flex items-center gap-3">
                  <category.icon className={cn('h-5 w-5', category.color)} />
                  <span className="font-medium">{category.name}</span>
                </div>
                <Badge className="rounded-full px-1.5">{category.totalPosts}</Badge>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </>
  )
}
