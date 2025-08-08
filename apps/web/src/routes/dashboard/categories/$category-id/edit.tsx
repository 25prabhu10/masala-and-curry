import { getCategoryByIdQuery } from '@mac/queries/category'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { CategoryForm } from '@/components/dashboard/category/category-form'

export const Route = createFileRoute('/dashboard/categories/$category-id/edit')({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params }) => {
    await queryClient.ensureQueryData(getCategoryByIdQuery(params['category-id']))
  },
})

function RouteComponent() {
  const params = Route.useParams()

  const { data } = useSuspenseQuery(getCategoryByIdQuery(params['category-id']))

  return <CategoryForm data={data} isNew={false} />
}
