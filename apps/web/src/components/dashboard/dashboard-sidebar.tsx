import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@mac/web-ui/sidebar'
import { Link } from '@tanstack/react-router'
import { Boxes, Hamburger, LayoutDashboard } from 'lucide-react'

const items = [
  {
    icon: Hamburger,
    title: 'Food Menu',
    url: '/dashboard/menu',
  },
  {
    icon: Boxes,
    title: 'Categories',
    url: '/dashboard/categories',
  },
]

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
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link className="[&.active]:text-primary" to={item.url}>
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
    </Sidebar>
  )
}
