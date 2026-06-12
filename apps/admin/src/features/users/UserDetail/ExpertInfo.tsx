import { typography } from '@repo/styles/typography';
import { formatDate } from '@repo/utils';
import Image from 'next/image';

import {
  ContactTimeField,
  EmployeeCountField,
  Field,
  LinkedAccounts,
  SplitField,
  TagPills,
} from './fields';
import * as styles from './UserDetail.css';

import type { ExpertUserDetail } from '@/features/users/types';

import { ExpertApprovalActions } from '@/features/users/ExpertApprovalActions';
import {
  REGION_LABEL,
  SERVICE_CATEGORY_LABEL,
  SERVICE_TYPE_LABEL,
} from '@/utils/constants';

export function ExpertInfo({ user }: { user: ExpertUserDetail }) {
  const expert = user.expert;

  const specialtyLabel =
    user.specialty?.serviceGroupName !== null &&
    user.specialty?.serviceGroupName !== undefined
      ? SERVICE_TYPE_LABEL[user.specialty.serviceGroupName]
      : null;

  const isPending =
    expert.isApplied && !expert.isApproved && expert.rejectedAt === null;
  const isApproved = expert.isApproved;
  const isRejected = expert.rejectedAt !== null;

  const approvalStatus = (() => {
    if (isApproved) {
      return {
        label: '판매자 승인',
        className: styles.approvalStatusBlue,
      };
    }
    if (isRejected) {
      return {
        label: '판매자 승인 거절',
        className: styles.approvalStatusRejected,
      };
    }
    if (isPending) {
      return {
        label: '판매자 승인요청',
        className: styles.approvalStatusBlue,
      };
    }
    return null;
  })();

  const showApprovalActions = !expert.isApproved && (isPending || isRejected);

  return (
    <>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionHeaderMain}>
          <div className={styles.sectionHeaderTitleGroup}>
            <h3 className={`${typography.f18EB} ${styles.sectionTitle}`}>
              기본정보
            </h3>
            {approvalStatus !== null && (
              <span
                className={`${typography.f14EB} ${approvalStatus.className}`}
              >
                {approvalStatus.label}
              </span>
            )}
          </div>
          {isRejected && expert.rejectedAt !== null ? (
            <div
              className={`${typography.f14R} ${styles.sectionHeaderMetaInline}`}
            >
              <span>관리자: {expert.approvedByAdminName ?? '-'}</span>
              <span>거절일 : {formatDate(expert.rejectedAt)}</span>
            </div>
          ) : null}
        </div>
        <div className={styles.sectionHeaderRight}>
          {isApproved && expert.approvedAt !== null ? (
            <div className={`${typography.f14R} ${styles.sectionHeaderMeta}`}>
              <span>관리자 : {expert.approvedByAdminName ?? '-'}</span>
              <span>승인일 : {formatDate(expert.approvedAt)}</span>
            </div>
          ) : null}
          {showApprovalActions ? (
            <ExpertApprovalActions
              userId={user.id}
              businessName={expert.businessName ?? null}
            />
          ) : null}
        </div>
      </div>

      {expert.rejectedAt !== null && expert.rejectReason !== null ? (
        <div className={`${typography.f14EB} ${styles.rejectReasonStrip}`}>
          {expert.rejectReason}
        </div>
      ) : null}

      <div className={styles.grid2}>
        <Field label="회사명" value={expert.businessName} />
        <Field label="대표자 명" value={expert.ceoName} />
      </div>

      <div className={styles.grid2}>
        <SplitField label="소개">
          <div className={`${typography.f16R} ${styles.fieldValueTextarea}`}>
            {expert.description ?? '-'}
          </div>
        </SplitField>
        <SplitField label="연동된 계정">
          <LinkedAccounts provider={user.provider} />
        </SplitField>
      </div>

      <p className={`${typography.f18EB} ${styles.sectionDivider}`}>회사정보</p>
      <div className={styles.grid2}>
        <Field label="사업자 번호" value={expert.businessNumber} />
        <Field label="전화번호" value={user.phoneNumber} />
        <Field
          label="설립연도"
          value={
            expert.foundedYear === null ? null : String(expert.foundedYear)
          }
        />
        <ContactTimeField
          start={expert.contactTimeStart}
          end={expert.contactTimeEnd}
        />
        <EmployeeCountField min={expert.employeeMin} max={expert.employeeMax} />
        <Field
          label="지역"
          value={
            user.region === null
              ? null
              : (REGION_LABEL[user.region] ?? user.region)
          }
        />
        <Field label="은행명" value={user.bankName} />
        <Field label="입금계좌" value={user.bankAccount} />
      </div>

      <p className={`${typography.f18EB} ${styles.sectionDivider}`}>
        분야 및 보유기술
      </p>
      <div className={styles.grid2}>
        <Field label="전문 분야" value={specialtyLabel} />
        <SplitField label="상세 분야">
          <TagPills
            items={user.specialty?.serviceCategoryNames ?? []}
            getLabel={(cat) => SERVICE_CATEGORY_LABEL[cat] ?? cat}
          />
        </SplitField>
      </div>

      <SplitField label="보유기술">
        <TagPills items={expert.techStacks} />
      </SplitField>

      <p className={`${typography.f18EB} ${styles.sectionDivider}`}>
        포트폴리오
      </p>
      {expert.portfolios.length > 0 ? (
        <div className={styles.portfolioGrid}>
          {expert.portfolios.map((portfolio) => (
            <div key={portfolio.id} className={styles.portfolioCard}>
              <div className={styles.portfolioItem}>
                {portfolio.mainImageUrl === null ? null : (
                  <Image
                    src={portfolio.mainImageUrl}
                    alt={portfolio.title}
                    width={332}
                    height={332}
                    className={styles.portfolioImage}
                  />
                )}
              </div>
              <p className={`${typography.f14EB} ${styles.portfolioTitle}`}>
                {portfolio.title}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <span className={`${typography.f16R} ${styles.emptyText}`}>
          포트폴리오가 없습니다.
        </span>
      )}
    </>
  );
}
