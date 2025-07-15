import { Trans } from '@lingui/react/macro'
import { Button } from '@mac/web-ui/button'
import { createFileRoute } from '@tanstack/react-router'
import { loadTranslations } from '@/lib/i18nt'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="p-2">
      <h3 className="text-2xl font-bold">
        <Trans>Welcome to Masala and Curry!</Trans>
      </h3>
      <p className="mt-2">
        <Trans>
          This is a sample application demonstrating the use of React Router and TanStack Query.
        </Trans>
      </p>
      <div className="mt-4 flex gap-2">
        <Button
          onClick={async () => {
            await loadTranslations('en-US')
          }}
        >
          <Trans>English</Trans>
        </Button>
        <Button
          onClick={async () => {
            await loadTranslations('hi-IN')
          }}
          variant={'secondary'}
        >
          <Trans>Hindi</Trans>
        </Button>
      </div>
    </div>
  )
}
