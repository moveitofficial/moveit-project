import { Field, LinkedAccounts, SplitField, TagPills } from './fields';
import * as styles from './UserDetail.css';

import type { ClientUserDetail } from '@/features/users/types';

import {
  REGION_LABEL,
  SERVICE_CATEGORY_LABEL,
  SERVICE_TYPE_LABEL,
} from '@/utils/constants';

export function ClientInfo({ user }: { user: ClientUserDetail }) {
  const interestLabel =
    user.specialty?.serviceGroupName !== null &&
    user.specialty?.serviceGroupName !== undefined
      ? SERVICE_TYPE_LABEL[user.specialty.serviceGroupName]
      : null;

  return (
    <>
      <div className={styles.grid2}>
        <Field label="이름" value={user.name} />
        <Field label="닉네임" value={user.nickname} />
        <Field label="이메일" value={user.email} />
        <Field label="연락처" value={user.phoneNumber} />
        <Field label="환불받을 은행명" value={user.bankName} />
        <Field label="환불받을 입금계좌" value={user.bankAccount} />
      </div>

      <div className={styles.grid2}>
        <Field label="관심 분야" value={interestLabel} />
        <SplitField label="상세 분야">
          <TagPills
            items={user.specialty?.serviceCategoryNames ?? []}
            getLabel={(cat) => SERVICE_CATEGORY_LABEL[cat] ?? cat}
          />
        </SplitField>
      </div>

      <div className={styles.grid2}>
        <Field
          label="지역"
          value={
            user.region === null
              ? null
              : (REGION_LABEL[user.region] ?? user.region)
          }
        />
        <SplitField label="연동된 계정">
          <LinkedAccounts provider={user.provider} />
        </SplitField>
      </div>
    </>
  );
}
