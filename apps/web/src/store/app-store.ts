import type { User } from '@/lib/auth-client'
import { create } from 'zustand'

interface AppState {
  user: User | undefined
}

export const useAppStore = create<AppState>()(() => {
  return {
    user: undefined,
  }
})
