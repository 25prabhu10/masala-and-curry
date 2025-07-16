import { Link } from '@tanstack/react-router'

interface NavigationItem {
  href: string
  label: string
}

const navigationItems: NavigationItem[] = [
  { href: '/', label: 'Menu' },
  { href: '/', label: 'Cart' },
  { href: '/about', label: 'About' },
]

export function MainNavigation() {
  return (
    <div className="hidden items-center gap-6 md:flex">
      {navigationItems.map((item) => (
        <Link
          className="text-foreground/80 hover:text-accent font-medium transition-colors [&.active]:text-primary [&.active]:underline underline-offset-4"
          key={item.label}
          to={item.href}
        >
          {item.label}
        </Link>
      ))}
    </div>
  )
}
