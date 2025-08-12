import { Card, CardContent, CardHeader } from '@mac/web-ui/card'
import { Skeleton } from '@mac/web-ui/skeleton'

export function MenuLoadingSkeleton() {
  return (
    <div>
      <Skeleton className="h-7 w-60 mt-2 mb-4" />
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => i).map((item) => (
          <MenuItemSkeleton key={item} />
        ))}
      </div>
    </div>
  )
}

function MenuItemSkeleton() {
  return (
    <Card className="group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-3/4 mt-2" />
          </div>
          <div className="text-right flex-shrink-0">
            <Skeleton className="h-7 w-20" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-3">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="mb-4">
          <Skeleton className="h-4 w-24 mb-1" />
          <Skeleton className="h-4 w-full" />
        </div>

        <div className="mb-4">
          <Skeleton className="h-4 w-36" />
        </div>

        <div className="flex items-center justify-between gap-3 pt-3 border-t">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-9 w-[120px]" />
        </div>
      </CardContent>
    </Card>
  )
}
