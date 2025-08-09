import { Button } from '@mac/web-ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@mac/web-ui/sidebar'
import { Link } from '@tanstack/react-router'
import { Boxes, Hamburger, Home, LayoutDashboard } from 'lucide-react'

import type { NavigationItem } from '@/lib/types'

const items = [
  {
    icon: Hamburger,
    label: 'Food Menu',
    to: '/dashboard/menu-items',
  },
  {
    icon: Boxes,
    label: 'Categories',
    to: '/dashboard/categories',
  },
] as const satisfies ReadonlyArray<NavigationItem>

export function DashboardSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <h3 className="flex items-center justify-center space-x-2 text-lg">
          <LayoutDashboard className="size-5" />
          <span>Dashboard</span>
        </h3>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    <Link className="[&.active]:text-primary" to={item.to}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button asChild size="sm">
          <Link to="/">
            <Home className="h-4 w-4 mr-2" />
            Home
          </Link>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
