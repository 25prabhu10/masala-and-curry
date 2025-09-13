import { SPICE_LABELS } from '@mac/resources/constants'
import { Label } from '@mac/web-ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@mac/web-ui/select'

import { SpiceLevelIndicator } from './spice-level-indicator'

type SpiceLevelSelectorProps = {
  spiceLevel: number
  setSpiceLevel: (level: number) => void
}

export function SpiceLevelSelector({ spiceLevel, setSpiceLevel }: SpiceLevelSelectorProps) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <Label htmlFor="spice-level-select">How spicy do you want it?</Label>
        <SpiceLevelIndicator className="shrink-0" level={spiceLevel} showLabel={false} size="sm" />
      </div>
      <div className="mt-2 flex items-center gap-3">
        <div className="flex-1">
          <Select
            onValueChange={(value) => setSpiceLevel(Number(value))}
            value={String(spiceLevel)}
          >
            <SelectTrigger aria-label="Spice level" id="spice-level-select">
              <SelectValue placeholder="Select spice level" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SPICE_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
