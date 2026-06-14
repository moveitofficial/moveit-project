import { create } from 'zustand';

interface PageHeaderState {
  override: { breadcrumb: string[]; title: string } | null;
  setOverride: (value: { breadcrumb: string[]; title: string } | null) => void;
}

export const usePageHeaderStore = create<PageHeaderState>((set) => ({
  override: null,
  setOverride: (value) => {
    set({ override: value });
  },
}));
