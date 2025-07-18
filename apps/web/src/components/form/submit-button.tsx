import { Button } from '@mac/web-ui/button'
import { Loader2 } from 'lucide-react'
import { useFormContext } from '@/context/form-context'

interface SubmitButtonProps {
  label: string
}

export function SubmitButton({
  label,
  ...props
}: React.ComponentProps<typeof Button> & SubmitButtonProps) {
  const form = useFormContext()

  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) => (
        <Button disabled={isSubmitting || !canSubmit} type="submit" {...props}>
          {label}
          {isSubmitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        </Button>
      )}
    </form.Subscribe>
  )
}
