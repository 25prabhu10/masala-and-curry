import { createCategoryMutation, updateCategoryMutation } from '@mac/queries/category'
import { MAX_NUMBER_IN_APP, MAX_STRING_LENGTH, MIN_STRING_LENGTH } from '@mac/resources/constants'
import { createDataSuccessDesc, UPDATE_SUCCESS_DESC } from '@mac/resources/general'
import { FieldErrors, FormErrors } from '@mac/validators/api-errors'
import {
  type Category,
  type CreateCategory,
  createCategoryValidator,
  type UpdateCategoryInput,
  updateCategoryValidator,
} from '@mac/validators/category'
import { Button } from '@mac/web-ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@mac/web-ui/card'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

import { useAppForm } from '@/hooks/use-form'
import type { SelectOption } from '@/lib/types'

const activeOptions: SelectOption[] = [
  {
    label: 'Yes',
    value: 'true',
  },
  {
    label: 'No',
    value: 'false',
  },
]

type CategoryFormProps = {
  data?: Category
  isNew?: boolean
}

const defaultValues: Category = {
  description: '',
  displayOrder: 0,
  id: '',
  isActive: true,
  name: '',
}

export function CategoryForm({ data = defaultValues, isNew = false }: CategoryFormProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const createMutation = useMutation(createCategoryMutation(queryClient))
  const updateMutation = useMutation(updateCategoryMutation(data.id, queryClient))

  const form = useAppForm({
    defaultValues: data as CreateCategory | UpdateCategoryInput,
    validators: {
      onChange: isNew ? createCategoryValidator : updateCategoryValidator,
      onSubmitAsync: async ({ value }) => {
        try {
          if (isNew) {
            await createMutation.mutateAsync(value as CreateCategory)
            toast.success(createDataSuccessDesc(value.name ?? 'Category'))
          } else {
            await updateMutation.mutateAsync(value as UpdateCategoryInput)
            toast.success(UPDATE_SUCCESS_DESC)
          }
          navigate({ to: '/dashboard/categories' })
        } catch (error) {
          if (error instanceof FieldErrors || error instanceof FormErrors) {
            toast.error(error.message)
            return error.errorRes
          }

          if (error instanceof Error) {
            toast.error(error.message)
          }
        }
      },
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isNew ? 'Create' : 'Edit'} Category</CardTitle>
        <CardDescription>
          {isNew ? 'Add details for a new Category' : 'Update the details of the category.'}{' '}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-2"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <form.AppField
              children={(field) => (
                <field.TextField
                  className="h-12"
                  label="Name"
                  maxLength={MAX_STRING_LENGTH}
                  minLength={MIN_STRING_LENGTH}
                  required
                  title="Enter category name"
                  type="text"
                />
              )}
              name="name"
            />
            <form.AppField
              children={(field) => (
                <field.TextField
                  className="h-12"
                  label="Description"
                  maxLength={MAX_STRING_LENGTH}
                  title="Enter category description"
                  type="text"
                />
              )}
              name="description"
            />
            <form.AppField
              children={(field) => (
                <field.TextField
                  className="h-12"
                  label="Display Order"
                  max={MAX_NUMBER_IN_APP}
                  min={0}
                  required
                  title="What is display order of this category?"
                  type="number"
                />
              )}
              name="displayOrder"
            />
            <form.AppField
              children={(field) => (
                <field.SelectField
                  className="h-12"
                  label="Is category active?"
                  options={activeOptions}
                  required
                  title="Whether the category is active and visible"
                />
              )}
              name="isActive"
            />
          </div>

          <form.AppForm>
            <form.FormErrors />
          </form.AppForm>

          <div className="grid grid-cols-2 gap-4 max-w-xl">
            <form.AppForm>
              <Button asChild className="h-12 en" variant="outline">
                <Link to="/dashboard/categories">Cancel</Link>
              </Button>
              <form.SubmitButton className="h-12" label="Save" />
            </form.AppForm>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
