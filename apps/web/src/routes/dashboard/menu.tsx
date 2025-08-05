import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/menu')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Menu</h1>
    </div>
  )
}
