import { getUserByIdQuery, userKeys } from '@mac/queries/user'
import { Avatar, AvatarFallback, AvatarImage } from '@mac/web-ui/avatar'
import { Button } from '@mac/web-ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@mac/web-ui/dropdown-menu'
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { Link, useNavigate, useRouter } from '@tanstack/react-router'
import { Clock, Heart, Loader2, LogOut, Settings, User } from 'lucide-react'
import { useTransition } from 'react'
import { toast } from 'sonner'

import { type Session, signOut } from '@/lib/auth-client'
import { getInitials } from '@/lib/utils'

type UserProfileDropdownProps = {
  session: Session
}

export function UserProfileDropdown({ session }: UserProfileDropdownProps) {
  const { data: user } = useSuspenseQuery(getUserByIdQuery(session.userId))
  const [isPending, startTransition] = useTransition()
  const navigate = useNavigate()
  const router = useRouter()
  const queryClient = useQueryClient()

  function handleLogout() {
    startTransition(async () => {
      try {
        await signOut()
        toast.success('Signed out successfully', {
          description: 'You have been signed out of your account.',
        })

        await queryClient.resetQueries({ queryKey: userKeys.all })
        await router.invalidate()
        await navigate({ to: '/' })
      } catch (error) {
        toast.error('Failed to sign out', {
          description: error instanceof Error ? error.message : '',
        })
      }
    })
  }

  return (
    <div className="ml-auto">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            aria-disabled={isPending}
            className="size-10 rounded-full"
            disabled={isPending}
            variant="outline"
          >
            <Avatar>
              {isPending ? (
                <div className="absolute bg-primary flex justify-center items-center h-10 w-10 z-10">
                  <Loader2 className="motion-safe:animate-spin" />
                </div>
              ) : (
                <>
                  <AvatarImage alt={user.name} src={''} />
                  <AvatarFallback className="hover:text-accent">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </>
              )}
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link className="cursor-pointer" to="/profile">
              <User className="mr-2 h-4 w-4" />
              <span>Profile Settings</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link className="cursor-pointer" to="/">
              <Clock className="mr-2 h-4 w-4" />
              <span>Order History</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link className="cursor-pointer" to="/">
              <Heart className="mr-2 h-4 w-4" />
              <span>Favorite Items</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link className="cursor-pointer" to="/">
              <Settings className="mr-2 h-4 w-4" />
              <span>Account Settings</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:text-destructive"
            disabled={isPending}
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign Out</span>
            {isPending && <Loader2 className="ml-2 h-4 w-4 motion-safe:animate-spin" />}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
