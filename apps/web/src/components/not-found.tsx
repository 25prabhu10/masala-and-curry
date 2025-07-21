import type { ReactNode } from 'react'
import { Button } from '@mac/web-ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@mac/web-ui/card'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, Home, Search } from 'lucide-react'

export function NotFound({ children }: { children?: ReactNode }) {
  return (
    <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 py-20 lg:py-32">
      <section className="container">
        <Card className="mx-auto max-w-md border-muted/40">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/20">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl font-semibold">Page Not Found</CardTitle>
            <CardDescription className="text-base">
              {children ?? (
                <>
                  The page you're looking for doesn't exist. It might have been moved, deleted, or
                  you entered the wrong URL.
                </>
              )}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <p className="text-sm text-muted-foreground">
                Lost? No worries! You can return to our homepage or try searching for what you need
                from our menu.
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              <Button asChild className="w-full">
                <Link to="/">
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link
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
            </div>

            <p className="text-xs text-muted-foreground text-center mt-2">
              Looking for our delicious food? Check out our menu and place your order!
            </p>
          </CardFooter>
        </Card>
      </section>
    </main>
  )
}
