import type { AnyFieldMeta } from '@tanstack/react-form'

interface FieldInfoProps {
  fieldName: string
  meta: AnyFieldMeta
}

export default function FieldInfo({ fieldName, meta }: FieldInfoProps) {
  const hasErrors = meta.isTouched && !meta.isValid && meta.errors.length > 0

  let code = ''
  let error = ''

  if (hasErrors) {
    if (typeof meta.errors[0] === 'object') {
      // oxlint-disable-next-line prefer-destructuring
      code = meta.errors[meta.errors.length - 1].code
      error = meta.errors[meta.errors.length - 1].message
    } else {
      error = meta.errors[meta.errors.length - 1]
    }
  }

  return (
    <div className="min-h-5">
      {hasErrors ? (
        <p
          className="text-sm font-medium text-destructive"
          id={`${fieldName}-error`}
          key={`${fieldName}-${code}`}
          role="alert"
        >
          {error}
        </p>
      ) : null}
      {meta.isValidating ? 'Validating...' : null}
    </div>
  )
}
