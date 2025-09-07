import type { Category } from '@mac/validators/category'
import type { MenuItemFilters } from '@mac/validators/menu-item'
import { Button } from '@mac/web-ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@mac/web-ui/card'
import { FilterX } from 'lucide-react'

import { useAppForm } from '@/hooks/use-form'

interface MenuFiltersProps {
  filters: MenuItemFilters
  setFilters: (filters: MenuItemFilters) => void
  categories: Category[]
  resetFilters: () => Promise<void>
  className?: string
}

export function MenuFilters({ categories, filters, setFilters, resetFilters }: MenuFiltersProps) {
  const form = useAppForm({
    defaultValues: {
      availableOnly: true,
      categoryId: '',
      glutenFree: false,
      popular: false,
      search: '',
      vegan: false,
      vegetarian: false,
    } as MenuItemFilters,
    onSubmit: ({ value }) => {
      setFilters({
        availableOnly: value.availableOnly,
        categoryId: value.categoryId,
        glutenFree: value.glutenFree,
        popular: value.popular,
        search: value.search,
        vegan: value.vegan,
        vegetarian: value.vegetarian,
      })
    },
  })

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Filter Menu</h2>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-2 my-4"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
            <div className="col-span-7">
              <form.AppField
                children={(field) => (
                  <field.TextField
                    label="Food Item"
                    placeholder="Search by menu item"
                    srOnlyLabel
                    title="Search by name of food item"
                    type="search"
                  />
                )}
                name="search"
              />
            </div>
            <form.AppForm>
              <form.SubmitButton label="Search" />
            </form.AppForm>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <form.AppField
              children={(field) => (
                <field.SelectField
                  all={true}
                  allLabel="All Categories"
                  label="Category"
                  options={categories.map((category) => {
                    return {
                      label: category.name,
                      value: category.id,
                    }
                  })}
                  title="Select a category"
                />
              )}
              name="categoryId"
            />
            <div className="space-y-3">
              <h4 className="text-sm">Quick Filters</h4>
              <div className="space-y-2">
                <form.AppField
                  children={(field) => <field.CheckboxField label="Popular items" />}
                  name="popular"
                />
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm">Dietary Preferences</h4>
              <div className="space-y-2">
                <form.AppField
                  children={(field) => <field.CheckboxField label="Vegetarian" />}
                  name="vegetarian"
                />
                <form.AppField
                  children={(field) => <field.CheckboxField label="Vegan" />}
                  name="vegan"
                />
                <form.AppField
                  children={(field) => <field.CheckboxField label="Gluten-Free" />}
                  name="glutenFree"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <form.AppForm>
              <form.FormErrors />
            </form.AppForm>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <div className="flex w-full justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {Object.values(filters).filter(Boolean).length - 1} filter(s) applied
          </div>
          <Button
            onClick={(event) => {
              event.preventDefault()
              form.reset()
              resetFilters()
            }}
            size="sm"
            type="reset"
            variant="ghost"
          >
            <FilterX className="h-4 w-4" />
            Clear all
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
