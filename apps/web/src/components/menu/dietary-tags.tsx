import { cn } from '@mac/tailwind-config/utils'
import { Badge } from '@mac/web-ui/badge'
import { Leaf, type LucideIcon, Shield, WheatOff } from 'lucide-react'

interface DietaryTag {
  label: string
  icon: LucideIcon
  variant: 'default' | 'secondary' | 'destructive' | 'outline'
  bgColor: string
}

const DIETARY_TAGS: Record<string, DietaryTag> = {
  dairyFree: {
    bgColor: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: Shield,
    label: 'Dairy-Free',
    variant: 'outline',
  },
  glutenFree: {
    bgColor: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: WheatOff,
    label: 'Gluten-Free',
    variant: 'outline',
  },
  vegan: {
    bgColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: Leaf,
    label: 'Vegan',
    variant: 'outline',
  },
  vegetarian: {
    bgColor: 'bg-green-50 text-green-700 border-green-200',
    icon: Leaf,
    label: 'Vegetarian',
    variant: 'outline',
  },
} as const

interface DietaryTagsProps {
  isVegetarian?: boolean
  isVegan?: boolean
  isGlutenFree?: boolean
  isDairyFree?: boolean
  size?: 'sm' | 'default'
  showIcons?: boolean
  maxDisplay?: number
  className?: string
}

export function DietaryTags({
  isVegetarian = false,
  isVegan = false,
  isGlutenFree = false,
  isDairyFree = false,
  size = 'default',
  showIcons = true,
  maxDisplay = 4,
  className,
}: DietaryTagsProps) {
  const activeTags: (keyof typeof DIETARY_TAGS)[] = []

  if (isVegan) {
    activeTags.push('vegan')
  } else if (isVegetarian) {
    activeTags.push('vegetarian')
  }

  if (isGlutenFree) {
    activeTags.push('glutenFree')
  }
  if (isDairyFree) {
    activeTags.push('dairyFree')
  }

  if (activeTags.length === 0) {
    return null
  }

  const displayTags = activeTags.slice(0, maxDisplay)
  const remainingCount = activeTags.length - maxDisplay

  const sizeClasses = {
    default: 'text-sm px-2.5 py-1',
    sm: 'text-xs px-2 py-1',
  }

  const iconSizeClasses = {
    default: 'h-3.5 w-3.5',
    sm: 'h-3 w-3',
  }

  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {displayTags.map((tagKey) => {
        const tag = DIETARY_TAGS[tagKey]
        if (!tag) {
          return null
        }

        const IconComponent = tag.icon

        return (
          <Badge
            className={cn(
              'inline-flex items-center gap-1.5 font-medium',
              tag.bgColor,
              sizeClasses[size]
            )}
            key={tagKey}
            variant="outline"
          >
            {showIcons && <IconComponent aria-hidden="true" className={iconSizeClasses[size]} />}
            <span>{tag.label}</span>
          </Badge>
        )
      })}
      {remainingCount > 0 && (
        <Badge
          className={cn(
            'inline-flex items-center font-medium bg-gray-50 text-gray-600 border-gray-200',
            sizeClasses[size]
          )}
          variant="outline"
        >
          +{remainingCount} more
        </Badge>
      )}
    </div>
  )
}
