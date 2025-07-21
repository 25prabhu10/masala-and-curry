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
import { useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useRouter } from '@tanstack/react-router'
import { Clock, Heart, LogOut, Settings, User } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { signOut, type User as UserType } from '@/lib/auth-client'

type UserProfileDropdownProps = {
  user: UserType
}

export function UserProfileDropdown({ user }: UserProfileDropdownProps) {
  const [isPending, setIsPending] = useState(false)
  const navigate = useNavigate()
  const router = useRouter()
  const queryClient = useQueryClient()

  function handleLogout() {
    setIsPending(true)
    signOut()
      .then(() => {
        toast.success('Signed out successfully', {
          description: 'You have been signed out of your account.',
        })
        setIsPending(false)
        queryClient.invalidateQueries()
        router.invalidate().finally(() => {
          navigate({ to: '/' })
        })
      })
      .catch((error) => {
        toast.error('Failed to sign out', {
          description: error.message,
        })
        setIsPending(false)
      })
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="ml-auto">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="h-10 w-10 rounded-full" variant="outline">
            <Avatar>
              <AvatarImage alt={user.name} src={user.image ?? ''} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
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
            <Link className="cursor-pointer" to="/">
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
            <span>{isPending ? 'Signing out...' : 'Sign Out'}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
