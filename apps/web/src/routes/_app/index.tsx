import { getMenuItemsQuery } from '@mac/queries/menu-item'
import { Button } from '@mac/web-ui/button'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, Clock, MapPin, Phone, Star } from 'lucide-react'

import ImageUI from '@/components/image-ui'
import { getImageURL } from '@/lib/utils'

const queryOptions = {
  availableOnly: true,
  pageSize: 3,
  sortBy: 'isPopular',
}

export const Route = createFileRoute('/_app/')({
  component: Index,
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(getMenuItemsQuery(queryOptions))
  },
})

function Index() {
  const {
    data: { result: featuredDishes },
  } = useSuspenseQuery(getMenuItemsQuery(queryOptions))

  return (
    <main className="flex-1">
      <section className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                  Authentic Flavors of <span className="text-primary">India & Nepal</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Experience the rich culinary heritage where aromatic Indian spices meet the hearty
                  traditions of Nepal. From creamy butter chicken to authentic momos, every dish
                  tells a story of flavour and tradition.
                </p>
              </div>

              <div className="flex flex-col items-center sm:flex-row gap-4">
                <Button
                  asChild
                  className="text-lg px-8 py-3 flex items-center"
                  size="lg"
                  type="button"
                  variant="outline"
                >
                  <a aria-label="Call Masala & Curry to place your order" href="tel:+13034841535">
                    <Phone className="mr-2 h-5 w-5" />
                    Call (303) 484-1535
                  </a>
                </Button>
                <Button asChild className="text-lg px-8 py-3" size="lg" type="button">
                  <Link from={Route.fullPath} to="/menu">
                    View Menu
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                We are building our online ordering system. In the meantime, please call us to place
                your order.
              </p>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star className="h-5 w-5 fill-primary text-primary" key={`star-${i}`} />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">4.3/5 • 100+ reviews</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <img
                    alt="Featured Dish"
                    className="w-full h-auto rounded-lg shadow-lg"
                    src="/images/landing-food.jpg"
                  />
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-card border border-border rounded-lg p-4 shadow-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">30 min delivery</span>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-card border border-border rounded-lg p-4 shadow-lg">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="text-sm font-medium">Fresh ingredients</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Signature Dishes</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our most beloved dishes, crafted with authentic recipes passed down through
              generations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDishes.map((dish) => (
              <div
                className="bg-card rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-lg transition-shadow"
                key={dish.name}
              >
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  <ImageUI alt={dish.name} url={getImageURL(dish.image)} />
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-semibold text-foreground">{dish.name}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {dish.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Why Choose Masala & Curry?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div className="text-center space-y-4" key={feature.title}>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-4">Visit Us Today</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Come experience the warmth of our hospitality and the richness of our flavors.
                  We&apos;re conveniently located and ready to serve you.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium text-foreground">2796 S Broadway</p>
                    <p className="text-muted-foreground">Englewood, CO 80113</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <p className="text-foreground">(303) 484-1535</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl p-8 border border-border">
              <h3 className="text-xl font-semibold text-foreground mb-6">Opening Hours</h3>
              <div className="space-y-3">
                {hours.map((day) => (
                  <div className="flex justify-between items-center" key={day.day}>
                    <span className="text-foreground">{day.day}</span>
                    <span className="text-muted-foreground">{day.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

const features = [
  {
    description:
      'Traditional family recipes passed down through generations, prepared with love and authenticity',
    icon: Star,
    title: 'Authentic Recipes',
  },
  {
    description:
      'All ingredients sourced fresh daily and spices ground in-house for maximum flavour',
    icon: Clock,
    title: 'Fresh Daily',
  },
  {
    description:
      'Hot, fresh meals delivered to your door in 30 minutes or less within our delivery zone',
    icon: MapPin,
    title: 'Fast Delivery',
  },
]

const hours = [{ day: 'All Days', hours: '11:00 AM - 9:30 PM' }]
