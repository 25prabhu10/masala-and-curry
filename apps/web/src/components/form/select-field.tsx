import { cn } from '@mac/tailwind-config/utils'
import { Label } from '@mac/web-ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@mac/web-ui/select'

import { useFieldContext } from '@/context/form-context'
import type { SelectOption } from '@/lib/types'

import FieldInfo from './field-info'

type SelectFieldProps = React.ComponentProps<typeof SelectTrigger> & {
  options: SelectOption[]
  label: React.ReactNode
  required?: boolean
  showValidations?: boolean
  all?: boolean
  allLabel?: string
  allValue?: string
}

export default function SelectField({
  label,
  options,
  className,
  required,
  all,
  allLabel,
  showValidations = true,
  ...props
}: SelectFieldProps) {
  const field = useFieldContext<string | boolean>()
  const isInvalid =
    field.state.meta.isTouched && !field.state.meta.isValid && field.state.meta.errors.length > 0

  const value =
    typeof field.state.value === 'boolean' ? String(field.state.value) : field.state.value

  return (
    <div className="space-y-2">
      <Label htmlFor={field.name}>
        {label}
        {required ? <span className="text-xs text-destructive"> *</span> : ''}
      </Label>
      <Select
        aria-required={required}
        onValueChange={(value) => field.handleChange(value ?? null)}
        value={value}
      >
        <SelectTrigger
          aria-describedby={`${field.name}-error`}
          aria-invalid={isInvalid}
          aria-label={typeof label === 'string' ? label : undefined}
          className={cn(className, isInvalid && 'ring-2 ring-destructive')}
          id={field.name}
          {...props}
        >
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent id={`${field.name}-select`}>
          {all ? <SelectItem value="_null">{allLabel ?? 'All'}</SelectItem> : null}
          {options.map((option) => (
            <SelectItem
              aria-selected={field.state.value === option.value}
              key={option.value}
              role="option"
              value={option.value}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {showValidations ? <FieldInfo fieldName={field.name} meta={field.state.meta} /> : null}
    </div>
  )
}
