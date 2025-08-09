import { deleteCategoryMutation, getCategoriesQuery } from '@mac/queries/category'
import { DEFAULT_PAGE_INDEX } from '@mac/resources/constants'
import { cn } from '@mac/tailwind-config/utils'
import { type Category, getCategoryFiltersValidatorWithCatch } from '@mac/validators/category'
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
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { DataTable } from '@/components/dashboard/data-table'
import { DataTableColumnHeader } from '@/components/dashboard/data-table-column-header'
import DataTableSkeleton from '@/components/dashboard/data-table-skeleton'
import { useFilters } from '@/hooks/use-filters'
import { sortByToState, stateToSortBy } from '@/lib/utils'

const columnsDef: ColumnDef<Category>[] = [
  {
    cell: ({ row }) => (
      <Checkbox
        aria-label="Select row"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableHiding: false,
    enableSorting: false,
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all"
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    id: 'select',
  },
  {
    accessorKey: 'name',
    cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: 'description',
    cell: ({ row }) => {
      const description = row.getValue('description') as string | null
      return (
        <div className="max-w-[200px] truncate text-muted-foreground">
          {description || 'No description'}
        </div>
      )
    },
    header: 'Description',
  },
  {
    accessorKey: 'displayOrder',
    cell: ({ row }) => <div className="text-center font-mono">{row.getValue('displayOrder')}</div>,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Display Order" />,
  },
  {
    accessorKey: 'isActive',
    cell: ({ row }) => {
      const isActive = row.getValue('isActive') as boolean
      return (
        <div className="flex items-center">
          <div
            className={cn(
              'h-2 w-2 rounded-full mr-2',
              isActive ? 'bg-success' : 'bg-muted-foreground'
            )}
          />
          <span className={isActive ? 'text-success' : 'text-muted-foreground'}>
            {isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      )
    },
    enableSorting: false,
    header: 'Status',
  },
  {
    cell: ({ row }) => {
      const category = row.original
      return (
        <DeleteCategoryDialog category={category}>
          <Button className="text-destructive" variant="link">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </DeleteCategoryDialog>
      )
    },
    enableHiding: false,
    header: 'Delete',
    id: 'delete',
  },
  {
    cell: ({ row }) => {
      const category = row.original
      return <CategoryActionsDropdown category={category} />
    },
    enableHiding: false,
    header: 'Actions',
    id: 'actions',
  },
]

export const Route = createFileRoute('/dashboard/categories/')({
  beforeLoad: ({ search }) => {
    return { search }
  },
  component: RouteComponent,
  loader: async ({ context: { queryClient, search } }) => {
    await queryClient.ensureQueryData(getCategoriesQuery(search))
  },
  pendingComponent: () => (
    <div className="w-full mx-auto p-10">
      <DataTableSkeleton totalRows={columnsDef.length} />
    </div>
  ),
  validateSearch: getCategoryFiltersValidatorWithCatch(true),
})

function RouteComponent() {
  const { filters, setFilters } = useFilters(Route.fullPath)

  const { data } = useSuspenseQuery(getCategoriesQuery(filters))

  const paginationState = {
    pageIndex: filters.pageIndex ?? DEFAULT_PAGE_INDEX,
    pageSize: filters.pageSize ?? data.rowCount,
  }

  const sortingState = sortByToState(filters.sortBy)

  const columns = useMemo<ColumnDef<Category>[]>(() => columnsDef, [])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Categories</CardTitle>
            <CardDescription>
              Manage your categories for better organization of menu items.
            </CardDescription>
          </div>
          <Button asChild>
            <Link to="/dashboard/categories/new">Add New Category</Link>
          </Button>
        </div>
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

// Actions dropdown component for each category row
function CategoryActionsDropdown({ category }: { category: Category }) {
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
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(category.id)}>
          Copy ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            params={{ 'category-id': category.id }}
            to="/dashboard/categories/$category-id/edit"
          >
            Edit
          </Link>
        </DropdownMenuItem>
        {/* <EditCategoryDialog category={category}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Edit className="mr-2 h-4 w-4" />
          Edit category
          </DropdownMenuItem>
          </EditCategoryDialog> */}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function DeleteCategoryDialog({
  category,
  children,
}: {
  category: Category
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const { mutateAsync, isPending } = useMutation(deleteCategoryMutation())

  function handleDelete() {
    mutateAsync(category.id)
      .catch((error) => {
        toast.error(`Failed to delete category: ${error instanceof Error ? error.message : ''}`)
      })
      .then(() => {
        toast.success(`Category "${category.name}" deleted successfully`)
      })
      .finally(() => {
        setOpen(false)
      })
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Category</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the category <strong>{category.name}</strong>? This
            action cannot be undone.
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

// Create category dialog component
// function CreateCategoryDialog() {
//   const [open, setOpen] = useState(false)
//   const [formData, setFormData] = useState({
//     description: '',
//     displayOrder: 0,
//     isActive: true,
//     name: '',
//   })
//   const queryClient = useQueryClient()
//   const createMutation = useMutation(createCategoryMutation())

//   const handleSubmit = useCallback(
//     async (e: React.FormEvent) => {
//       e.preventDefault()
//       try {
//         await createMutation.mutateAsync(formData)
//         toast.success('Category created successfully')
//         setOpen(false)
//         setFormData({ description: '', displayOrder: 0, isActive: true, name: '' })
//         // Invalidate and refetch categories
//         queryClient.invalidateQueries({ queryKey: categoryKeys.all })
//       } catch (error) {
//         if (error instanceof Error) {
//           toast.error(`Failed to create category: ${error.message}`)
//         }
//       }
//     },
//     [createMutation, formData, queryClient]
//   )

//   return (
//     <Dialog onOpenChange={setOpen} open={open}>
//       <DialogTrigger asChild>
//         <Button>
//           <Plus className="mr-2 h-4 w-4" />
//           Add Category
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Create New Category</DialogTitle>
//           <DialogDescription>Add a new category to organize your menu items.</DialogDescription>
//         </DialogHeader>
//         <form onSubmit={handleSubmit}>
//           <div className="grid gap-4 py-4">
//             <div className="grid gap-2">
//               <Label htmlFor="name">Name</Label>
//               <Input
//                 id="name"
//                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                 placeholder="Enter category name"
//                 required
//                 value={formData.name}
//               />
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="description">Description</Label>
//               <Input
//                 id="description"
//                 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                 placeholder="Enter category description (optional)"
//                 value={formData.description}
//               />
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="displayOrder">Display Order</Label>
//               <Input
//                 id="displayOrder"
//                 min="0"
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     displayOrder: Number.parseInt(e.target.value) || 0,
//                   })
//                 }
//                 type="number"
//                 value={formData.displayOrder}
//               />
//             </div>
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 checked={formData.isActive}
//                 id="isActive"
//                 onCheckedChange={(checked) => setFormData({ ...formData, isActive: !!checked })}
//               />
//               <Label htmlFor="isActive">Active</Label>
//             </div>
//           </div>
//           <DialogFooter>
//             <Button onClick={() => setOpen(false)} type="button" variant="outline">
//               Cancel
//             </Button>
//             <Button disabled={createMutation.isPending} type="submit">
//               {createMutation.isPending ? 'Creating...' : 'Create Category'}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   )
// }

// Edit category dialog component
// function EditCategoryDialog({
//   category,
//   children,
// }: {
//   category: CreateCategory
//   children: React.ReactNode
// }) {
//   const [open, setOpen] = useState(false)
//   const [formData, setFormData] = useState({
//     description: category.description || '',
//     displayOrder: category.displayOrder,
//     isActive: category.isActive,
//     name: category.name,
//   })
//   const queryClient = useQueryClient()
//   const updateMutation = useMutation(updateCategoryMutation(category.id))

//   // Reset form data when category changes or dialog opens
//   useEffect(() => {
//     if (open) {
//       setFormData({
//         description: category.description || '',
//         displayOrder: category.displayOrder,
//         isActive: category.isActive,
//         name: category.name,
//       })
//     }
//   }, [category, open])

//   const handleSubmit = useCallback(
//     async (e: React.FormEvent) => {
//       e.preventDefault()
//       try {
//         await updateMutation.mutateAsync(formData)
//         toast.success('Category updated successfully')
//         setOpen(false)
//         // Invalidate and refetch categories
//         queryClient.invalidateQueries({ queryKey: categoryKeys.all })
//       } catch (error) {
//         if (error instanceof Error) {
//           toast.error(`Failed to update category: ${error.message}`)
//         }
//       }
//     },
//     [updateMutation, formData, queryClient]
//   )

//   return (
//     <Dialog onOpenChange={setOpen} open={open}>
//       <DialogTrigger asChild>{children}</DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Edit Category</DialogTitle>
//           <DialogDescription>Update the category information below.</DialogDescription>
//         </DialogHeader>
//         <form onSubmit={handleSubmit}>
//           <div className="grid gap-4 py-4">
//             <div className="grid gap-2">
//               <Label htmlFor="edit-name">Name</Label>
//               <Input
//                 id="edit-name"
//                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                 placeholder="Enter category name"
//                 required
//                 value={formData.name}
//               />
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="edit-description">Description</Label>
//               <Input
//                 id="edit-description"
//                 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                 placeholder="Enter category description (optional)"
//                 value={formData.description}
//               />
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="edit-displayOrder">Display Order</Label>
//               <Input
//                 id="edit-displayOrder"
//                 min="0"
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     displayOrder: Number.parseInt(e.target.value) || 0,
//                   })
//                 }
//                 type="number"
//                 value={formData.displayOrder}
//               />
//             </div>
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 checked={formData.isActive}
//                 id="edit-isActive"
//                 onCheckedChange={(checked) => setFormData({ ...formData, isActive: !!checked })}
//               />
//               <Label htmlFor="edit-isActive">Active</Label>
//             </div>
//           </div>
//           <DialogFooter>
//             <Button onClick={() => setOpen(false)} type="button" variant="outline">
//               Cancel
//             </Button>
//             <Button disabled={updateMutation.isPending} type="submit">
//               {updateMutation.isPending ? 'Updating...' : 'Update Category'}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   )
// }
