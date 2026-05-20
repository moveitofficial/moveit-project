import type { AdminExpert, AdminUser } from '@/mocks/types';

import { mockAdminExperts, mockAdminUsers } from '@/mocks';

export function getClientUsers(): AdminUser[] {
  return mockAdminUsers;
}

export function getExpertUsers(): AdminExpert[] {
  return mockAdminExperts;
}
