import { userKeys } from '@mac/queries/user'
import {
  FORM_SUBMISSION_ERROR_DESC,
  FORM_SUBMISSION_GENERIC_DESC,
  UNEXPECTED_ERROR_DESC,
} from '@mac/resources/general'
import { Button } from '@mac/web-ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@mac/web-ui/card'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import * as z from 'zod'

import { useAppForm } from '@/hooks/use-form'
import { signUp } from '@/lib/auth-client'

async function signUpEmail(params: {
  name: string
  email: string
  password: string
  confirmPassword: string
}) {
  const res = await signUp.email({
    email: params.email,
    name: params.name,
    password: params.password,
  })

  if (res.error && res.error.status >= 500) {
    throw new Error(UNEXPECTED_ERROR_DESC)
  }

  return res
}

type SignUpFormProps = {
  callback?: string
}

export function SignUpForm({ callback }: SignUpFormProps) {
  const router = useRouter()
  const navigate = useNavigate({ from: '/sign-up' })
  const queryClient = useQueryClient()

  const signUpMutation = useMutation({
    mutationFn: signUpEmail,
  })

  const form = useAppForm({
    defaultValues: {
      confirmPassword: '',
      email: '',
      name: '',
      password: '',
    },
    onSubmitInvalid: () => {
      toast.error(FORM_SUBMISSION_ERROR_DESC)
    },
    validators: {
      onChange: z
        .object({
          confirmPassword: z.string(),
          email: z.email('Invalid email').max(255, 'Email must be at most 255 characters long'),
          name: z
            .string()
            .min(2, 'Name must be at least 2 characters long')
            .max(100, 'Name must be at most 100 characters long'),
          password: z
            .string()
            .min(8, 'Password must be at least 8 characters long')
            .max(255, 'Password must be at most 255 characters long'),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: 'Passwords do not match',
          path: ['confirmPassword'],
        }),
      onSubmitAsync: async ({ value }) => {
        try {
          const res = await signUpMutation.mutateAsync(value)

          if (!res.error && res.data) {
            toast.success('Account created successfully! You are now signed in.')
            await queryClient.resetQueries({ queryKey: userKeys.all })
            await router.invalidate()

            if (callback) {
              router.history.push(callback)
            } else {
              await navigate({ replace: true, to: '/' })
            }
            return null
          }

          toast.error(FORM_SUBMISSION_ERROR_DESC)

          if (res.error.status === 400) {
            if (res.error.code === 'VALIDATION_ERROR') {
              return { form: FORM_SUBMISSION_GENERIC_DESC }
            } else if (res.error.code?.includes('EMAIL')) {
              return { fields: { email: res.error.message } }
            } else if (res.error.code?.includes('PASSWORD')) {
              return { fields: { password: res.error.message } }
            }
          }
          return { form: res.error.message || UNEXPECTED_ERROR_DESC }
        } catch (error) {
          if (error instanceof Error) {
            toast.error(error.message)
          } else {
            toast.error(UNEXPECTED_ERROR_DESC)
          }
        }
      },
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Create Account</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Enter your information below to create your Masala and Curry account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <form.AppField
            children={(field) => (
              <field.TextField
                autoComplete="name"
                className="h-12"
                label="Full Name"
                placeholder="John Doe"
                required
                title="Enter your full name"
                type="text"
              />
            )}
            name="name"
          />
          <form.AppField
            children={(field) => (
              <field.TextField
                autoComplete="email"
                className="h-12"
                label="Email"
                placeholder="your@email.com"
                required
                title="Enter your email address"
                type="email"
              />
            )}
            name="email"
          />
          <form.AppField
            children={(field) => (
              <field.PasswordField
                autoComplete="new-password"
                className="h-12"
                label="Password"
                placeholder="********"
                required
              />
            )}
            name="password"
          />
          <form.AppField
            children={(field) => (
              <field.PasswordField
                autoComplete="new-password"
                className="h-12"
                label="Confirm Password"
                placeholder="********"
                required
              />
            )}
            name="confirmPassword"
          />
          <form.AppForm>
            <form.FormErrors />
          </form.AppForm>
          <form.AppForm>
            <form.SubmitButton className="w-full h-12" label="Create Account" />
          </form.AppForm>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-6">
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-card text-muted-foreground">Or continue with</span>
          </div>
        </div>
        <div className="w-full grid grid-cols-1 gap-3">
          <Button className="h-12" type="button" variant="outline">
            <svg
              height="1em"
              preserveAspectRatio="xMidYMid"
              viewBox="0 0 256 262"
              width="0.98em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                fill="#4285F4"
              />
              <path
                d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                fill="#34A853"
              />
              <path
                d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                fill="#FBBC05"
              />
              <path
                d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                fill="#EB4335"
              />
            </svg>
            Sign up with Google
          </Button>
          <Button className="h-12" type="button" variant="outline">
            <svg
              height="1em"
              viewBox="0 0 814 1000"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
              xmlSpace="preserve"
            >
              <path
                d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"
                fill="currentColor"
              />
            </svg>
            Sign up with Apple
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
