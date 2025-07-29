import { Button } from '@mac/web-ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@mac/web-ui/card'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, Home, ShieldX } from 'lucide-react'
import * as z from 'zod'

export const Route = createFileRoute('/not-authorized')({
  component: RouteComponent,
  validateSearch: z.object({
    callback: z.string().optional(),
  }),
})

function RouteComponent() {
  const { callback } = Route.useSearch()

  return (
    <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 py-20 lg:py-32">
      <section className="container">
        <Card className="mx-auto max-w-md border-destructive/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <ShieldX className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-semibold">Access Denied</CardTitle>
            <CardDescription className="text-base">
              You don&apos;t have permission to access this page. Please sign in with an authorized
              account or contact support if you believe this is an error.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col gap-3">
            <div className="grid grid-cols-1 gap-3 w-full">
              <Button asChild className="w-full" variant="outline">
                <Link from={Route.fullPath} to="/">
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Link>
              </Button>
            </div>

            {callback && (
              <Button asChild className="w-full" variant="ghost">
                <Link
                  from={Route.fullPath}
                  onClick={(e) => {
                    e.preventDefault()
                    globalThis.history.back()
                  }}
                  to="/"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Link>
              </Button>
            )}

            <p className="text-xs text-muted-foreground text-center mt-2">
              Need help? Contact our support team for assistance with account access.
            </p>
          </CardFooter>
        </Card>
      </section>
    </main>
  )
}
