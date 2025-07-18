import { useFormContext } from '@/context/form-context'

export function FormErrors(props: React.ComponentProps<'p'>) {
  const form = useFormContext()

  return (
    <form.Subscribe selector={(state) => [state.errorMap.onSubmit, state.isSubmitting]}>
      {([onSubmit, isSubmitting]) =>
        !isSubmitting && onSubmit?.form ? (
          <div className="mb-4 p-3 rounded-md bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive" role="alert" {...props}>
              {onSubmit.form}
            </p>
          </div>
        ) : null
      }
    </form.Subscribe>
  )
}
