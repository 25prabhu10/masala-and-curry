import { createFormHook } from '@tanstack/react-form'

import CheckboxField from '@/components/form/checkbox-field'
import FileField from '@/components/form/file-field'
import { FormErrors } from '@/components/form/form-errors'
import PasswordField from '@/components/form/password-field'
import SelectField from '@/components/form/select-field'
import { SubmitButton } from '@/components/form/submit-button'
import { TextField } from '@/components/form/text-field'
import { fieldContext, formContext } from '@/context/form-context'

export const { useAppForm } = createFormHook({
  fieldComponents: {
    CheckboxField,
    FileField,
    PasswordField,
    SelectField,
    TextField,
  },
  fieldContext,
  formComponents: {
    FormErrors,
    SubmitButton,
  },
  formContext,
})
