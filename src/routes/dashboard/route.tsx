import { AppSidebar } from '@/components/AppSidebar'
import { AvatarDropdown } from '@/components/navbar/AvatarDropdown'
import { NavUser } from '@/components/NavUser'
import ThemeToggle from '@/components/ThemeToggle'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Outlet, createFileRoute, useLocation } from '@tanstack/react-router'
import { Fragment } from 'react/jsx-runtime'

export const Route = createFileRoute('/dashboard')({
  component: IndexComponent,
})

function IndexComponent() {
  const location = useLocation()
  const pathname = location.pathname
  const paths = pathname.split('/').filter(Boolean) // Убираем пустые элементы
  const breadcrumbs = paths.map((path, index) => ({
    label: path,
    href: `/${paths.slice(0, index + 1).join('/')}`,
  }))

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="min-h-svh flex-1 p-4">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <ThemeToggle />
          <Breadcrumb>
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
        </header>
        <Outlet />
      </main>
    </SidebarProvider>
  )
}
