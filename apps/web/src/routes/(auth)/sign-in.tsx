import { Trans } from '@lingui/react/macro'
import { createFileRoute, Link } from '@tanstack/react-router'
import { SignInForm } from '@/components/sign-in-form'

export const Route = createFileRoute('/(auth)/sign-in')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="flex-1 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/10 p-4 flex flex-col justify-center">
      <div className="w-full mx-auto max-w-md">
        <div className="text-center space-y-6 mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              <Trans>Welcome Back</Trans>
            </h1>
            <p className="text-muted-foreground">
              <Trans>Sign in to your Masala & Curry account</Trans>
            </p>
          </div>
        </div>
        <SignInForm />
        <div className="text-center mt-8">
          <p className="text-muted-foreground">
            <Trans>Don't have an account?</Trans>{' '}
            <Link
              className="text-primary hover:text-primary/80 font-medium transition-colors"
              to="/sign-up"
            >
              <Trans>Sign up</Trans>
            </Link>
          </p>
        </div>

        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground text-balance">
            <Trans>
              By signing in, you agree to our{' '}
              <span className="text-primary underline underline-offset-4">Terms of Service</span>{' '}
              and <span className="text-primary underline underline-offset-4">Privacy Policy</span>
            </Trans>
          </p>
        </div>
      </div>
    </main>
  )
}
