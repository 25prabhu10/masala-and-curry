import { authKeys } from '@mac/queries/auth'
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
import { Clock, Heart, LayoutDashboard, Loader2, LogOut, User } from 'lucide-react'
import { useTransition } from 'react'
import { toast } from 'sonner'

import { type Session, signOut } from '@/lib/auth-client'
import type { NavigationItem } from '@/lib/types'
import { getInitials } from '@/lib/utils'

type UserProfileDropdownProps = {
  session: Session
}

const navigationItems = [
  {
    icon: User,
    label: 'Profile',
    to: '/profile',
  },
  {
    icon: Clock,
    label: 'Order History',
    to: '/',
  },
  {
    icon: Heart,
    label: 'Favorites',
    to: '/',
  },
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    role: 'admin',
    to: '/dashboard/menu-items',
  },
] as const satisfies ReadonlyArray<NavigationItem>

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

        await queryClient.resetQueries({ queryKey: authKeys.all })
        await queryClient.setQueryData(userKeys.detail(user.id), null)
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
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          aria-disabled={isPending}
          className="size-10 rounded-full"
          disabled={isPending}
          variant="outline"
        >
          <Avatar>
            <AvatarImage alt={user.name} src={''} />
            <AvatarFallback className="hover:text-accent">{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" aria-disabled={isPending} className="w-64" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {navigationItems.map((item) => {
          if ('role' in item && item.role && item.role !== user.role) {
            return null
          }

          const Icon = item.icon

          return (
            <DropdownMenuItem asChild disabled={isPending} key={item.label}>
              <Link className="cursor-pointer" to={item.to}>
                <Icon className="mr-2 size-4" />
                <span>{item.label}</span>
              </Link>
            </DropdownMenuItem>
          )
        })}

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
  )
}
