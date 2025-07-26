import baseConfig from '@mac/tailwind-config/native'
// @ts-expect-error - no types
import nativewind from 'nativewind/preset'
import { hairlineWidth } from 'nativewind/theme'
import type { Config } from 'tailwindcss'

export default {
  content: [...baseConfig.content, '../../packages/mobile-ui/src/*.{ts,tsx}'],
  darkMode: 'class',
  presets: [baseConfig, nativewind],
  theme: {
    extend: {
      borderWidth: {
        hairline: hairlineWidth(),
      },
    },
    fontFamily: {
      poppins: ['Poppins-Regular', 'sans-serif'],
      'poppins-bold': ['Poppins-Bold', 'sans-serif'],
    },
  },
} satisfies Config
