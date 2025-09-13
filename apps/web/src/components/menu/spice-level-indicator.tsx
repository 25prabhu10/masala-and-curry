import { SPICE_LABELS } from '@mac/resources/constants'
import { cn } from '@mac/tailwind-config/utils'
import { Flame } from 'lucide-react'

interface SpiceLevelIndicatorProps {
  level: number
  maxLevel?: number
  size?: 'sm' | 'default' | 'lg'
  showLabel?: boolean
  className?: string
}

export function SpiceLevelIndicator({
  level,
  maxLevel = 5,
  size = 'default',
  showLabel = true,
  className,
}: SpiceLevelIndicatorProps) {
  const normalizedLevel = Math.max(0, Math.min(level, maxLevel)) as keyof typeof SPICE_LABELS

  const sizeClasses = {
    default: 'h-4 w-4',
    lg: 'h-5 w-5',
    sm: 'h-3 w-3',
  }

  const textSizeClasses = {
    default: 'text-sm',
    lg: 'text-base',
    sm: 'text-xs',
  }

  const label = SPICE_LABELS[normalizedLevel] || `Level ${normalizedLevel}`

  if (normalizedLevel === 0) {
    return showLabel ? (
      <span className={cn('text-muted-foreground', textSizeClasses[size], className)}>{label}</span>
    ) : null
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {Array.from({ length: maxLevel }, (_, index) => {
          const isActive = index < normalizedLevel
          return (
            <Flame
              aria-hidden="true"
              className={cn(
                sizeClasses[size],
                isActive ? 'fill-red-500 text-red-500' : 'fill-gray-200 text-gray-200',
                'drop-shadow-sm'
              )}
              key={index}
            />
          )
        })}
      </div>
      {showLabel && (
        <span
          className={cn(
            'font-medium',
            normalizedLevel <= 2 ? 'text-orange-600' : 'text-red-600',
            textSizeClasses[size]
          )}
        >
          {label}
        </span>
      )}
    </div>
  )
}
