import baseConfig from '@mac/tailwind-config/native'
// @ts-expect-error - no types
import nativewind from 'nativewind/preset'
import { hairlineWidth } from 'nativewind/theme'
import type { Config } from 'tailwindcss'

export default {
  content: [...baseConfig.content, '../../packages/mobile-ui/src/*.{ts,tsx}'],
  presets: [baseConfig, nativewind],
  theme: {
    extend: {
      borderWidth: {
        hairline: hairlineWidth(),
      },
    },
  },
} satisfies Config
