import { cn } from '@mac/tailwind-config/utils'
import type { MenuOption } from '@mac/validators/menu-option'
import { Checkbox } from '@mac/web-ui/checkbox'
import { Label } from '@mac/web-ui/label'
import { RadioGroupItem } from '@mac/web-ui/radio-group'
import { memo } from 'react'

import { formatCurrencyUSD } from '@/lib/utils'

type OptionItemProps = {
  option: MenuOption
  groupId: string
  checked: boolean
} & (
  | {
      isSingle: true
      onChange?: never
    }
  | {
      isSingle: false
      onChange: (checked: boolean) => void
    }
)

export default memo(function OptionItem({
  option,
  groupId,
  checked,
  isSingle,
  onChange,
}: OptionItemProps) {
  const id = `${groupId}_${option.id}`
  return (
    <Label
      className={cn(
        'flex items-start gap-3 rounded-md border p-3 cursor-pointer transition-colors',
        checked ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
      )}
      htmlFor={id}
    >
      {isSingle ? (
        <RadioGroupItem id={id} value={option.id} />
      ) : (
        <Checkbox checked={checked} id={id} name={id} onCheckedChange={onChange} />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium break-words">{option.name}</p>
        {typeof option.priceModifier === 'number' && option.priceModifier !== 0 && (
          <p className="text-xs text-muted-foreground tabular-nums">
            {option.priceModifier > 0 ? '+' : ''}
            {formatCurrencyUSD(option.priceModifier)}
          </p>
        )}
      </div>
    </Label>
  )
})
