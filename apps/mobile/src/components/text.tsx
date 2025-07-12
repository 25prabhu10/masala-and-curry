// oxlint-disable no-restricted-imports
import { cn } from '@mac/tailwind-config'
import * as Slot from '@rn-primitives/slot'
import { createContext, useContext } from 'react'
import { Platform, Text as RNText } from 'react-native'

const TextClassContext = createContext<string | undefined>(undefined)

function Text({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<typeof RNText> & {
  ref?: React.RefObject<RNText>
  asChild?: boolean
}) {
  const textClass = useContext(TextClassContext)
  const Component = asChild ? Slot.Text : RNText
  return (
    <Component
      style={{
        fontFamily: Platform.select({
          android: 'Inter_900Black',
          ios: 'Inter-Black',
        }),
      }}
      className={cn('text-base text-foreground web:select-text', textClass, className)}
      {...props}
    />
  )
}

export { Text, TextClassContext }
