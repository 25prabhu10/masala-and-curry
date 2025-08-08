import { createFileRoute } from '@tanstack/react-router'

import { CategoryForm } from '@/components/dashboard/category/category-form'

export const Route = createFileRoute('/dashboard/categories/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <CategoryForm isNew={true} />
}
