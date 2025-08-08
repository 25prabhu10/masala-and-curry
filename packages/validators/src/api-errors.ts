import { FORM_SUBMISSION_GENERIC_DESC } from '@mac/resources/general'

export type APIErrorResponse = {
  errors?: string[]
  properties?: Record<
    string,
    {
      errors?: string[]
      items?: (null | { errors?: string[] })[]
    }
  >
}

type FieldErrorsType = {
  fields: APIErrorResponse
}

export class FieldErrors extends Error {
  errorRes: FieldErrorsType

  constructor(errorRes: APIErrorResponse) {
    super(FORM_SUBMISSION_GENERIC_DESC)
    this.name = 'FieldErrors'
    this.errorRes = { fields: errorRes }
    Object.setPrototypeOf(this, FieldErrors.prototype)
  }
}

type FormErrorsType = {
  form: string | string[]
}

export class FormErrors extends Error {
  errorRes: FormErrorsType

  constructor(message: string) {
    super(message)
    this.name = 'FormErrors'
    this.errorRes = { form: message }
    Object.setPrototypeOf(this, FieldErrors.prototype)
  }
}
