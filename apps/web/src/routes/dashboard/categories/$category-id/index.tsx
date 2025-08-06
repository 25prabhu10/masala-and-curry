import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/categories/$category-id/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello WHy</div>
}
