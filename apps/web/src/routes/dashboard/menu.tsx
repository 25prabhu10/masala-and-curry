import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/menu')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <section className="bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 py-20 lg:py-32">
      <div className="container mx-auto py-10"></div>
    </section>
  )
}
