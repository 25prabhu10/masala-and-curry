import { Card, CardContent, CardHeader } from '@mac/web-ui/card'
import { Skeleton } from '@mac/web-ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@mac/web-ui/table'

type DataTableSkeletonProps = {
  totalColumns: number
}

export default function DataTableSkeleton({ totalColumns }: DataTableSkeletonProps) {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-10 w-full" />
      </CardHeader>
      <CardContent>
        <Table className="rounded-md border">
          <TableHeader>
            <TableRow>
              {Array.from({ length: totalColumns }).map((_, cellIndex) => (
                <TableHead key={`loading-cell-${cellIndex}`}>
                  <Skeleton className="h-4 w-full" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={`loading-${index}`}>
                {Array.from({ length: totalColumns }).map((_, cellIndex) => (
                  <TableCell key={`loading-cell-${cellIndex}`}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
