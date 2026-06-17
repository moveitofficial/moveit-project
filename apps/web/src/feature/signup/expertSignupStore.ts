import { create } from 'zustand';

export interface ExpertActivityDraft {
  businessName: string;
  businessNumber: string;
  phone: string;
  ceoName: string;
  bankName: string;
  bankAccount: string;
  contactTimeStart: string;
  contactTimeEnd: string;
  region: string;
}

interface ExpertSignupState {
  activity: ExpertActivityDraft | null;
  setActivity: (activity: ExpertActivityDraft) => void;
  clear: () => void;
}

export const useExpertSignupStore = create<ExpertSignupState>((set) => ({
  activity: null,
  setActivity: (activity) => {
    set({ activity });
  },
  clear: () => {
    set({ activity: null });
  },
}));
