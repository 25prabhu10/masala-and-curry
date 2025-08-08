import { Button } from '@mac/web-ui/button'
import { Input } from '@mac/web-ui/input'
import { Label } from '@mac/web-ui/label'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

import FieldInfo from '@/components/form/field-info'
import { useFieldContext } from '@/context/form-context'

type PasswordFieldProps = React.ComponentProps<typeof Input> & { label: React.ReactNode }

export default function PasswordField({ label, required, ...props }: PasswordFieldProps) {
  const field = useFieldContext<string>()
  const [showPassword, setShowPassword] = useState(false)
  const isInvalid =
    field.state.meta.isTouched && !field.state.meta.isValid && field.state.meta.errors.length > 0

  function togglePasswordVisibility() {
    setShowPassword((prev) => !prev)
  }

  return (
    <div className="grid gap-2">
      <Label htmlFor={field.name}>
        {label}
        {required ? <span className="text-xs text-destructive"> *</span> : ''}
      </Label>
      <div className="relative">
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
        <Button
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={togglePasswordVisibility}
          size="sm"
          title={showPassword ? 'Hide password' : 'Show password'}
          type="button"
          variant="ghost"
        >
          {showPassword ? (
            <EyeOff aria-hidden="true" className="h-4 w-4" />
          ) : (
            <Eye aria-hidden="true" className="h-4 w-4" />
          )}
        </Button>
      </div>
      <FieldInfo fieldName={field.name} meta={field.state.meta} />
    </div>
  )
}
