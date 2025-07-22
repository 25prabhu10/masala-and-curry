import { Avatar, AvatarFallback, AvatarImage } from '@mac/web-ui/avatar'
import { Button } from '@mac/web-ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@mac/web-ui/card'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { Calendar, Clock, Edit, Heart, Mail, MapPin, Phone, Shield, Star, User } from 'lucide-react'

export const Route = createFileRoute('/profile')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (!context.userSession?.user) {
      throw redirect({
        to: '/sign-in',
        search: { callback: '/profile' },
      })
    }
  },
  loader: async ({ context }) => {
    return { user: context.userSession!.user }
  },
})

function RouteComponent() {
  const { user } = Route.useLoaderData()

  return (
    <main className="flex-1 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/10">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">Your Profile</h1>
            <p className="text-lg text-muted-foreground">
              Manage your account information and preferences
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Overview */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage alt={user.name} src={user.image ?? ''} />
                      <AvatarFallback className="text-2xl bg-primary/10">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle className="text-xl">{user.name}</CardTitle>
                  <CardDescription className="text-base">{user.email}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Member since</span>
                    <span className="text-sm font-medium">{formatDate(user.createdAt)}</span>
                  </div>

                  {user.role && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Role</span>
                      <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3 text-primary" />
                        <span className="text-sm font-medium capitalize">
                          {user.role.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="w-full h-px bg-border my-4" />

                  <Button className="w-full" variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Your basic account information for Masala and Curry
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{user.name}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Email Address
                      </label>
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{user.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Phone Number
                      </label>
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Not provided</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Account Created
                      </label>
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{formatDate(user.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Account Activity
                  </CardTitle>
                  <CardDescription>
                    Your recent activity and statistics with Masala and Curry
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center space-y-2">
                      <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">0</p>
                        <p className="text-sm text-muted-foreground">Total Orders</p>
                      </div>
                    </div>

                    <div className="text-center space-y-2">
                      <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Heart className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">0</p>
                        <p className="text-sm text-muted-foreground">Favorite Items</p>
                      </div>
                    </div>

                    <div className="text-center space-y-2">
                      <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Star className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">0</p>
                        <p className="text-sm text-muted-foreground">Reviews</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Address Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Delivery Addresses
                  </CardTitle>
                  <CardDescription>
                    Manage your saved delivery addresses for faster checkout
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 space-y-4">
                    <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                      <MapPin className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-foreground font-medium">No addresses saved</p>
                      <p className="text-sm text-muted-foreground">
                        Add a delivery address to make ordering easier
                      </p>
                    </div>
                    <Button>
                      <MapPin className="mr-2 h-4 w-4" />
                      Add Address
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return 'Unknown'
  }
}
