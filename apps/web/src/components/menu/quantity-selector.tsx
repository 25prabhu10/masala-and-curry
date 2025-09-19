import { Button } from '@mac/web-ui/button'
import { Minus, Plus } from 'lucide-react'
import { useCallback } from 'react'

import { SlidingNumbers } from '@/components/ui/sliding-numbers'

interface QuantitySelectorProps {
  value: number
  onChange: (quantity: number) => void
  min?: number
  max?: number
  places?: number[]
  disabled?: boolean
  size?: 'sm' | 'default'
  className?: string
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 50,
  places = [10, 1],
  disabled = false,
}: QuantitySelectorProps) {
  const handleIncrement = useCallback(() => {
    if (value < max) {
      onChange(value + 1)
    }
  }, [value, max, onChange])

  const handleDecrement = useCallback(() => {
    if (value > min) {
      onChange(value - 1)
    }
  }, [value, min, onChange])

  return (
    <div className="grid grid-cols-3 gap-2 bg-input border rounded-md p-1">
      <Button
        aria-label="Decrease quantity"
        disabled={disabled || value <= min}
        onClick={handleDecrement}
        size="icon"
        type="button"
        variant="outline"
      >
        <Minus className="h-3 w-3" />
      </Button>

      <p className="text-center text-xl font-medium flex gap-1 leading-none mx-auto">
        {places.map((place) => (
          <SlidingNumbers aria-hidden={true} height={26} key={place} place={place} value={value} />
        ))}
        <span className="sr-only">{value}</span>
      </p>

      <Button
        aria-label="Increase quantity"
        disabled={disabled || value >= max}
        onClick={handleIncrement}
        size="icon"
        type="button"
        variant="outline"
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  )
}
