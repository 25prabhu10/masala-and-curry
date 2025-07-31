import { cn } from '@mac/tailwind-config/utils'
import { Input } from '@mac/web-ui/input'
import { Label } from '@mac/web-ui/label'

import FieldInfo from '@/components/form/field-info'
import { useFieldContext } from '@/context/form-context'

type TextFieldProps = React.ComponentProps<typeof Input> & { label: React.ReactNode }

export function TextField({ label, required, className, ...props }: TextFieldProps) {
  const field = useFieldContext<string>()

  return (
    <div className="space-y-2">
      <Label htmlFor={field.name}>
        {label}
        {required ? <span className="text-xs text-destructive"> *</span> : ''}
      </Label>
      <Input
        aria-describedby={`${field.name}-error`}
        autoCapitalize="off"
        autoCorrect="off"
        className={cn(className, !field.state.meta.isValid && 'ring-2 ring-destructive')}
        id={field.name}
        name={field.name}
        onChange={(e) => {
          field.handleChange(e.target.value)
        }}
        required={required}
        value={field.state.value}
        {...props}
      />
      <FieldInfo fieldName={field.name} meta={field.state.meta} />
    </div>
  )
}
