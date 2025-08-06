import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@mac/web-ui/table'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  type OnChangeFn,
  type PaginationOptions,
  type PaginationState,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table'

import { DataTablePagination } from './data-table-pagination'

// declare module '@tanstack/react-table' {
//   // oxlint-disable-next-line no-unused-vars
//   interface ColumnMeta<TData extends RowData, TValue> {
//     filterKey?: keyof TData
//     filterVariant?: 'text' | 'number'
//   }
// }

interface DataTableProps<T extends Record<string, unknown>> {
  columns: ColumnDef<T>[]
  data: T[]
  pagination: PaginationState
  paginationOptions: Pick<PaginationOptions, 'onPaginationChange' | 'rowCount'>
  // filters: Filters<T>
  // onFilterChange: (dataFilters: Partial<T>) => void
  sorting: SortingState
  onSortingChange: OnChangeFn<SortingState>
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  pagination,
  paginationOptions,
  // filters,
  // onFilterChange,
  sorting,
  onSortingChange,
}: DataTableProps<T>) {
  const table = useReactTable({
    columns,
    data,
    onSortingChange,
    state: { pagination, sorting },
    ...paginationOptions,
    getCoreRowModel: getCoreRowModel(),
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
  })

  return (
    <>
      <Table className="rounded-md border">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead colSpan={header.colSpan} key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow data-state={row.getIsSelected() && 'selected'} key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="h-24 text-center" colSpan={columns.length}>
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DataTablePagination table={table} />
    </>
  )
}
