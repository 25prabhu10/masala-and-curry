import { getCategoriesQuery } from '@mac/queries/category'
import { uploadImageMutation } from '@mac/queries/image'
import { createMenuItemMutation, updateMenuItemMutation } from '@mac/queries/menu-item'
import { MAX_CURRENCY_VALUE, MIN_CURRENCY_VALUE, NUMBER_STEPS } from '@mac/resources/constants'
import { createDataSuccessDesc, UPDATE_SUCCESS_DESC } from '@mac/resources/general'
import { FieldErrors, FormErrors } from '@mac/validators/api-errors'
import {
  type CreateMenuItem,
  createMenuItemValidator,
  type MenuItem,
  type UpdateMenuItemInput,
  updateMenuItemValidator,
} from '@mac/validators/menu-item'
import { Button } from '@mac/web-ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@mac/web-ui/card'
import { useStore } from '@tanstack/react-form'
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useMemo } from 'react'
import { toast } from 'sonner'

import { useAppForm } from '@/hooks/use-form'
import type { SelectOption } from '@/lib/types'

type MenuItemFormProps = { data?: MenuItem; isNew?: boolean }

const defaultValues: MenuItem = {
  basePrice: 0,
  calories: undefined,
  category: null,
  categoryId: '',
  currency: 'USD',
  description: '',
  displayOrder: 0,
  id: '',
  image: undefined,
  ingredients: '',
  isAvailable: true,
  isGlutenFree: false,
  isPopular: false,
  isVegan: false,
  isVegetarian: false,
  name: '',
  preparationTime: 15,
  spiceLevel: 0,
}

const spiceLevels = [
  { description: 'No detectable heat', label: 'Not Spicy', value: 0 },
  { description: 'Slight warmth, palatable for most', label: 'Mild', value: 1 },
  { description: 'Noticeable heat, builds slightly', label: 'Medium', value: 2 },
  { description: 'Strong heat, mouth-watering', label: 'Spicy', value: 3 },
  { description: 'Intense heat, for chili enthusiasts', label: 'Very Spicy', value: 4 },
  {
    description: 'Extreme heat, proceed with caution',
    label: 'Extremely Spicy',
    value: 5,
  },
]

export function MenuItemForm({ data = defaultValues, isNew = false }: MenuItemFormProps) {
  const queryClient = useQueryClient()

  const createMutation = useMutation(createMenuItemMutation(queryClient))
  const updateMutation = useMutation(updateMenuItemMutation(data.id, queryClient))
  const uploadImgMutation = useMutation(uploadImageMutation())

  const categoriesQuery = useSuspenseQuery(getCategoriesQuery({ activeOnly: true }))
  const categoryOptions: SelectOption[] = useMemo(() => {
    const list = categoriesQuery.data?.result ?? []
    return list.map((c) => {
      return { label: c.name, value: c.id }
    })
  }, [categoriesQuery.data])

  const form = useAppForm({
    defaultValues: data as CreateMenuItem | UpdateMenuItemInput,
    validators: {
      onChange: isNew ? createMenuItemValidator : updateMenuItemValidator,
      onSubmitAsync: async ({ value }) => {
        try {
          let payload = value as CreateMenuItem | UpdateMenuItemInput

          // If a new image file is selected, upload it first and set the image URL
          if (form.state.values.file) {
            const response = await uploadImgMutation.mutateAsync(form.state.values.file)

            if (!response.url) {
              throw new Error('Failed to upload image')
            }

            payload = { ...(value as CreateMenuItem | UpdateMenuItemInput), image: response.url }
          }

          if (isNew) {
            await createMutation.mutateAsync(payload as CreateMenuItem)
            toast.success(createDataSuccessDesc((value as CreateMenuItem).name ?? 'Menu Item'))
          } else {
            await updateMutation.mutateAsync(payload as UpdateMenuItemInput)
            toast.success(UPDATE_SUCCESS_DESC)
          }
          globalThis.history.back()
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

  const imageUrl = useStore(form.store, (state) => state.values.image)

  const fullImageUrl = useMemo(() => {
    if (!imageUrl) {
      return undefined
    }
    return `${window.location.origin}${import.meta.env.VITE_BASE_PATH}/images/${imageUrl}`
  }, [imageUrl])

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isNew ? 'Create' : 'Edit'} Menu Item</CardTitle>
        <CardDescription>
          {isNew ? 'Add details for a new item.' : 'Update the details of the menu item.'}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            <form.AppField
              children={(field) => (
                <field.TextField
                  className="h-12"
                  label="Name"
                  required
                  title="Item name"
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
                  title="Short description"
                  type="text"
                />
              )}
              name="description"
            />
            <form.AppField
              children={(field) => (
                <field.TextField
                  className="h-12"
                  inputMode="decimal"
                  label="Price (USD)"
                  max={MAX_CURRENCY_VALUE}
                  min={MIN_CURRENCY_VALUE}
                  required
                  step={NUMBER_STEPS}
                  title="Base price"
                  type="number"
                />
              )}
              name="basePrice"
            />
            <form.AppField
              children={(field) => (
                <field.TextField
                  className="h-12"
                  label="Display Order"
                  min={0}
                  required
                  title="Display Order"
                  type="number"
                />
              )}
              name="displayOrder"
            />
            <form.AppField
              children={(field) => (
                <field.SelectField
                  className="h-12"
                  label="Category"
                  options={categoryOptions}
                  required
                  title="Select category"
                />
              )}
              name="categoryId"
            />
            <form.AppField
              children={(field) => (
                <field.SelectField
                  className="h-12"
                  label="Spice Level"
                  options={spiceLevels}
                  required
                  title="Select spice level"
                />
              )}
              name="spiceLevel"
            />
            <div className="col-span-2 flex flex-wrap gap-4">
              <form.AppField
                children={(field) => <field.CheckboxField label="Vegetarian" />}
                name="isVegetarian"
              />
              <form.AppField
                children={(field) => <field.CheckboxField label="Vegan" />}
                name="isVegan"
              />
              <form.AppField
                children={(field) => <field.CheckboxField label="Gluten-Free" />}
                name="isGlutenFree"
              />
              <form.AppField
                children={(field) => <field.CheckboxField label="Available" />}
                name="isAvailable"
              />
            </div>
          </div>

          <form.AppField
            children={(field) => (
              <field.FileField
                className="h-12"
                label="Image"
                title="Upload an image file"
                url={fullImageUrl}
              />
            )}
            name="file"
          />

          <form.AppForm>
            <form.FormErrors />
          </form.AppForm>

          <div className="grid grid-cols-2 gap-4 max-w-xl">
            <form.AppForm>
              <Button asChild className="h-12" variant="outline">
                <Link
                  search={{ pageIndex: undefined, pageSize: undefined }}
                  to="/dashboard/menu-items"
                >
                  Cancel
                </Link>
              </Button>
              <form.SubmitButton className="h-12" label="Save" />
            </form.AppForm>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
