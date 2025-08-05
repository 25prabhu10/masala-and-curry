import { createFileRoute, Link } from '@tanstack/react-router'

import { SignInForm } from '@/components/auth/sign-in-form'

export const Route = createFileRoute('/(auth)/sign-in')({
  component: RouteComponent,
})

function RouteComponent() {
  const { callback } = Route.useSearch()

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
              from={Route.fullPath}
              search={{ callback }}
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
