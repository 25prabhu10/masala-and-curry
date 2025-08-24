import { getCategoriesQuery } from '@mac/queries/category'
import { uploadImageMutation } from '@mac/queries/image'
import { createMenuItemMutation, updateMenuItemMutation } from '@mac/queries/menu-item'
import { MAX_CURRENCY_VALUE, MIN_CURRENCY_VALUE, NUMBER_STEPS } from '@mac/resources/constants'
import { createDataSuccessDesc, UPDATE_SUCCESS_DESC } from '@mac/resources/general'
import { FieldErrors, FormErrors } from '@mac/validators/api-errors'
import {
  type CreateMenuItemInput,
  createMenuItemWithImageValidator,
  type MenuItem,
  type UpdateMenuItemInput,
  updateMenuItemWithImageValidator,
} from '@mac/validators/menu-item'
import type { MenuItemVariant } from '@mac/validators/menu-item-variant'
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
  variants: [],
}

const defaultVariant: MenuItemVariant = {
  calories: undefined,
  description: '',
  displayOrder: 0,
  id: '',
  isAvailable: true,
  isDefault: false,
  menuItemId: '',
  name: '',
  priceModifier: 0,
  servingSize: '',
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
    defaultValues: data as CreateMenuItemInput | UpdateMenuItemInput,
    validators: {
      onChange: isNew ? createMenuItemWithImageValidator : updateMenuItemWithImageValidator,
      onSubmitAsync: async ({ value }) => {
        try {
          let payload = value as CreateMenuItemInput | UpdateMenuItemInput

          // If a new image file is selected, upload it first and set the image URL
          if (form.state.values.file) {
            const response = await uploadImgMutation.mutateAsync(form.state.values.file)

            if (!response.url) {
              throw new Error('Failed to upload image')
            }

            payload = {
              ...(value as CreateMenuItemInput | UpdateMenuItemInput),
              image: response.url,
            }
          }

          if (isNew) {
            await createMutation.mutateAsync(payload as CreateMenuItemInput)
            toast.success(createDataSuccessDesc((value as CreateMenuItemInput).name ?? 'Menu Item'))
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
                <field.TextField
                  className="h-12"
                  inputMode="numeric"
                  label="Calories"
                  min={0}
                  title="Calories per serving"
                  type="number"
                />
              )}
              name="calories"
            />
            <form.AppField
              children={(field) => (
                <field.TextField
                  className="h-12"
                  inputMode="numeric"
                  label="Preparation Time (min)"
                  min={1}
                  required
                  title="Preparation time in minutes"
                  type="number"
                />
              )}
              name="preparationTime"
            />
            <form.AppField
              children={(field) => (
                <field.TextField
                  className="h-12"
                  label="Ingredients"
                  title="List of ingredients"
                  type="text"
                />
              )}
              name="ingredients"
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
          <form.Field
            children={(field) => (
              <div className="space-y-4">
                <div className="flex flex-col space-y-1.5">
                  <h3 className="font-semibold leading-none tracking-tight">Variants</h3>
                  <p className="text-sm text-muted-foreground">Add and manage menu item variants</p>
                </div>
                <div className="space-y-4">
                  {field.state.value && field.state.value.length > 0 ? (
                    field.state.value.map((variant, i) => (
                      <Card key={`${variant.id}-${variant._tempId}`}>
                        <CardHeader>
                          <CardTitle>Variant: {i + 1}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                            <form.AppField
                              children={(subField) => (
                                <subField.TextField
                                  className="h-12"
                                  label="Variant Name"
                                  required
                                  title="Menu variant name"
                                  type="text"
                                />
                              )}
                              name={`variants[${i}].name`}
                            />
                            <form.AppField
                              children={(subField) => (
                                <subField.TextField
                                  className="h-12"
                                  label="Variant Description"
                                  title="Short Menu variant description"
                                  type="text"
                                />
                              )}
                              name={`variants[${i}].description`}
                            />
                            <form.AppField
                              children={(subField) => (
                                <subField.TextField
                                  className="h-12"
                                  inputMode="decimal"
                                  label="Variant Additional Price (USD)"
                                  max={MAX_CURRENCY_VALUE}
                                  min={MIN_CURRENCY_VALUE}
                                  required
                                  step={NUMBER_STEPS}
                                  title="Menu variant additional price"
                                  type="number"
                                />
                              )}
                              name={`variants[${i}].priceModifier`}
                            />
                            <form.AppField
                              children={(subField) => (
                                <subField.TextField
                                  className="h-12"
                                  label="Display Order"
                                  min={0}
                                  title="Display Order"
                                  type="number"
                                />
                              )}
                              name={`variants[${i}].displayOrder`}
                            />
                            <form.AppField
                              children={(subField) => (
                                <subField.TextField
                                  className="h-12"
                                  label="Calories"
                                  min={0}
                                  title="Calories per serving"
                                  type="number"
                                />
                              )}
                              name={`variants[${i}].calories`}
                            />
                            <form.AppField
                              children={(subField) => <subField.CheckboxField label="Default" />}
                              name={`variants[${i}].isDefault`}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground">No variants added.</p>
                  )}

                  <Button
                    className="h-12"
                    onClick={() =>
                      field.pushValue({ ...defaultVariant, _tempId: crypto.randomUUID() })
                    }
                    type="button"
                    variant="outline"
                  >
                    Add variant
                  </Button>
                </div>
              </div>
            )}
            mode="array"
            name="variants"
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
