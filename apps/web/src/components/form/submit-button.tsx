import { Button } from '@mac/web-ui/button'
import { Spinner } from '@mac/web-ui/spinner'

import { useFormContext } from '@/context/form-context'

interface SubmitButtonProps {
  label: string
}

export function SubmitButton({
  label,
  ...props
}: Omit<React.ComponentProps<typeof Button>, 'children'> & SubmitButtonProps) {
  const form = useFormContext()

  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) => (
        <Button disabled={isSubmitting || !canSubmit} type="submit" {...props}>
          {isSubmitting ? (
            <>
              <Spinner className="motion-reduce:hidden" />
              <p className="hidden motion-reduce:block">...</p>
            </>
          ) : null}
          {label}
        </Button>
      )}
    </form.Subscribe>
  )
}
