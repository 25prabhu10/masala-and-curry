import { getUserByIdQuery, updateUserQuery, userKeys } from '@mac/queries/user'
import {
  FORM_SUBMISSION_ERROR_DESC,
  UNEXPECTED_ERROR_DESC,
  UPDATE_SUCCESS_DESC,
} from '@mac/resources/general'
import { CONFLICT, UNPROCESSABLE_ENTITY } from '@mac/resources/http-status-codes'
import { type UpdateUser, updateUserValidator } from '@mac/validators/user'
import { Button } from '@mac/web-ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@mac/web-ui/card'
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { User as UserIcon } from 'lucide-react'
import { toast } from 'sonner'

import { useAppForm } from '@/hooks/use-form'

export const Route = createFileRoute('/(app)/(protected)/profile/edit')({
  component: RouteComponent,
  loader: ({ context }) => context.session,
})

function RouteComponent() {
  const session = Route.useLoaderData()
  const { data: user } = useSuspenseQuery(getUserByIdQuery(session.userId))
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const UpdateProfile = useMutation(updateUserQuery(user.id))

  const form = useAppForm({
    defaultValues: {
      email: user.email,
      image: user.image,
      name: user.name,
      phoneNumber: user.phoneNumber,
    } as UpdateUser,
    onSubmitInvalid: () => {
      toast.error(FORM_SUBMISSION_ERROR_DESC)
    },
    validators: {
      onChange: updateUserValidator,
      onSubmitAsync: async ({ value }) => {
        try {
          const res = await UpdateProfile.mutateAsync(value)

          if (res.ok) {
            toast.success(UPDATE_SUCCESS_DESC)
            await queryClient.invalidateQueries({ queryKey: userKeys.user(user.id) })
            await navigate({ to: '/profile' })

            return null
          }

          if (res.status === CONFLICT) {
            const responseData = await res.json()
            return { form: responseData.message }
          } else if (res.status === UNPROCESSABLE_ENTITY) {
            const responseErrors = await res.json()

            return {
              fields: responseErrors,
              form: responseErrors.errors?.join(', '),
            }
          }

          return null
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
    <main className="flex-1 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/10 p-4 flex flex-col justify-center">
      <div className="w-full mx-auto max-w-md">
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">Edit Profile</h1>
            <p className="text-lg text-muted-foreground">Update your account information</p>
          </div>

          <Card>
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
              }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <UserIcon className="h-5 w-5 text-primary" />
                  Personal Information
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Update your basic account information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <form.AppField
                  children={(field) => (
                    <field.TextField
                      autoComplete="name"
                      className="h-12"
                      label="Full Name"
                      placeholder="Your full name"
                      required
                      title="Enter your full name"
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
                    <field.TextField
                      autoComplete="tel"
                      className="h-12"
                      label="Phone Number"
                      placeholder="+1xxxxxxxxxx"
                      required
                      type="tel"
                    />
                  )}
                  name="phoneNumber"
                />
                <form.AppForm>
                  <form.FormErrors />
                </form.AppForm>
              </CardContent>

              <CardFooter className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Button
                  className="order-2 h-12 sm:order-1"
                  onClick={() => navigate({ to: '/profile' })}
                  type="button"
                  variant="outline"
                >
                  Cancel
                </Button>
                <form.AppForm>
                  <form.SubmitButton className="h-12 order-1 sm:order-2" label="Save Changes" />
                </form.AppForm>
              </CardFooter>
            </form>
          </Card>
        </section>
      </div>
    </main>
  )
}
