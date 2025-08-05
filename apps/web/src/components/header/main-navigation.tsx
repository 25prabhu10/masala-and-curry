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

/* <Sheet onOpenChange={setIsOpen} open={isOpen}>
  <SheetTrigger asChild>
  <Button
  aria-label="Open navigation menu"
  className="md:hidden"
  size="icon"
  variant="ghost"
    >
      <Menu className="h-5 w-5" />
    </Button>
  </SheetTrigger>
  <SheetContent className="w-[300px] sm:w-[400px]" side="left">
    <SheetHeader>
      <SheetTitle>Navigation</SheetTitle>
    </SheetHeader>
    <nav className="flex flex-col gap-4 mt-6">
      {navigationItems.map((item) => (
        <SheetClose asChild key={item.label}>
          <Link
            className="flex items-center py-3 px-4 text-foreground hover:bg-accent hover:text-accent-foreground rounded-md font-medium transition-colors [&.active]:bg-primary [&.active]:text-primary-foreground"
            onClick={() => setIsOpen(false)}
            to={item.to}
          >
            {item.label}
          </Link>
        </SheetClose>
      ))}
    </nav>
  </SheetContent>
</Sheet> */
