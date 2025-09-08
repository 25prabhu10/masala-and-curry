import { Checkbox } from '@mac/web-ui/checkbox'
import { Input } from '@mac/web-ui/input'
import { Label } from '@mac/web-ui/label'
import { useState } from 'react'

import FieldInfo from '@/components/form/field-info'
import { useFieldContext } from '@/context/form-context'

type PasswordFieldProps = React.ComponentProps<typeof Input> & { label: React.ReactNode }

export default function PasswordField({ label, required, ...props }: PasswordFieldProps) {
  const field = useFieldContext<string>()
  const [showPassword, setShowPassword] = useState(false)
  const isInvalid =
    field.state.meta.isTouched && !field.state.meta.isValid && field.state.meta.errors.length > 0

  function togglePasswordVisibility(checked: boolean) {
    setShowPassword(checked)
  }

  return (
    <div className="grid gap-2 relative">
      <div className="absolute flex gap-2 justify-center items-center top-0 right-0 hover:bg-transparent">
        <Checkbox
          checked={showPassword}
          id={`show-${field.name}`}
          name={`show-${field.name}`}
          onCheckedChange={togglePasswordVisibility}
        />
        <Label htmlFor={`show-${field.name}`}>Show password</Label>
      </div>
      <Label htmlFor={field.name}>
        {label}
        {required ? <span className="text-xs text-destructive"> *</span> : ''}
      </Label>
      <Input
        aria-describedby={`${field.name}-error`}
        aria-invalid={isInvalid}
        aria-required={required}
        autoCapitalize="off"
        autoCorrect="off"
        className="pr-10"
        id={field.name}
        name={field.name}
        onChange={(e) => {
          field.handleChange(e.target.value)
        }}
        required={required}
        type={showPassword ? 'text' : 'password'}
        value={field.state.value}
        {...props}
      />
      <FieldInfo fieldName={field.name} meta={field.state.meta} />
    </div>
  )
}
