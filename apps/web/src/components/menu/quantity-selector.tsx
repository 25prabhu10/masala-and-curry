import { Button } from '@mac/web-ui/button'
import { Input } from '@mac/web-ui/input'
import { Minus, Plus } from 'lucide-react'
import { useCallback, useState } from 'react'

interface QuantitySelectorProps {
  value: number
  onChange: (quantity: number) => void
  min?: number
  max?: number
  disabled?: boolean
  size?: 'sm' | 'default'
  className?: string
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 50,
  disabled = false,
}: QuantitySelectorProps) {
  const [inputValue, setInputValue] = useState(value.toString())

  const handleIncrement = useCallback(() => {
    if (value < max) {
      onChange(value + 1)
      setInputValue((value + 1).toString())
    }
  }, [value, max, onChange])

  const handleDecrement = useCallback(() => {
    if (value > min) {
      onChange(value - 1)
      setInputValue((value - 1).toString())
    }
  }, [value, min, onChange])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputVal = e.target.value
      setInputValue(inputVal)

      const numericValue = Number.parseInt(inputVal, 10)
      if (!Number.isNaN(numericValue) && numericValue >= min && numericValue <= max) {
        onChange(numericValue)
      }
    },
    [min, max, onChange]
  )

  const handleInputBlur = useCallback(() => {
    const numericValue = Number.parseInt(inputValue, 10)
    if (Number.isNaN(numericValue) || numericValue < min || numericValue > max) {
      setInputValue(value.toString())
    }
  }, [inputValue, value, min, max])

  return (
    <div className="grid grid-cols-4 gap-1">
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

      <Input
        aria-label="Quantity"
        className="col-span-2 md:col-span-2 text-center text-sm font-medium"
        disabled={disabled}
        max={max}
        min={min}
        onBlur={handleInputBlur}
        onChange={handleInputChange}
        type="number"
        value={inputValue}
      />

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
