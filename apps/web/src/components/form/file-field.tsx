import { IMAGE_MIME_TYPES } from '@mac/resources/constants'
import { cn } from '@mac/tailwind-config/utils'
import { Field, FieldDescription, FieldError, FieldLabel } from '@mac/web-ui/field'
import { Input } from '@mac/web-ui/input'

import ImageUI from '@/components/image-ui'
import { useFieldContext } from '@/context/form-context'

type FileFieldProps = React.ComponentProps<typeof Input> & {
  label: React.ReactNode
  url?: string | null
  description?: string
}

export default function FileField({
  label,
  url,
  required,
  className,
  description,
  ...props
}: FileFieldProps) {
  const field = useFieldContext<File | undefined>()

  const isInvalid =
    field.state.meta.isTouched && !field.state.meta.isValid && field.state.meta.errors.length > 0

  const imgUrl = field.state.value ? URL.createObjectURL(field.state.value) : (url ?? undefined)

  return (
    <Field className="pt-4 max-w-[450px] space-y-4">
      <FieldLabel htmlFor={field.name}>
        {label}
        {required ? <span className="text-xs text-destructive">*</span> : ''}
      </FieldLabel>
      <ImageUI url={imgUrl} />
      <Input
        accept={IMAGE_MIME_TYPES.join(',')}
        aria-describedby={`${field.name}-error`}
        aria-invalid={isInvalid}
        aria-required={required}
        autoCapitalize="off"
        autoCorrect="off"
        className={cn('cursor-pointer', className, isInvalid && 'ring-2 ring-destructive')}
        id={field.name}
        name={field.name}
        onChange={(e) => {
          field.handleChange(e.target.files?.[0])
        }}
        required={required}
        type="file"
        {...props}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
