import { getCategoriesQuery } from '@mac/queries/category'
import { uploadImageMutation } from '@mac/queries/image'
import { createMenuItemMutation, updateMenuItemMutation } from '@mac/queries/menu-item'
import {
  MAX_CURRENCY_VALUE,
  MAX_NUMBER_IN_APP,
  MIN_CURRENCY_VALUE,
  NUMBER_STEPS,
  SELECTION_TYPES,
} from '@mac/resources/constants'
import { createDataSuccessDesc, UPDATE_SUCCESS_DESC } from '@mac/resources/general'
import { FieldErrors, FormErrors } from '@mac/validators/api-errors'
import {
  type CreateMenuItemInput,
  createMenuItemWithImageValidator,
  type MenuItem,
  type UpdateMenuItemInput,
  updateMenuItemWithImageValidator,
} from '@mac/validators/menu-item'
import type { CreateMenuOption, UpdateMenuOptionInput } from '@mac/validators/menu-option'
import type {
  CreateMenuOptionGroup,
  UpdateMenuOptionGroupInput,
} from '@mac/validators/menu-option-group'
import { Button } from '@mac/web-ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@mac/web-ui/card'
import { useStore } from '@tanstack/react-form'
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useMemo } from 'react'
import { toast } from 'sonner'

import { useAppForm } from '@/hooks/use-form'
import type { SelectOption } from '@/lib/types'

type MenuItemFormProps = { data?: MenuItem; isNew?: boolean }

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

type OGCreate = CreateMenuOptionGroup & { options: CreateMenuOption[] }
type OGUpdate = UpdateMenuOptionGroupInput & { options: UpdateMenuOptionInput[] }
type OptionGroupField = OGCreate | OGUpdate
type OptionField = CreateMenuOption | UpdateMenuOptionInput

const defaultValues: MenuItem = {
  basePrice: 0,
  calories: 0,
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
  optionGroups: [],
  preparationTime: 15,
  spiceLevel: 0,
}

const selectionTypeOptions = SELECTION_TYPES.map((type) => ({
  label: type.toLocaleUpperCase(),
  value: type,
}))

const defaultOptionGroup: OptionGroupField = {
  displayOrder: 0,
  isAvailable: true,
  maxSelect: 1,
  minSelect: 0,
  name: '',
  options: [] as OptionField[],
  required: false,
  selectionType: 'single' satisfies (typeof SELECTION_TYPES)[number],
}

const defaultOption: OptionField = {
  caloriesModifier: 0,
  displayOrder: 0,
  isAvailable: true,
  isDefault: false,
  name: '',
  priceModifier: 0,
}

export function MenuItemForm({ data = defaultValues, isNew = false }: MenuItemFormProps) {
  const queryClient = useQueryClient()

  const createMutation = useMutation(createMenuItemMutation(queryClient))
  const updateMutation = useMutation(updateMenuItemMutation(data.id, queryClient))
  const uploadImgMutation = useMutation(uploadImageMutation())

  const categoriesQuery = useSuspenseQuery(getCategoriesQuery({ activeOnly: true }))
  const categoryOptions: SelectOption[] = useMemo(() => {
    const list = categoriesQuery.data?.result ?? []
    return list.map((c) => ({ label: c.name, value: c.id }))
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
          <div className="grid grid-flow-dense md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
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
            children={(groupsField) => (
              <div className="space-y-4">
                <div className="flex flex-col space-y-1.5">
                  <h3 className="font-semibold leading-none tracking-tight">Option Groups</h3>
                  <p className="text-sm text-muted-foreground">
                    Add groups like Size, Extras, etc., and their options
                  </p>
                </div>

                <div className="space-y-4">
                  {Array.isArray(groupsField.state.value) && groupsField.state.value.length > 0 ? (
                    groupsField.state.value.map((group: any, i: number) => (
                      <Card key={`${group.id ?? 'new'}-${i}`}>
                        <CardHeader>
                          <CardTitle>Group: {group.name || `#${i + 1}`}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                            <form.AppField
                              children={(f) => (
                                <f.TextField className="h-12" label="Group Name" required />
                              )}
                              name={`optionGroups[${i}].name`}
                            />
                            <form.AppField
                              children={(f) => (
                                <f.SelectField
                                  className="h-12"
                                  label="Selection Type"
                                  options={selectionTypeOptions}
                                  required
                                />
                              )}
                              name={`optionGroups[${i}].selectionType`}
                            />
                            <form.AppField
                              children={(f) => <f.CheckboxField label="Required" />}
                              name={`optionGroups[${i}].required`}
                            />
                            <form.AppField
                              children={(f) => <f.CheckboxField label="Available" />}
                              name={`optionGroups[${i}].isAvailable`}
                            />
                            <form.AppField
                              children={(f) => (
                                <f.TextField
                                  className="h-12"
                                  label="Display Order"
                                  max={MAX_NUMBER_IN_APP}
                                  min={0}
                                  type="number"
                                />
                              )}
                              name={`optionGroups[${i}].displayOrder`}
                            />
                            <form.AppField
                              children={(f) => (
                                <f.TextField
                                  className="h-12"
                                  label="Min Select"
                                  max={MAX_NUMBER_IN_APP}
                                  min={0}
                                  type="number"
                                />
                              )}
                              name={`optionGroups[${i}].minSelect`}
                            />
                            <form.AppField
                              children={(f) => (
                                <f.TextField
                                  className="h-12"
                                  label="Max Select"
                                  max={MAX_NUMBER_IN_APP}
                                  min={1}
                                  type="number"
                                />
                              )}
                              name={`optionGroups[${i}].maxSelect`}
                            />
                          </div>

                          <div className="mt-6 space-y-4">
                            <h4 className="font-medium">Options</h4>
                            <form.Field
                              children={(optionsField) => (
                                <div className="space-y-4">
                                  {Array.isArray(optionsField.state.value) &&
                                  optionsField.state.value.length > 0 ? (
                                    optionsField.state.value.map((opt: any, j: number) => (
                                      <Card key={`${opt.id ?? 'new'}-${opt._tempId ?? j}`}>
                                        <CardContent className="pt-6">
                                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                                            <form.AppField
                                              children={(ff) => (
                                                <ff.TextField
                                                  className="h-12"
                                                  label="Name"
                                                  required
                                                />
                                              )}
                                              name={`optionGroups[${i}].options[${j}].name`}
                                            />
                                            <form.AppField
                                              children={(ff) => (
                                                <ff.TextField
                                                  className="h-12"
                                                  inputMode="decimal"
                                                  label="Additional Price (USD)"
                                                  max={MAX_CURRENCY_VALUE}
                                                  min={MIN_CURRENCY_VALUE}
                                                  step={NUMBER_STEPS}
                                                  type="number"
                                                />
                                              )}
                                              name={`optionGroups[${i}].options[${j}].priceModifier`}
                                            />
                                            <form.AppField
                                              children={(ff) => (
                                                <ff.TextField
                                                  className="h-12"
                                                  label="Calories Modifier"
                                                  max={MAX_NUMBER_IN_APP}
                                                  min={-MAX_NUMBER_IN_APP}
                                                  type="number"
                                                />
                                              )}
                                              name={`optionGroups[${i}].options[${j}].caloriesModifier`}
                                            />
                                            <form.AppField
                                              children={(ff) => (
                                                <ff.TextField
                                                  className="h-12"
                                                  label="Display Order"
                                                  max={MAX_NUMBER_IN_APP}
                                                  min={0}
                                                  type="number"
                                                />
                                              )}
                                              name={`optionGroups[${i}].options[${j}].displayOrder`}
                                            />
                                            <form.AppField
                                              children={(ff) => (
                                                <ff.CheckboxField label="Default" />
                                              )}
                                              name={`optionGroups[${i}].options[${j}].isDefault`}
                                            />
                                            <form.AppField
                                              children={(ff) => (
                                                <ff.CheckboxField label="Available" />
                                              )}
                                              name={`optionGroups[${i}].options[${j}].isAvailable`}
                                            />
                                          </div>
                                        </CardContent>
                                        <CardFooter>
                                          <Button
                                            className="h-12"
                                            onClick={() => optionsField.removeValue(j)}
                                            type="button"
                                            variant="destructive"
                                          >
                                            Remove option
                                          </Button>
                                        </CardFooter>
                                      </Card>
                                    ))
                                  ) : (
                                    <p className="text-xs text-muted-foreground">
                                      No options added.
                                    </p>
                                  )}
                                  <Button
                                    className="h-12"
                                    onClick={() =>
                                      optionsField.pushValue({
                                        ...defaultOption,
                                        _tempId: crypto.randomUUID(),
                                      })
                                    }
                                    type="button"
                                    variant="outline"
                                  >
                                    Add option
                                  </Button>
                                </div>
                              )}
                              mode="array"
                              name={`optionGroups[${i}].options` as const}
                            />
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button
                            className="h-12"
                            onClick={() => groupsField.removeValue(i)}
                            type="button"
                            variant="destructive"
                          >
                            Remove group
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground">No option groups added.</p>
                  )}

                  <Button
                    className="h-12"
                    onClick={() =>
                      groupsField.pushValue({
                        ...defaultOptionGroup,
                      })
                    }
                    type="button"
                    variant="outline"
                  >
                    Add group
                  </Button>
                </div>
              </div>
            )}
            mode="array"
            name="optionGroups"
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
