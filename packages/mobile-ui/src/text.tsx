import { cn } from '@mac/tailwind-config/utils'
import * as Slot from '@rn-primitives/slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { Text as RNText } from 'react-native'

const TextClassContext = React.createContext<string | undefined>(undefined)

const textVariants = cva('text-base text-foreground web:select-text', {
  defaultVariants: {
    variant: 'default',
  },
  variants: {
    variant: {
      bold: 'font-poppins-bold',
      default: 'font-poppins',
    },
  },
})

function Text({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<typeof RNText> &
  VariantProps<typeof textVariants> & {
    ref?: React.RefObject<RNText>
    asChild?: boolean
  }) {
  const textClass = React.useContext(TextClassContext)
  const Component = asChild ? Slot.Text : RNText
  return <Component className={cn(textVariants({ variant }), textClass, className)} {...props} />
}

export { Text, TextClassContext }
