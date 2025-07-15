import { Trans } from '@lingui/react/macro'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <div className="p-2">
      <h3 className="text-2xl font-bold">
        <Trans>About Us</Trans>
      </h3>
      <p className="mt-2">
        <Trans>This is the about page of our application.</Trans>
      </p>
    </div>
  )
}
