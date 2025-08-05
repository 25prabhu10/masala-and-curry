import { cn } from '@mac/tailwind-config/utils'
import { Button } from '@mac/web-ui/button'
import { Input } from '@mac/web-ui/input'
import { Label } from '@mac/web-ui/label'
import { Separator } from '@mac/web-ui/separator'
import { CreditCard, DollarSign, Lock, Smartphone } from 'lucide-react'
import { useState } from 'react'

interface PaymentMethodSelectorProps {
  onBack: () => void
  onContinue: () => void
}

interface CardData {
  cardNumber: string
  expiryMonth: string
  expiryYear: string
  cvv: string
  cardholderName: string
}

interface FormFieldProps {
  label: string
  id: string
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
  type?: string
  placeholder?: string
  maxLength?: number
  className?: string
}

function FormField({
  label,
  id,
  value,
  onChange,
  error,
  required,
  type = 'text',
  placeholder,
  maxLength,
  className,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-xs text-destructive"> *</span>}
      </Label>
      <Input
        className={cn(error && 'ring-2 ring-destructive', className)}
        id={id}
        maxLength={maxLength}
        onChange={(e) => {
          onChange(e.target.value)
        }}
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

export function PaymentMethodSelector({ onBack, onContinue }: PaymentMethodSelectorProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'digital' | 'cash'>('card')
  const [cardData, setCardData] = useState<CardData>({
    cardholderName: '',
    cardNumber: '',
    cvv: '',
    expiryMonth: '',
    expiryYear: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (paymentMethod === 'card') {
      // Validate card details
      const newErrors: Record<string, string> = {}

      if (!cardData.cardNumber.trim()) {
        newErrors.cardNumber = 'Card number is required'
      }
      if (!cardData.expiryMonth.trim()) {
        newErrors.expiryMonth = 'Expiry month is required'
      }
      if (!cardData.expiryYear.trim()) {
        newErrors.expiryYear = 'Expiry year is required'
      }
      if (!cardData.cvv.trim()) {
        newErrors.cvv = 'CVV is required'
      }
      if (!cardData.cardholderName.trim()) {
        newErrors.cardholderName = 'Cardholder name is required'
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        return
      }
    }

    setErrors({})
    // TODO: Process payment method selection
    onContinue()
  }

  function handleCardInputChange(field: keyof CardData, value: string) {
    setCardData((prev) => {
      return { ...prev, [field]: value }
    })
    if (errors[field]) {
      setErrors((prev) => {
        return { ...prev, [field]: '' }
      })
    }
  }

  function formatCardNumber(value: string) {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  function formatExpiryMonth(value: string) {
    const v = value.replace(/\D/g, '')
    if (v.length >= 2) {
      const month = Number.parseInt(v.substring(0, 2))
      if (month > 12) {
        return '12'
      }
      return v.substring(0, 2)
    }
    return v
  }

  function formatExpiryYear(value: string) {
    const v = value.replace(/\D/g, '')
    return v.substring(0, 2)
  }

  function formatCVV(value: string) {
    const v = value.replace(/\D/g, '')
    return v.substring(0, 4)
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Payment Method Selection */}
      <div>
        <h3 className="text-lg font-medium mb-4">Choose Payment Method</h3>
        <div className="space-y-3">
          {/* Credit/Debit Card */}
          <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <input
              checked={paymentMethod === 'card'}
              className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
              id="card"
              name="paymentMethod"
              onChange={(e) => {
                setPaymentMethod(e.target.value as 'card' | 'digital' | 'cash')
              }}
              type="radio"
              value="card"
            />
            <Label className="flex items-center gap-3 cursor-pointer flex-1" htmlFor="card">
              <CreditCard className="h-5 w-5" />
              <div>
                <p className="font-medium">Credit/Debit Card</p>
                <p className="text-sm text-muted-foreground">Visa, Mastercard, American Express</p>
              </div>
            </Label>
          </div>

          {/* Digital Payments */}
          <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <input
              checked={paymentMethod === 'digital'}
              className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
              id="digital"
              name="paymentMethod"
              onChange={(e) => {
                setPaymentMethod(e.target.value as 'card' | 'digital' | 'cash')
              }}
              type="radio"
              value="digital"
            />
            <Label className="flex items-center gap-3 cursor-pointer flex-1" htmlFor="digital">
              <Smartphone className="h-5 w-5" />
              <div>
                <p className="font-medium">Digital Payment</p>
                <p className="text-sm text-muted-foreground">Apple Pay, Google Pay, PayPal</p>
              </div>
            </Label>
          </div>

          {/* Cash on Delivery */}
          <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <input
              checked={paymentMethod === 'cash'}
              className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
              id="cash"
              name="paymentMethod"
              onChange={(e) => {
                setPaymentMethod(e.target.value as 'card' | 'digital' | 'cash')
              }}
              type="radio"
              value="cash"
            />
            <Label className="flex items-center gap-3 cursor-pointer flex-1" htmlFor="cash">
              <DollarSign className="h-5 w-5" />
              <div>
                <p className="font-medium">Cash on Delivery</p>
                <p className="text-sm text-muted-foreground">
                  Pay with cash when your order arrives
                </p>
              </div>
            </Label>
          </div>
        </div>
      </div>

      {/* Card Details Form */}
      {paymentMethod === 'card' && (
        <>
          <Separator />
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Card Details
            </h3>
            <div className="space-y-4">
              <FormField
                error={errors.cardholderName}
                id="cardholderName"
                label="Cardholder Name"
                onChange={(value) => {
                  handleCardInputChange('cardholderName', value)
                }}
                placeholder="John Doe"
                required
                value={cardData.cardholderName}
              />

              <FormField
                error={errors.cardNumber}
                id="cardNumber"
                label="Card Number"
                maxLength={19}
                onChange={(value) => {
                  handleCardInputChange('cardNumber', formatCardNumber(value))
                }}
                placeholder="1234 5678 9012 3456"
                required
                value={cardData.cardNumber}
              />

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  error={errors.expiryMonth}
                  id="expiryMonth"
                  label="Month"
                  maxLength={2}
                  onChange={(value) => {
                    handleCardInputChange('expiryMonth', formatExpiryMonth(value))
                  }}
                  placeholder="MM"
                  required
                  value={cardData.expiryMonth}
                />
                <FormField
                  error={errors.expiryYear}
                  id="expiryYear"
                  label="Year"
                  maxLength={2}
                  onChange={(value) => {
                    handleCardInputChange('expiryYear', formatExpiryYear(value))
                  }}
                  placeholder="YY"
                  required
                  value={cardData.expiryYear}
                />
                <FormField
                  error={errors.cvv}
                  id="cvv"
                  label="CVV"
                  maxLength={4}
                  onChange={(value) => {
                    handleCardInputChange('cvv', formatCVV(value))
                  }}
                  placeholder="123"
                  required
                  value={cardData.cvv}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Digital Payment Notice */}
      {paymentMethod === 'digital' && (
        <>
          <Separator />
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              You will be redirected to complete your payment with your selected digital payment
              method.
            </p>
            {/* TODO: Add integration with payment gateway SDKs */}
            <p className="text-xs text-muted-foreground mt-2">
              <strong>TODO:</strong> Integration with Apple Pay, Google Pay, and PayPal SDKs
            </p>
          </div>
        </>
      )}

      {/* Cash Payment Notice */}
      {paymentMethod === 'cash' && (
        <>
          <Separator />
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Please have the exact amount ready. Our delivery driver will collect payment upon
              delivery.
            </p>
          </div>
        </>
      )}

      {/* Security Notice */}
      <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
        <Lock className="h-4 w-4 text-green-600" />
        <p className="text-sm text-green-800">
          Your payment information is secured with 256-bit SSL encryption
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <Button className="flex-1" onClick={onBack} type="button" variant="outline">
          Back to Delivery
        </Button>
        <Button className="flex-1" type="submit">
          Review Order
        </Button>
      </div>
    </form>
  )
}
