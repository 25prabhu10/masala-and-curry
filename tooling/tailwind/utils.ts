import { cx } from 'class-variance-authority'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: Parameters<typeof cx>) {
  return twMerge(cx(inputs))
}

export { cn }
