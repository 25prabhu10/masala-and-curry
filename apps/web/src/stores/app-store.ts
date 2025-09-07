import { create } from 'zustand'

interface AppState {
  mobileMenuIsOpen: boolean
}

interface AppStateActions {
  toggleMobileMenu: () => void
  closeMobileMenu: () => void
}

export const useAppStore = create<AppState & AppStateActions>()((set) => ({
  closeMobileMenu: () => set({ mobileMenuIsOpen: false }),
  mobileMenuIsOpen: false,
  toggleMobileMenu: () => set((state) => ({ mobileMenuIsOpen: !state.mobileMenuIsOpen })),
}))
