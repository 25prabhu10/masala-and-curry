import type { LinkProps } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'

export interface NavigationItem extends LinkProps {
  label: string
  role?: string
  icon?: LucideIcon
}
