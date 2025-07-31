import {
  categoryKeys,
  createCategoryMutation,
  deleteCategoryMutation,
  getCategoriesQuery,
  updateCategoryMutation,
} from '@mac/queries/category'
import type { Category } from '@mac/validators/category'
import { Button } from '@mac/web-ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@mac/web-ui/card'
import { Checkbox } from '@mac/web-ui/checkbox'
// Dialog components for creating/editing categories
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
import { Input } from '@mac/web-ui/input'
import { Label } from '@mac/web-ui/label'
import { Skeleton } from '@mac/web-ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@mac/web-ui/table'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table'
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/dashboard/categories')({
  component: RouteComponent,
})

function RouteComponent() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  // Fetch categories with pagination
  const {
    data: categories = [],
    isLoading,
    error,
    refetch,
  } = useQuery(
    getCategoriesQuery({
      limit: pagination.pageSize,
      page: pagination.pageIndex + 1,
    })
  )

  // Define columns
  const columns = useMemo<ColumnDef<Category>[]>(
    () => [
      // Selection column
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
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          />
        ),
        id: 'select',
      },
      // Name column
      {
        accessorKey: 'amount',
        cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
        header: ({ column }) => (
          <Button
            className="h-auto p-0 font-medium"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            variant="ghost"
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
      },
      // Description column
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
      // Display Order column
      {
        accessorKey: 'displayOrder',
        cell: ({ row }) => (
          <div className="text-center font-mono">{row.getValue('displayOrder')}</div>
        ),
        header: ({ column }) => (
          <Button
            className="h-auto p-0 font-medium"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            variant="ghost"
          >
            Order
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
      },
      // Status column
      {
        accessorKey: 'isActive',
        cell: ({ row }) => {
          const isActive = row.getValue('isActive') as boolean
          return (
            <div className="flex items-center">
              <div
                className={`h-2 w-2 rounded-full mr-2 ${isActive ? 'bg-green-500' : 'bg-gray-400'}`}
              />
              <span className={isActive ? 'text-green-700' : 'text-gray-500'}>
                {isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          )
        },
        header: 'Status',
      },
      // Created At column
      {
        accessorKey: 'createdAt',
        cell: ({ row }) => {
          const createdAt = new Date(row.getValue('createdAt'))
          return (
            <div className="text-sm text-muted-foreground">{createdAt.toLocaleDateString()}</div>
          )
        },
        header: 'Created',
      },
      // Actions column
      {
        cell: ({ row }) => {
          const category = row.original
          return <CategoryActionsDropdown category={category} />
        },
        enableHiding: false,
        id: 'actions',
      },
    ],
    []
  )

  // Table configuration
  const table = useReactTable({
    columns,
    data: categories,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    state: {
      globalFilter,
      pagination,
      rowSelection,
      sorting,
    },
  })

  // Loading skeleton rows
  const loadingRows = useMemo(
    () =>
      Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={`loading-${index}`}>
          {columns.map((_, cellIndex) => (
            <TableCell key={`loading-cell-${cellIndex}`}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      )),
    [columns]
  )

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p>Error loading categories: {error.message}</p>
              <Button className="mt-4" onClick={() => refetch()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Categories</CardTitle>
              <CardDescription>
                Manage your food categories and organize your menu items.
              </CardDescription>
            </div>
            <CreateCategoryDialog />
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and filters */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-8 max-w-sm"
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  placeholder="Search categories..."
                  value={globalFilter}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <p className="text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{' '}
                {table.getFilteredRowModel().rows.length} row(s) selected.
              </p>
            </div>
          </div>

          {/* Data Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading && loadingRows}
                {!isLoading &&
                  table.getRowModel().rows?.length > 0 &&
                  table.getRowModel().rows.map((row) => (
                    <TableRow data-state={row.getIsSelected() && 'selected'} key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                {!isLoading && table.getRowModel().rows?.length === 0 && (
                  <TableRow>
                    <TableCell className="h-24 text-center" colSpan={columns.length}>
                      No categories found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <select
                className="h-8 w-[70px] rounded border border-input bg-background px-2 text-sm"
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value))
                }}
                value={table.getState().pagination.pageSize}
              >
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                className="hidden h-8 w-8 p-0 lg:flex"
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.setPageIndex(0)}
                variant="outline"
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                className="h-8 w-8 p-0"
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.previousPage()}
                variant="outline"
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                className="h-8 w-8 p-0"
                disabled={!table.getCanNextPage()}
                onClick={() => table.nextPage()}
                variant="outline"
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                className="hidden h-8 w-8 p-0 lg:flex"
                disabled={!table.getCanNextPage()}
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                variant="outline"
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Actions dropdown component for each category row
function CategoryActionsDropdown({ category }: { category: Category }) {
  const queryClient = useQueryClient()
  const deleteMutation = useMutation(deleteCategoryMutation())

  const handleDelete = useCallback(async () => {
    if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
      try {
        await deleteMutation.mutateAsync(category.id)
        toast.success('Category deleted successfully')
        // Invalidate and refetch categories
        queryClient.invalidateQueries({ queryKey: categoryKeys.all })
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Failed to delete category: ${error.message}`)
        }
      }
    }
  }, [category.id, category.name, deleteMutation, queryClient])

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
          Copy category ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <EditCategoryDialog category={category}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Edit className="mr-2 h-4 w-4" />
            Edit category
          </DropdownMenuItem>
        </EditCategoryDialog>
        <DropdownMenuItem
          className="text-red-600"
          disabled={deleteMutation.isPending}
          onClick={handleDelete}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete category
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Create category dialog component
function CreateCategoryDialog() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    description: '',
    displayOrder: 0,
    isActive: true,
    name: '',
  })
  const queryClient = useQueryClient()
  const createMutation = useMutation(createCategoryMutation())

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      try {
        await createMutation.mutateAsync(formData)
        toast.success('Category created successfully')
        setOpen(false)
        setFormData({ description: '', displayOrder: 0, isActive: true, name: '' })
        // Invalidate and refetch categories
        queryClient.invalidateQueries({ queryKey: categoryKeys.all })
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Failed to create category: ${error.message}`)
        }
      }
    },
    [createMutation, formData, queryClient]
  )

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
          <DialogDescription>Add a new category to organize your menu items.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter category name"
                required
                value={formData.name}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter category description (optional)"
                value={formData.description}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input
                id="displayOrder"
                min="0"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    displayOrder: Number.parseInt(e.target.value) || 0,
                  })
                }
                type="number"
                value={formData.displayOrder}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.isActive}
                id="isActive"
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: !!checked })}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setOpen(false)} type="button" variant="outline">
              Cancel
            </Button>
            <Button disabled={createMutation.isPending} type="submit">
              {createMutation.isPending ? 'Creating...' : 'Create Category'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Edit category dialog component
function EditCategoryDialog({
  category,
  children,
}: {
  category: Category
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    description: category.description || '',
    displayOrder: category.displayOrder,
    isActive: category.isActive,
    name: category.name,
  })
  const queryClient = useQueryClient()
  const updateMutation = useMutation(updateCategoryMutation(category.id))

  // Reset form data when category changes or dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        description: category.description || '',
        displayOrder: category.displayOrder,
        isActive: category.isActive,
        name: category.name,
      })
    }
  }, [category, open])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      try {
        await updateMutation.mutateAsync(formData)
        toast.success('Category updated successfully')
        setOpen(false)
        // Invalidate and refetch categories
        queryClient.invalidateQueries({ queryKey: categoryKeys.all })
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Failed to update category: ${error.message}`)
        }
      }
    },
    [updateMutation, formData, queryClient]
  )

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>Update the category information below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter category name"
                required
                value={formData.name}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter category description (optional)"
                value={formData.description}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-displayOrder">Display Order</Label>
              <Input
                id="edit-displayOrder"
                min="0"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    displayOrder: Number.parseInt(e.target.value) || 0,
                  })
                }
                type="number"
                value={formData.displayOrder}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.isActive}
                id="edit-isActive"
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: !!checked })}
              />
              <Label htmlFor="edit-isActive">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setOpen(false)} type="button" variant="outline">
              Cancel
            </Button>
            <Button disabled={updateMutation.isPending} type="submit">
              {updateMutation.isPending ? 'Updating...' : 'Update Category'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
