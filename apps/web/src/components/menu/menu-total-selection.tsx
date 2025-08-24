import { Button } from '@mac/web-ui/button'
import { Phone } from 'lucide-react'

import { formatCurrencyUSD } from '@/lib/utils'
import { useCartStore } from '@/stores/cart-store'

export default function MenuTotalSelection() {
  const itemCount = useCartStore((state) => state.itemCount)
  const total = useCartStore((state) => state.total)
  return (
    itemCount > 0 && (
      <div className="bg-primary/10 rounded-lg p-4 flex flex-col lg:flex-row gap-2 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Cart: {itemCount} item{itemCount !== 1 ? 's' : ''}
          </div>
          <div className="text-lg font-semibold">{formatCurrencyUSD(total)}</div>
        </div>
        {/* <div className="text-sm text-muted-foreground">Continue shopping or go to checkout</div> */}
        {/* <Button asChild>
                <Link aria-label="Go to checkout" from={Route.fullPath} to="/checkout">
                  Checkout
                </Link>
              </Button> */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">
            We are building our online ordering system. In the meantime, please call us to place
            your order.
          </span>
          <Button
            asChild
            className="text-lg px-8 py-3 flex items-center"
            size="lg"
            type="button"
            variant="outline"
          >
            <a aria-label="Call Masala & Curry to place your order" href="tel:+13034841535">
              <Phone className="mr-2 h-5 w-5" />
              (303) 484-1535
            </a>
          </Button>
        </div>
      </div>
    )
  )
}
