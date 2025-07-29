import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@mac/web-ui/sidebar'
import { Link } from '@tanstack/react-router'
import { Calendar, Home, Inbox, Search, Settings } from 'lucide-react'

// Menu items.
const items = [
  {
    icon: Home,
    title: 'Home',
    url: '/',
  },
  {
    icon: Inbox,
    title: 'Inbox',
    url: '/',
  },
  {
    icon: Calendar,
    title: 'Calendar',
    url: '/',
  },
  {
    icon: Search,
    title: 'Search',
    url: '/',
  },
  {
    icon: Settings,
    title: 'Settings',
    url: '/',
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
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
