import { Button } from '@mac/web-ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@mac/web-ui/card'
import { Separator } from '@mac/web-ui/separator'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, CreditCard, MapPin, ShoppingBag } from 'lucide-react'
import { useState } from 'react'

import { DeliveryDetailsForm } from './delivery-details-form'
import { OrderSummary } from './order-summary'
import { PaymentMethodSelector } from './payment-method-selector'

export function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState<'delivery' | 'payment' | 'review'>('delivery')

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/menu">
            <Button size="icon" variant="ghost">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Checkout</h1>
            <p className="text-muted-foreground">Complete your order from Masala and Curry</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8 max-w-md mx-auto">
          <div className="flex items-center w-full">
            <div
              className={`flex items-center ${currentStep === 'delivery' ? 'text-primary' : currentStep === 'payment' || currentStep === 'review' ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <div
                className={`rounded-full p-2 ${currentStep === 'delivery' ? 'bg-primary text-primary-foreground' : currentStep === 'payment' || currentStep === 'review' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
              >
                <MapPin className="h-4 w-4" />
              </div>
              <span className="ml-2 text-sm font-medium">Delivery</span>
            </div>
            <Separator className="flex-1 mx-4" />
            <div
              className={`flex items-center ${currentStep === 'payment' ? 'text-primary' : currentStep === 'review' ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <div
                className={`rounded-full p-2 ${currentStep === 'payment' ? 'bg-primary text-primary-foreground' : currentStep === 'review' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
              >
                <CreditCard className="h-4 w-4" />
              </div>
              <span className="ml-2 text-sm font-medium">Payment</span>
            </div>
            <Separator className="flex-1 mx-4" />
            <div
              className={`flex items-center ${currentStep === 'review' ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <div
                className={`rounded-full p-2 ${currentStep === 'review' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
              >
                <ShoppingBag className="h-4 w-4" />
              </div>
              <span className="ml-2 text-sm font-medium">Review</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {currentStep === 'delivery' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Delivery Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <DeliveryDetailsForm onContinue={() => setCurrentStep('payment')} />
                </CardContent>
              </Card>
            )}

            {currentStep === 'payment' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PaymentMethodSelector
                    onBack={() => setCurrentStep('delivery')}
                    onContinue={() => setCurrentStep('review')}
                  />
                </CardContent>
              </Card>
            )}

            {currentStep === 'review' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Review Order
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Please review your order details before completing your purchase.
                    </p>

                    {/* Delivery Details Summary */}
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Delivery Address</h4>
                      <p className="text-sm text-muted-foreground">
                        This will show the delivery address from the form
                      </p>
                    </div>

                    {/* Payment Method Summary */}
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Payment Method</h4>
                      <p className="text-sm text-muted-foreground">
                        This will show the selected payment method
                      </p>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button
                        className="flex-1"
                        onClick={() => setCurrentStep('payment')}
                        variant="outline"
                      >
                        Back to Payment
                      </Button>
                      <Button className="flex-1">Place Order</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <OrderSummary />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
