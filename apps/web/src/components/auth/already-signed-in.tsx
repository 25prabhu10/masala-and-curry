import { Button } from '@mac/web-ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@mac/web-ui/card'
import { Link } from '@tanstack/react-router'
import { CheckCircle, Home, User } from 'lucide-react'

type AlreadySignedInProps = {
  userId: string
  callback?: string
}

export function AlreadySignedIn({ userId, callback }: AlreadySignedInProps) {
  return (
    <main className="flex-1 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/10 p-4 flex flex-col justify-center">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md border-primary/20">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-semibold">Already Signed In</CardTitle>
              <CardDescription className="text-base">
                Welcome back! You&apos;re already signed in to your Masala and Curry account.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <User className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Signed in as: <span className="font-medium text-foreground">{userId}</span>
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              <div className="w-full">
                <Button asChild className="w-full">
                  <Link to={callback ?? '/'}>
                    <Home className="h-4 w-4 mr-2" />
                    Continue
                  </Link>
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center mt-2">
                Ready to order some delicious food? Browse our menu and place your order!
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  )
}
