import { Link } from '@tanstack/react-router'
import logoDark from '@/assets/logo-dark.svg'
import logoLight from '@/assets/logo-light.svg'
import { useTheme } from '@/context/theme-context'

export function Logo() {
  const { theme } = useTheme()

  return (
    <Link className="text-2xl font-bold text-primary hover:text-accent transition-colors" to="/">
      <img
        alt="Masala and Curry Logo"
        className="h-8 w-8 mr-2 inline-block"
        src={theme === 'light' ? logoLight : logoDark}
      />
      Masala & Curry
    </Link>
  )
}
