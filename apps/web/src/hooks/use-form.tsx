import { createFormHook } from '@tanstack/react-form'
import CheckboxField from '@/components/form/checkbox-field'
import { FormErrors } from '@/components/form/form-errors'
import PasswordField from '@/components/form/password-field'
import { SubmitButton } from '@/components/form/submit-button'
import { TextField } from '@/components/form/text-field'
import { fieldContext, formContext } from '@/context/form-context'

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    CheckboxField,
    PasswordField,
    TextField,
  },
  fieldContext,
  formComponents: {
    SubmitButton,
    FormErrors,
  },
  formContext,
})
