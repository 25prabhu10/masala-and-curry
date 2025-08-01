import baseConfig from '@mac/tailwind-config/web'
import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

export default {
  // We need to append the path to the UI package to the content array so that
  // those classes are included correctly.
  content: [...baseConfig.content, './index.html', '../../packages/web-ui/src/**/*.{ts,tsx}'],
  presets: [baseConfig],
  theme: {
    extend: {
      fontFamily: {
        mono: [...fontFamily.mono],
        sans: ['Poppins', ...fontFamily.sans],
      },
    },
  },
} satisfies Config
