import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapsed: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  isSidebarCollapsed: false,
  toggleSidebar: () => {
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
  },
  setSidebarOpen: (open) => {
    set({ isSidebarOpen: open });
  },
  toggleSidebarCollapsed: () => {
    set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed }));
  },
  setSidebarCollapsed: (collapsed) => {
    set({ isSidebarCollapsed: collapsed });
  },
}));
