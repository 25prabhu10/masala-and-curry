import { getCategoriesQuery } from '@mac/queries/category'
import {
  deleteMenuItemMutation,
  getMenuItemsQuery,
  updateMenuItemMutation,
} from '@mac/queries/menu-item'
import { DEFAULT_PAGE_INDEX } from '@mac/resources/constants'
import { type MenuItem, menuItemFiltersValidatorWithCatch } from '@mac/validators/menu-item'
import { Button } from '@mac/web-ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@mac/web-ui/card'
import { Checkbox } from '@mac/web-ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@mac/web-ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@mac/web-ui/dropdown-menu'
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { DataTable } from '@/components/dashboard/data-table'
import { DataTableColumnHeader } from '@/components/dashboard/data-table-column-header'
import DataTableSkeleton from '@/components/dashboard/data-table-skeleton'
import { useFilters } from '@/hooks/use-filters'
import { useAppForm } from '@/hooks/use-form'
import { formatCurrencyUSD, sortByToState, stateToSortBy } from '@/lib/utils'

const columnsDef: ColumnDef<MenuItem>[] = [
  {
    cell: ({ row }) => (
      <div className="flex items-center mr-1">
        <Checkbox
          aria-label="Select row"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      </div>
    ),
    enableHiding: false,
    enableSorting: false,
    header: ({ table }) => (
      <div className="flex items-center mr-1">
        <Checkbox
          aria-label="Select all"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      </div>
    ),
    id: 'select',
  },
  {
    accessorKey: 'name',
    cell: ({ row }) => <div className="font-medium ml-2">{row.getValue('name')}</div>,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: 'description',
    cell: ({ row }) => {
      const description = row.getValue('description') as string | null
      return (
        <div className="max-w-[220px] truncate text-muted-foreground">
          {description || 'No description'}
        </div>
      )
    },
    header: 'Description',
  },
  {
    accessorKey: 'category.name',
    cell: ({ row }) => {
      const item = row.original
      return <div>{item.category?.name ?? '-'}</div>
    },
    enableSorting: false,
    header: 'Category',
  },
  {
    accessorKey: 'basePrice',
    cell: ({ row }) => {
      const price = row.getValue('basePrice') as number
      return <div className="font-mono">{formatCurrencyUSD(price)}</div>
    },
    enableSorting: false,
    header: 'Price',
  },
  {
    accessorKey: 'spiceLevel',
    cell: ({ row }) => <div className="text-center">{String(row.getValue('spiceLevel') ?? 0)}</div>,
    enableSorting: false,
    header: 'Spice',
  },
  {
    cell: ({ row }) => {
      const i = row.original
      const flags = [
        i.isVegetarian ? 'Vegetarian' : null,
        i.isVegan ? 'Vegan' : null,
        i.isGlutenFree ? 'Gluten-Free' : null,
      ].filter(Boolean)
      return <div className="text-muted-foreground text-xs">{flags.join(', ') || '-'}</div>
    },
    enableSorting: false,
    header: 'Dietary',
    id: 'dietary',
  },
  {
    accessorKey: 'isAvailable',
    cell: ({ row }) => <AvailabilityToggle item={row.original} />,
    enableSorting: false,
    header: 'Available',
  },
  {
    accessorKey: 'displayOrder',
    cell: ({ row }) => <div className="text-center font-mono">{row.getValue('displayOrder')}</div>,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Display Order" />,
  },
  {
    cell: ({ row }) => (
      <DeleteMenuItemDialog item={row.original}>
        <Button className="text-destructive" variant="link">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </DeleteMenuItemDialog>
    ),
    enableHiding: false,
    header: 'Delete',
    id: 'delete',
  },
  {
    cell: ({ row }) => <MenuItemActionsDropdown item={row.original} />,
    enableHiding: false,
    header: 'Actions',
    id: 'actions',
  },
]

export const Route = createFileRoute('/dashboard/menu-items/')({
  beforeLoad: ({ search }) => {
    return { search }
  },
  component: RouteComponent,
  loader: async ({ context: { queryClient, search } }) => {
    await Promise.all([
      queryClient.ensureQueryData(getMenuItemsQuery(search)),
      queryClient.ensureQueryData(getCategoriesQuery({ activeOnly: true })),
    ])
  },
  pendingComponent: () => (
    <div className="w-full mx-auto p-10">
      <DataTableSkeleton totalColumns={columnsDef.length} />
    </div>
  ),
  validateSearch: menuItemFiltersValidatorWithCatch,
})

function RouteComponent() {
  const { filters, setFilters } = useFilters(Route.fullPath)

  const { data } = useSuspenseQuery(getMenuItemsQuery(filters))
  const { data: categories } = useSuspenseQuery(
    getCategoriesQuery({ activeOnly: true, pageSize: 100 })
  )

  const paginationState = {
    pageIndex: filters.pageIndex ?? DEFAULT_PAGE_INDEX,
    pageSize: filters.pageSize ?? data.rowCount,
  }

  const sortingState = sortByToState(filters.sortBy)

  const columns = useMemo<ColumnDef<MenuItem>[]>(() => columnsDef, [])

  const form = useAppForm({
    defaultValues: {
      categoryId: filters.categoryId ?? '',
      search: filters.search ?? '',
    },
    onSubmit: ({ value }) => {
      setFilters({
        categoryId: value.categoryId || undefined,
        search: value.search || undefined,
      })
    },
  })

  return (
    <Card>
      <CardHeader className="gap-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div>
            <CardTitle>Menu Items</CardTitle>
            <CardDescription>Manage the food items available in your menu.</CardDescription>
          </div>
          <Button asChild>
            <Link to="/dashboard/menu-items/new">Add new menu-item</Link>
          </Button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <form.AppField
              children={(field) => (
                <field.TextField
                  className="h-12"
                  label="Name"
                  placeholder="Search by menu item"
                  title="Search by name of menu item"
                  type="search"
                />
              )}
              name="search"
            />
            <form.AppField
              children={(field) => (
                <field.SelectField
                  all={true}
                  className="h-12"
                  label="Category"
                  options={categories.result.map((category) => {
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
          </div>
          <div className="flex flex-col gap-4">
            <form.AppForm>
              <form.FormErrors />
            </form.AppForm>
            <form.AppForm>
              <form.SubmitButton className="max-w-xs h-12" label="Search" />
            </form.AppForm>
          </div>
        </form>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={data?.result ?? []}
          onSortingChange={(updaterOrValue) => {
            const newSortingState =
              typeof updaterOrValue === 'function' ? updaterOrValue(sortingState) : updaterOrValue
            return setFilters({ sortBy: stateToSortBy(newSortingState) })
          }}
          pagination={paginationState}
          paginationOptions={{
            onPaginationChange: (pagination) => {
              setFilters(
                typeof pagination === 'function' ? pagination(paginationState) : pagination
              )
            },
            rowCount: data?.rowCount,
          }}
          sorting={sortingState}
        />
      </CardContent>
    </Card>
  )
}

function MenuItemActionsDropdown({ item }: { item: MenuItem }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-8 w-8 p-0" variant="ghost">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(item.id)}>
          Copy ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link params={{ 'menu-item-id': item.id }} to="/dashboard/menu-items/$menu-item-id/edit">
            Edit
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function DeleteMenuItemDialog({ item, children }: { item: MenuItem; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const { mutateAsync, isPending } = useMutation(deleteMenuItemMutation(item.id, queryClient))

  function handleDelete() {
    mutateAsync()
      .catch((error: unknown) => {
        toast.error(`Failed to delete item: ${error instanceof Error ? error.message : ''}`)
      })
      .then(() => {
        toast.success(`Item "${item.name}" deleted successfully`)
      })
      .finally(() => setOpen(false))
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Menu Item</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{item.name}</strong>? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => setOpen(false)} variant="outline">
            Cancel
          </Button>
          <Button disabled={isPending} onClick={handleDelete} variant="destructive">
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function AvailabilityToggle({ item }: { item: MenuItem }) {
  const queryClient = useQueryClient()
  const { mutateAsync, isPending } = useMutation(updateMenuItemMutation(item.id, queryClient))

  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <Checkbox
        checked={item.isAvailable}
        disabled={isPending}
        onCheckedChange={(checked) => {
          const next = Boolean(checked)
          void mutateAsync({ isAvailable: next })
            .then(() => toast.success(`Item ${next ? 'enabled' : 'disabled'}`))
            .catch((error: unknown) =>
              toast.error(error instanceof Error ? error.message : 'Update failed')
            )
        }}
      />
      <span className={item.isAvailable ? 'text-success' : 'text-muted-foreground'}>
        {item.isAvailable ? 'Active' : 'Inactive'}
      </span>
    </label>
  )
}
