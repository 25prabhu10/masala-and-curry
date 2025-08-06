import { Card, CardDescription, CardHeader, CardTitle } from '@mac/web-ui/card'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/categories/$category-id/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Category</CardTitle>
        <CardDescription>Update the details of the category.</CardDescription>
      </CardHeader>
    </Card>
  )
}
