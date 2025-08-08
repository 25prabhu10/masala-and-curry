import { cn } from '@mac/tailwind-config/utils'
import { Checkbox } from '@mac/web-ui/checkbox'
import { Label } from '@mac/web-ui/label'

import { useFieldContext } from '@/context/form-context'

import FieldInfo from './field-info'

type CheckboxFieldProps = React.ComponentProps<typeof Checkbox> & {
  label: React.ReactNode
  showValidations?: boolean
}

export default function CheckboxField({
  label,
  required,
  className,
  showValidations = true,
  ...props
}: CheckboxFieldProps) {
  const field = useFieldContext<boolean>()

  const isInvalid =
    field.state.meta.isTouched && !field.state.meta.isValid && field.state.meta.errors.length > 0
  return (
    <div className="flex items-center gap-2">
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
      <Label htmlFor={field.name}>
        {label}
        {required ? <span className="text-xs text-destructive"> *</span> : ''}
      </Label>
      {showValidations ? <FieldInfo fieldName={field.name} meta={field.state.meta} /> : null}
    </div>
  )
}
