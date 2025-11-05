import { cn } from '@mac/tailwind-config/utils'
import { Field, FieldDescription, FieldError, FieldLabel } from '@mac/web-ui/field'
import { Input } from '@mac/web-ui/input'

import { useFieldContext } from '@/context/form-context'

type TextFieldProps = React.ComponentProps<typeof Input> & {
  label: React.ReactNode
  srOnlyLabel?: boolean
  description?: string
}

export function TextField({
  label,
  required,
  className,
  description,
  srOnlyLabel = false,
  ...props
}: TextFieldProps) {
  const field = useFieldContext<string | number>()

  const isInvalid =
    field.state.meta.isTouched && !field.state.meta.isValid && field.state.meta.errors.length > 0

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel className={cn(srOnlyLabel && 'sr-only')} htmlFor={field.name}>
        {label}
        {required ? <span className="text-xs text-destructive">*</span> : ''}
      </FieldLabel>
      <Input
        aria-describedby={`${field.name}-error`}
        aria-invalid={isInvalid}
        aria-required={required}
        autoCapitalize="off"
        autoCorrect="off"
        className={cn(className, isInvalid && 'ring-2 ring-destructive')}
        id={field.name}
        name={field.name}
        onBlur={field.handleBlur}
        onChange={(e) => {
          const data = props.type === 'number' ? Number(e.target.value) : e.target.value
          field.handleChange(data)
        }}
        required={required}
        value={field.state.value}
        {...props}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
