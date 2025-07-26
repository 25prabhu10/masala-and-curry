import { allUserKeys } from '@mac/queries/user'
import { FORM_SUBMISSION_ERROR_DESC, UNEXPECTED_ERROR_DESC } from '@mac/resources/general'
import {
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
  UNPROCESSABLE_ENTITY,
} from '@mac/resources/http-status-codes'
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
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { User as UserIcon } from 'lucide-react'
import { toast } from 'sonner'

import { useAppForm } from '@/hooks/use-form'
import apiClient from '@/lib/api-client'
import { formatFormErrors } from '@/lib/utils'

async function updateUserProfile(id: string, data: UpdateUser) {
  const res = await apiClient.api.v1.users.users[':id'].$post({
    json: data,
    param: { id },
  })

  if (res.status === INTERNAL_SERVER_ERROR) {
    const responseData = await res.json()
    throw new Error(responseData.message ?? 'An error occurred while updating your profile')
  }

  return res
}

export const Route = createFileRoute('/_protected/profile/edit')({
  component: RouteComponent,
  loader: async ({ context }) => {
    return { user: context.userSession.user }
  },
})

function RouteComponent() {
  const { user } = Route.useLoaderData()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const UpdateProfile = useMutation({
    mutationFn: async (data: UpdateUser) => await updateUserProfile(user.id, data),
  })

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

          if (res.status === OK) {
            const responseData = await res.json()

            if ('message' in responseData) {
              toast.success(responseData.message)
            } else {
              toast.success('Profile updated successfully')
              await queryClient.resetQueries({ queryKey: allUserKeys })
            }
            navigate({ to: '/profile' })
            return null
          } else if (res.status === CONFLICT || res.status === NOT_FOUND) {
            const responseData = await res.json()
            return { form: responseData.message }
          } else if (res.status === UNPROCESSABLE_ENTITY) {
            const responseErrors = await res.json()

            return {
              fields: formatFormErrors(responseErrors),
              form: responseErrors.errors?.join(', '),
            }
          }
          return null
        } catch {
          return { form: UNEXPECTED_ERROR_DESC }
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
