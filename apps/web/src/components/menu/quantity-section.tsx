import { memo } from 'react'

import { formatCurrencyUSD } from '@/lib/utils'

import { QuantitySelector } from './quantity-selector'

type QuantitySectionProps = {
  isAvailable: boolean
  unitPrice: number
  currency: string
  quantity: number
  setQuantity: (qty: number) => void
}

export default memo(function QuantitySection({
  isAvailable,
  unitPrice,
  currency,
  quantity,
  setQuantity,
}: QuantitySectionProps) {
  return (
    <div className="flex items-center justify-between pt-2 border-t">
      <QuantitySelector disabled={!isAvailable} onChange={setQuantity} value={quantity} />
      <div className="text-right">
        <p className="text-xs text-muted-foreground">Unit Price</p>
        <p className="font-semibold tabular-nums">{formatCurrencyUSD(unitPrice, currency)}</p>
        <p className="text-xs text-muted-foreground mt-1 tabular-nums">
          {`Subtotal: ${formatCurrencyUSD(unitPrice * quantity, currency)}`}
        </p>
      </div>
    </div>
  )
})
