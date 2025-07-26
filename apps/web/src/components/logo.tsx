import { Link } from '@tanstack/react-router'

import logoDark from '@/assets/logo-dark.svg'
import logoLight from '@/assets/logo-light.svg'
import { useTheme } from '@/context/theme-context'

export function Logo() {
  const { theme } = useTheme()

  return (
    <Link
      className="flex items-center gap-3 text-2xl lg:text-3xl font-bold text-primary hover:text-primary/80 transition-colors group"
      to="/"
    >
      <img
        alt="Masala and Curry Logo"
        className="h-10 w-10 lg:h-12 lg:w-12"
        src={theme === 'light' ? logoLight : logoDark}
      />
      <span className="hidden sm:inline">Masala & Curry</span>
      <span className="sm:hidden">M&C</span>
    </Link>
  )
}
