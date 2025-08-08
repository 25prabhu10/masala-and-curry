import { cn } from '@mac/tailwind-config/utils'
import { Input } from '@mac/web-ui/input'
import { Label } from '@mac/web-ui/label'

import FieldInfo from '@/components/form/field-info'
import { useFieldContext } from '@/context/form-context'

type TextFieldProps = React.ComponentProps<typeof Input> & { label: React.ReactNode }

export function TextField({ label, required, className, ...props }: TextFieldProps) {
  const field = useFieldContext<string | number>()

  const isInvalid =
    field.state.meta.isTouched && !field.state.meta.isValid && field.state.meta.errors.length > 0

  return (
    <div className="space-y-2">
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
        className={cn(className, isInvalid && 'ring-2 ring-destructive')}
        id={field.name}
        name={field.name}
        onChange={(e) => {
          const data = props.type === 'number' ? Number(e.target.value) : e.target.value
          field.handleChange(data)
        }}
        required={required}
        value={field.state.value}
        {...props}
      />
      <FieldInfo fieldName={field.name} meta={field.state.meta} />
    </div>
  )
}
