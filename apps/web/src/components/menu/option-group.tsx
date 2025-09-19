import type { MenuOption } from '@mac/validators/menu-option'
import type { MenuOptionGroup } from '@mac/validators/menu-option-group'
import { RadioGroup } from '@mac/web-ui/radio-group'
import { memo, useCallback } from 'react'

import OptionItem from './option-item'

type OptionGroupProps = {
  group: MenuOptionGroup & {
    options: MenuOption[]
  }
  selectedIds: string[]
  onChange: (groupId: string, value: string[]) => void
}

export default memo(function OptionGroup({ group, selectedIds, onChange }: OptionGroupProps) {
  const isSingle = group.selectionType === 'single'

  const handleSingleChange = useCallback(
    (value: string) => {
      onChange(group.id, value ? [value] : [])
    },
    [group.id, onChange]
  )

  const handleMultiChange = useCallback(
    (optId: string, checked: boolean) => {
      let value = []

      if (checked) {
        if (group.maxSelect && group.maxSelect > 0 && selectedIds.length >= group.maxSelect) {
          value = selectedIds
        }
        value = [...selectedIds, optId]
      } else {
        value = selectedIds.filter((id) => id !== optId)
      }

      onChange(group.id, value)
    },
    [group.id, group.maxSelect, onChange, selectedIds]
  )

  return (
    <div key={group.id}>
      <h4 className="text-sm font-medium mb-2 gap-[0.25rem]">
        {group.name}
        {group.required && <span className="ml-auto text-destructive">{` (required)`}</span>}
        {group.minSelect > 1 && (
          <span className="ml-auto text-muted-foreground">{` (min ${group.minSelect})`}</span>
        )}
        {group.maxSelect > 1 && (
          <span className="ml-auto text-muted-foreground">{` (up to ${group.maxSelect})`}</span>
        )}
      </h4>
      <div className="overflow-y-auto">
        {isSingle ? (
          <RadioGroup onValueChange={handleSingleChange} value={selectedIds[0] ?? ''}>
            {group.options?.map((opt) => (
              <OptionItem
                checked={selectedIds.includes(opt.id)}
                groupId={group.id}
                isSingle={true}
                key={opt.id}
                option={opt}
              />
            ))}
          </RadioGroup>
        ) : (
          <div className="space-y-2">
            {group.options?.map((opt) => (
              <OptionItem
                checked={selectedIds.includes(opt.id)}
                groupId={group.id}
                isSingle={false}
                key={opt.id}
                onChange={(checked) => handleMultiChange(opt.id, checked)}
                option={opt}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
})
