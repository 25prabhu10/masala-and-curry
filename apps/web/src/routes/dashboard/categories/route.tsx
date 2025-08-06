import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/categories')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <section className="w-full mx-auto p-10">
      <Outlet />
    </section>
  )
}
