import { Button } from '@mac/web-ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@mac/web-ui/card'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { CheckCircle, Home, LogOut, User } from 'lucide-react'
import * as z from 'zod'
import { SignInForm } from '@/components/auth/sign-in-form'
import { signOut } from '@/lib/auth-client'

export const Route = createFileRoute('/_auth/sign-in')({
  component: RouteComponent,
  loader: async ({ context }) => {
    return { user: context.userSession?.user }
  },
  validateSearch: z.object({
    callback: z.string().optional(),
  }),
})

function RouteComponent() {
  const { callback } = Route.useSearch()
  const { user } = Route.useLoaderData()
  const navigate = Route.useNavigate()
  const router = useRouter()

  if (user) {
    return (
      <main className="flex-1 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/10 p-4 flex flex-col justify-center">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <Card className="w-full max-w-md border-primary/20">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl font-semibold">Already Signed In</CardTitle>
                <CardDescription className="text-base">
                  Welcome back! You're already signed in to your Masala and Curry account.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="rounded-lg bg-muted/50 p-4 text-center">
                  <User className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Signed in as: <span className="font-medium text-foreground">{user.name}</span>
                  </p>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                  <Button asChild className="w-full">
                    <Link to={callback ?? '/'}>
                      <Home className="h-4 w-4 mr-2" />
                      Continue
                    </Link>
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() => {
                      signOut().then(() => {
                        router.invalidate().finally(() => {
                          navigate({ to: '/' })
                        })
                      })
                    }}
                    variant="outline"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center mt-2">
                  Ready to order some delicious food? Browse our menu and place your order!
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/10 p-4 flex flex-col justify-center">
      <div className="w-full mx-auto max-w-md">
        <section>
          <SignInForm callback={callback} />
        </section>
        <div className="text-center mt-8">
          <p className="text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link
              className="text-primary hover:text-primary/80 font-medium transition-colors"
              to="/sign-up"
            >
              Sign up
            </Link>
          </p>
        </div>

        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground text-balance">
            By signing in, you agree to our{' '}
            <span className="text-primary underline underline-offset-4">Terms of Service</span> and{' '}
            <span className="text-primary underline underline-offset-4">Privacy Policy</span>
          </p>
        </div>
      </div>
    </main>
  )
}
