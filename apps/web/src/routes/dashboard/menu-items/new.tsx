import { createFileRoute } from '@tanstack/react-router'

import { MenuItemForm } from '@/components/dashboard/menu-item/menu-item-form'

export const Route = createFileRoute('/dashboard/menu-items/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <MenuItemForm isNew={true} />
}
