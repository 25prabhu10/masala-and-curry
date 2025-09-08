import { Button } from '@mac/web-ui/button'
import { Link } from '@tanstack/react-router'

import type { NavigationItem } from '@/lib/types'
import { useAppStore } from '@/stores/app-store'

const navigationItems = [
  { label: 'Menu', to: '/menu' },
  { label: 'About', to: '/about' },
] as const satisfies ReadonlyArray<NavigationItem>

export function MainNavigation() {
  return (
    <nav className="flex items-center space-x-4">
      {navigationItems.map((item) => (
        <Link
          className="relative text-foreground/80 hover:text-primary font-medium transition-all duration-300 py-2 px-1 group [&.active]:text-primary"
          key={item.label}
          to={item.to}
        >
          <span className="relative z-10">{item.label}</span>
          <div className="absolute bottom-0 motion-reduce:left-0 motion-safe:left-1/2 motion-safe:-translate-x-1/2 h-0.5 w-0 bg-primary motion-safe:transition-all motion-safe:duration-300 ease-in-out group-hover:w-full [.active_&]:w-full" />
        </Link>
      ))}
    </nav>
  )
}

export function MainNavigationMobile() {
  const closeMobileMenu = useAppStore((state) => state.closeMobileMenu)

  return (
    <div className="flex flex-col items-center space-y-4">
      {navigationItems.map((item) => (
        <Button
          asChild
          className="w-full"
          key={item.label}
          onClick={closeMobileMenu}
          variant="ghost"
        >
          <Link key={item.label} to={item.to}>
            {item.label}
          </Link>
        </Button>
      ))}
    </div>
  )
}
