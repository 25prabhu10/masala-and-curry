// oxlint-disable no-nested-ternary

import type { z } from '@mac/validators/general'
import type { AnyFieldMeta } from '@tanstack/react-form'

interface FieldInfoProps {
  fieldName: string
  meta: AnyFieldMeta
}

export default function FieldInfo({ fieldName, meta }: FieldInfoProps) {
  return (
    <div className="min-h-5">
      {meta.isTouched && !meta.isValid && meta.errors.length > 0
        ? typeof meta.errors[0] === 'object'
          ? meta.errors.map(({ code, message }: z.core.$ZodIssue) => (
              <p
                className="text-sm font-medium text-destructive"
                id={`${fieldName}-error`}
                key={`${fieldName}-${code}`}
                role="alert"
              >
                {message}
              </p>
            ))
          : meta.errors.map((error) => (
              <p
                className="text-sm font-medium text-destructive"
                id={`${fieldName}-error`}
                key={`${fieldName}`}
                role="alert"
              >
                {error}
              </p>
            ))
        : null}
      {meta.isValidating ? 'Validating...' : null}
    </div>
  )
}
