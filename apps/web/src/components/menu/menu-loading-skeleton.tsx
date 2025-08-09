import { cn } from '@mac/tailwind-config/utils'
import { Card, CardContent, CardHeader } from '@mac/web-ui/card'
import { Skeleton } from '@mac/web-ui/skeleton'

interface MenuLoadingSkeletonProps {
  count?: number
  className?: string
}

export function MenuLoadingSkeleton({ count = 6, className }: MenuLoadingSkeletonProps) {
  return (
    <div className={cn('grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3', className)}>
      {Array.from({ length: count }, (_, index) => (
        <MenuItemSkeleton key={index} />
      ))}
    </div>
  )
}

function MenuItemSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-7 w-20" />
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-14" />
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-full" />
        </div>

        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-24" />
          </div>
          <Skeleton className="h-8 w-28" />
        </div>
      </CardContent>
    </Card>
  )
}
