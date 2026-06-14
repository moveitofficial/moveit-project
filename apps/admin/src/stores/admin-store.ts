import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { AdminAccount } from '@/features/login/api';

interface AdminState {
  admin: AdminAccount | null;
  setAdmin: (admin: AdminAccount | null) => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      admin: null,
      setAdmin: (admin) => {
        set({ admin });
      },
    }),
    {
      name: 'admin-account',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
