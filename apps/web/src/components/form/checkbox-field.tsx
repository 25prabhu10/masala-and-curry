import { cn } from '@mac/tailwind-config/utils'
import { Checkbox } from '@mac/web-ui/checkbox'
import { Field, FieldDescription, FieldError, FieldLabel } from '@mac/web-ui/field'

import { useFieldContext } from '@/context/form-context'

type CheckboxFieldProps = React.ComponentProps<typeof Checkbox> & {
  label: React.ReactNode
  showValidations?: boolean
  description?: string
}

export default function CheckboxField({
  label,
  required,
  className,
  description,
  showValidations = true,
  ...props
}: CheckboxFieldProps) {
  const field = useFieldContext<boolean>()

  const isInvalid =
    field.state.meta.isTouched && !field.state.meta.isValid && field.state.meta.errors.length > 0
  return (
    <Field orientation="horizontal">
      <Checkbox
        aria-describedby={`${field.name}-error`}
        aria-invalid={isInvalid}
        aria-required={required}
        checked={field.state.value}
        className={cn(className, isInvalid && 'ring-2 ring-destructive')}
        id={field.name}
        name={field.name}
        onCheckedChange={(checked) => {
          field.handleChange(!!checked)
        }}
        required={required}
        {...props}
      />
      <FieldLabel htmlFor={field.name}>
        {label}
        {required ? <span className="text-xs text-destructive">*</span> : ''}
      </FieldLabel>
      {description && <FieldDescription>{description}</FieldDescription>}
      {showValidations && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
