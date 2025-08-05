import { Button } from '@mac/web-ui/button'
import { Monitor, Moon, Sun } from 'lucide-react'

import { useTheme } from '@/context/theme-context'

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  const themes = [
    { icon: Sun, label: 'Light', value: 'light' as const },
    { icon: Moon, label: 'Dark', value: 'dark' as const },
    { icon: Monitor, label: 'System', value: 'system' as const },
  ]

  function cycleTheme() {
    const currentIndex = themes.findIndex((t) => t.value === theme)
    const nextIndex = (currentIndex + 1) % themes.length
    const nextTheme = themes[nextIndex]
    if (nextTheme) {
      setTheme(nextTheme.value)
    }
  }

  const currentTheme = themes.find((t) => t.value === theme) ?? themes[2]
  const CurrentIcon = currentTheme?.icon ?? Monitor

  return (
    <Button
      aria-label={`Current theme: ${currentTheme?.label ?? 'System'}. Click to cycle themes`}
      onClick={cycleTheme}
      size="icon"
      title={`Current theme: ${currentTheme?.label ?? 'System'}. Click to cycle themes`}
      variant="ghost"
    >
      <CurrentIcon className="h-4 w-4" />
    </Button>
  )
}
