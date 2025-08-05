import { cn } from '@mac/tailwind-config/utils'
import { Button } from '@mac/web-ui/button'
import { Input } from '@mac/web-ui/input'
import { Label } from '@mac/web-ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@mac/web-ui/select'
import { Separator } from '@mac/web-ui/separator'
import { Clock, MapPin } from 'lucide-react'
import { useState } from 'react'

interface DeliveryDetailsFormProps {
  onContinue: () => void
}

interface FormData {
  firstName: string
  lastName: string
  phone: string
  email: string
  address: string
  apartment: string
  city: string
  postalCode: string
  deliveryInstructions: string
  deliveryTime: string
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

interface TextAreaFieldProps {
  label: string
  id: string
  value: string
  onChange: (value: string) => void
  error?: string
  placeholder?: string
  rows?: number
}

function TextAreaField({
  label,
  id,
  value,
  onChange,
  error,
  placeholder,
  rows = 3,
}: TextAreaFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <textarea
        className={cn(
          'flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          error && 'ring-2 ring-destructive'
        )}
        id={id}
        onChange={(e) => {
          onChange(e.target.value)
        }}
        placeholder={placeholder}
        rows={rows}
        value={value}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

export function DeliveryDetailsForm({ onContinue }: DeliveryDetailsFormProps) {
  const [formData, setFormData] = useState<FormData>({
    address: '',
    apartment: '',
    city: '',
    deliveryInstructions: '',
    deliveryTime: 'asap',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    postalCode: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Basic validation
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required'
    }
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    // TODO: Save delivery details to store/context
    onContinue()
  }

  function handleInputChange(field: keyof FormData, value: string) {
    setFormData((prev) => {
      return { ...prev, [field]: value }
    })
    if (errors[field]) {
      setErrors((prev) => {
        return { ...prev, [field]: '' }
      })
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Contact Information */}
      <div>
        <h3 className="text-lg font-medium mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            error={errors.firstName}
            id="firstName"
            label="First Name"
            onChange={(value) => {
              handleInputChange('firstName', value)
            }}
            required
            value={formData.firstName}
          />
          <FormField
            error={errors.lastName}
            id="lastName"
            label="Last Name"
            onChange={(value) => {
              handleInputChange('lastName', value)
            }}
            required
            value={formData.lastName}
          />
          <FormField
            error={errors.phone}
            id="phone"
            label="Phone Number"
            onChange={(value) => {
              handleInputChange('phone', value)
            }}
            placeholder="(555) 123-4567"
            required
            type="tel"
            value={formData.phone}
          />
          <FormField
            error={errors.email}
            id="email"
            label="Email Address"
            onChange={(value) => {
              handleInputChange('email', value)
            }}
            placeholder="your@email.com"
            required
            type="email"
            value={formData.email}
          />
        </div>
      </div>

      <Separator />

      {/* Delivery Address */}
      <div>
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Delivery Address
        </h3>
        <div className="space-y-4">
          <FormField
            error={errors.address}
            id="address"
            label="Street Address"
            onChange={(value) => {
              handleInputChange('address', value)
            }}
            placeholder="123 Main Street"
            required
            value={formData.address}
          />
          <FormField
            id="apartment"
            label="Apartment, Suite, etc. (Optional)"
            onChange={(value) => {
              handleInputChange('apartment', value)
            }}
            placeholder="Apt 4B"
            value={formData.apartment}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              error={errors.city}
              id="city"
              label="City"
              onChange={(value) => {
                handleInputChange('city', value)
              }}
              required
              value={formData.city}
            />
            <FormField
              error={errors.postalCode}
              id="postalCode"
              label="Postal Code"
              onChange={(value) => {
                handleInputChange('postalCode', value)
              }}
              placeholder="A1A 1A1"
              required
              value={formData.postalCode}
            />
          </div>
          <TextAreaField
            id="deliveryInstructions"
            label="Delivery Instructions (Optional)"
            onChange={(value) => {
              handleInputChange('deliveryInstructions', value)
            }}
            placeholder="Ring doorbell, leave at door, etc."
            rows={3}
            value={formData.deliveryInstructions}
          />
        </div>
      </div>

      <Separator />

      {/* Delivery Time */}
      <div>
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Delivery Time
        </h3>
        <div className="space-y-2">
          <Label htmlFor="delivery-time">When would you like your order?</Label>
          <Select
            onValueChange={(value) => {
              handleInputChange('deliveryTime', value)
            }}
            value={formData.deliveryTime}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select delivery time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asap">As soon as possible (30-45 min)</SelectItem>
              <SelectItem value="1hour">In 1 hour</SelectItem>
              <SelectItem value="2hours">In 2 hours</SelectItem>
              <SelectItem value="3hours">In 3 hours</SelectItem>
              <SelectItem value="custom">Schedule for later</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end pt-4">
        <Button className="px-8" type="submit">
          Continue to Payment
        </Button>
      </div>
    </form>
  )
}
