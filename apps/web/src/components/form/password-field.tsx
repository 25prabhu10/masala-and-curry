import { Checkbox } from '@mac/web-ui/checkbox'
import { Field, FieldDescription, FieldError, FieldLabel } from '@mac/web-ui/field'
import { Input } from '@mac/web-ui/input'
import { useState } from 'react'

import { useFieldContext } from '@/context/form-context'

type PasswordFieldProps = React.ComponentProps<typeof Input> & {
  label: React.ReactNode
  description?: string
}

export default function PasswordField({
  label,
  required,
  description,
  ...props
}: PasswordFieldProps) {
  const field = useFieldContext<string>()
  const [showPassword, setShowPassword] = useState(false)
  const isInvalid =
    field.state.meta.isTouched && !field.state.meta.isValid && field.state.meta.errors.length > 0

  function togglePasswordVisibility(checked: boolean) {
    setShowPassword(checked)
  }

  return (
    <Field data-invalid={isInvalid}>
      <div className="grid gap-2 relative">
        <div className="absolute flex gap-2 justify-center items-center top-0 right-0 hover:bg-transparent">
          <Checkbox
            checked={showPassword}
            id={`show-${field.name}`}
            name={`show-${field.name}`}
            onCheckedChange={togglePasswordVisibility}
          />
          <FieldLabel htmlFor={`show-${field.name}`}>Show password</FieldLabel>
        </div>
        <FieldLabel htmlFor={field.name}>
          {label}
          {required ? <span className="text-xs text-destructive">*</span> : ''}
        </FieldLabel>
        <Input
          aria-describedby={`${field.name}-error`}
          aria-invalid={isInvalid}
          aria-required={required}
          autoCapitalize="off"
          autoCorrect="off"
          className="pr-10"
          id={field.name}
          name={field.name}
          onBlur={field.handleBlur}
          onChange={(e) => {
            field.handleChange(e.target.value)
          }}
          required={required}
          type={showPassword ? 'text' : 'password'}
          value={field.state.value}
          {...props}
        />
        {description && <FieldDescription>{description}</FieldDescription>}
        {isInvalid && <FieldError errors={field.state.meta.errors} />}
      </div>
    </Field>
  )
}
