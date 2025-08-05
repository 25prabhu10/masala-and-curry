import { create } from 'zustand'

interface AppState {
  mobileMenuIsOpen: boolean
}

interface AppStateActions {
  toggleMobileMenu: () => void
  closeMobileMenu: () => void
}

export const useAppStore = create<AppState & AppStateActions>()((set) => {
  return {
    closeMobileMenu: () => set({ mobileMenuIsOpen: false }),
    mobileMenuIsOpen: false,
    toggleMobileMenu: () =>
      set((state) => {
        return { mobileMenuIsOpen: !state.mobileMenuIsOpen }
      }),
  }
})
