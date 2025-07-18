import { Link } from '@tanstack/react-router'

interface NavigationItem {
  href: string
  label: string
}

const navigationItems: NavigationItem[] = [
  { href: '/', label: 'Menu' },
  { href: '/about', label: 'About' },
]

export function MainNavigation() {
  return (
    <div className="hidden items-center gap-8 md:flex">
      {navigationItems.map((item) => (
        <Link
          className="relative text-foreground/80 hover:text-primary font-medium transition-all duration-300 py-2 px-1 group [&.active]:text-primary"
          key={item.label}
          to={item.href}
        >
          <span className="relative z-10">{item.label}</span>
          <div className="absolute bottom-0 motion-reduce:left-0 motion-safe:left-1/2 motion-safe:-translate-x-1/2 h-0.5 w-0 bg-primary motion-safe:transition-all motion-safe:duration-300 ease-in-out group-hover:w-full [.active_&]:w-full" />
        </Link>
      ))}
    </div>
  )
}
