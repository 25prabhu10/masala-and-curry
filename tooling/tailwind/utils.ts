import { cx } from 'class-variance-authority'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: Parameters<typeof cx>): string {
  return twMerge(cx(inputs))
}

export { cn }
