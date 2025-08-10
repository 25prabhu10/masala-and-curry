import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/menu-items')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <section className="container w-full mx-auto p-10">
      <Outlet />
    </section>
  )
}
