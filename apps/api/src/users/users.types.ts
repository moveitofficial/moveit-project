import { clientProfileInclude } from '../client-profiles/client-profiles.types';
import { expertProfileInclude } from '../expert-profiles/expert-profiles.types';

import type { Prisma } from '@prisma/client';

export const userWithProfilesInclude = {
  clientProfile: { include: clientProfileInclude },
  expertProfile: { include: expertProfileInclude },
} satisfies Prisma.UserInclude;

export type UserWithProfiles = Prisma.UserGetPayload<{
  include: typeof userWithProfilesInclude;
}>;
