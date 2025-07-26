import { create } from 'zustand'

import type { User } from '@/lib/auth-client'

interface AppState {
  user: User | undefined
}

export const useAppStore = create<AppState>()(() => {
  return {
    user: undefined,
  }
})
