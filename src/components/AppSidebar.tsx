import { Home, Newspaper, UsersRound } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Link } from '@tanstack/react-router'
import { NavUser } from './NavUser'
import { ThemeModeToggle } from './ThemeModeToggle'

// Menu items.
const items = [
  {
    title: 'Home',
    url: '/',
    icon: Home,
  },
  {
    title: 'Posts',
    url: '/dashboard/posts',
    icon: Newspaper,
  },
  {
    title: 'Users',
    url: '/dashboard/users',
    icon: UsersRound,
  },
]

export function AppSidebar() {
  return (
    <Sidebar
      style={
        {
          //"--sidebar-width": "calc(var(--spacing) * 42)",
          //"--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Blog</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={`${item.url}`} preload="intent" activeProps={{ className: "font-bold" }}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>
			<SidebarFooter>
					<NavUser />
				</SidebarFooter>
    </Sidebar>
  )
}
