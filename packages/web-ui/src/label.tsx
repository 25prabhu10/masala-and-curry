import { cn } from '@mac/tailwind-config'
import { cva, type VariantProps } from 'class-variance-authority'
import { Label as LabelPrimitive } from 'radix-ui'
import * as React from 'react'

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
)

const Label = React.forwardRef<
  React.ComponentPropsWithRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root className={cn(labelVariants(), className)} ref={ref} {...props} />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
