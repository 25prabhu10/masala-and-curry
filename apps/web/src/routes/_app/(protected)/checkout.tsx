import { createFileRoute } from '@tanstack/react-router'

import { CheckoutPage } from '@/components/checkout/checkout-page'

export const Route = createFileRoute('/_app/(protected)/checkout')({
  component: RouteComponent,
})

function RouteComponent() {
  return <CheckoutPage />
}
