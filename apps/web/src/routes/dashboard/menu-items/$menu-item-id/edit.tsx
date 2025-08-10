import { getMenuItemByIdQuery } from '@mac/queries/menu-item'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { MenuItemForm } from '@/components/dashboard/menu-item/menu-item-form'

export const Route = createFileRoute('/dashboard/menu-items/$menu-item-id/edit')({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params }) => {
    await queryClient.ensureQueryData(getMenuItemByIdQuery(params['menu-item-id']))
  },
})

function RouteComponent() {
  const params = Route.useParams()

  const { data } = useSuspenseQuery(getMenuItemByIdQuery(params['menu-item-id']))

  return <MenuItemForm data={data} isNew={false} />
}
