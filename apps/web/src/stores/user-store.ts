import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { User } from '@/feature/login/api';

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => {
        set({ user });
      },
    }),
    {
      name: 'user-account',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
