import { Badge } from '@mac/web-ui/badge'
import { Button } from '@mac/web-ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@mac/web-ui/card'
import { Separator } from '@mac/web-ui/separator'
import { Minus, Plus, ShoppingBag } from 'lucide-react'

// Mock data - in a real app, this would come from a cart store/context
const mockCartItems = [
  {
    id: '1',
    name: 'Chicken Tikka Masala',
    price: 16.99,
    quantity: 2,
    specialInstructions: 'Extra rice',
    spiceLevel: 'Medium',
  },
  {
    id: '2',
    name: 'Garlic Naan',
    price: 3.99,
    quantity: 3,
    specialInstructions: null,
    spiceLevel: null,
  },
  {
    id: '3',
    name: 'Mango Lassi',
    price: 4.99,
    quantity: 1,
    specialInstructions: null,
    spiceLevel: null,
  },
]

const deliveryFee = 2.99
const tax = 4.87
const tip = 3

export function OrderSummary() {
  const subtotal = mockCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal + deliveryFee + tax + tip

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {mockCartItems.map((item) => (
            <div className="flex items-start gap-3" key={item.id}>
              <div className="flex-1">
                <h4 className="font-medium">{item.name}</h4>
                {item.spiceLevel && (
                  <Badge className="text-xs mt-1" variant="secondary">
                    {item.spiceLevel} Spice
                  </Badge>
                )}
                {item.specialInstructions && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Note: {item.specialInstructions}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <Button className="h-6 w-6" size="icon" variant="outline">
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-sm font-medium">{item.quantity}</span>
                  <Button className="h-6 w-6" size="icon" variant="outline">
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">${item.price} each</p>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Delivery Fee</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tip</span>
            <span>${tip.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-muted/50 p-3 rounded-lg">
          <p className="text-sm font-medium">Estimated Delivery</p>
          <p className="text-sm text-muted-foreground">30-45 minutes</p>
        </div>

        <div className="space-y-2">
          <Button className="w-full" size="sm" variant="outline">
            Add Promo Code
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
