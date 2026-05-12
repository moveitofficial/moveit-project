import { create } from 'zustand';

interface UIState {
  isMobileMenuOpen: boolean;
  isSearchModalOpen: boolean;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  toggleSearchModal: () => void;
  setSearchModalOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  isSearchModalOpen: false,
  toggleMobileMenu: () => {
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen }));
  },
  setMobileMenuOpen: (open) => {
    set({ isMobileMenuOpen: open });
  },
  toggleSearchModal: () => {
    set((state) => ({ isSearchModalOpen: !state.isSearchModalOpen }));
  },
  setSearchModalOpen: (open) => {
    set({ isSearchModalOpen: open });
  },
}));
