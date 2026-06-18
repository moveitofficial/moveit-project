import profilePlaceholder from '@public/profile.svg';
import Image from 'next/image';

import { ClientInfo } from './ClientInfo';
import { ExpertInfo } from './ExpertInfo';
import * as styles from './UserDetail.css';

import type { UserDetailData } from '@/features/users/types';

import { BlacklistButton } from '@/features/users/BlacklistButton';

interface Props {
  user: UserDetailData;
}

export default function UserDetail({ user }: Props) {
  return (
    <div className={styles.layout}>
      <div className={styles.profileColumn}>
        <div className={styles.avatar}>
          <Image
            src={user.profileImageUrl ?? profilePlaceholder}
            alt="프로필"
            width={120}
            height={120}
            className={styles.avatarImage}
          />
        </div>

        <div className={styles.profileActions}>
          <BlacklistButton
            userId={user.id}
            userName={user.name}
            isBlocked={user.isBlocked}
            blockedAt={user.blockedAt}
            blockedByAdminName={user.blockedByAdminName}
          />
        </div>
      </div>

      <div className={styles.body}>
        {user.role === 'CLIENT' ? (
          <ClientInfo user={user} />
        ) : (
          <ExpertInfo user={user} />
        )}
      </div>
    </div>
  );
}
