'use client';

import signupLogo from '@public/SignUp/signUpLogo.svg';
import { ConfirmModal } from '@repo/ui/Modal';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import {
  applyExpertApproval,
  deletePortfolio,
  getMe,
  getMyPortfolios,
  type MeExpertProfile,
} from '../../api';
import { useBlockBack } from '../../useBlockBack';

import * as styles from './ExpertPortfolio.css';

// 백엔드 applyForApproval의 완성 검사와 동일 — 모든 필수 항목이 채워졌는지
const isProfileComplete = (
  profile: MeExpertProfile | null | undefined,
): boolean => {
  if (!profile) return false;
  return (
    profile.businessName !== null &&
    profile.businessNumber !== null &&
    profile.ceoName !== null &&
    profile.contactTimeStart !== null &&
    profile.contactTimeEnd !== null &&
    profile.foundedYear !== null &&
    profile.employeeMin !== null &&
    profile.employeeMax !== null &&
    profile.description !== null &&
    profile.specialtyCategories.length > 0 &&
    profile.techStacks.length > 0
  );
};

export default function ExpertPortfolio() {
  useBlockBack();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [doneOpen, setDoneOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const { data: me, isPending: isMePending } = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    staleTime: 0,
  });
  const { data: portfolios, isPending: isPortfoliosPending } = useQuery({
    queryKey: ['my-portfolios'],
    queryFn: getMyPortfolios,
    staleTime: 0, // 작성 후 돌아오면 최신 목록 다시 조회
  });

  const { mutate: apply, isPending } = useMutation({
    mutationFn: applyExpertApproval,
    onSuccess: () => {
      setDoneOpen(true);
    },
  });

  const { mutate: removePortfolio } = useMutation({
    mutationFn: deletePortfolio,
    onSuccess: async () => {
      setDeleteTargetId(null);
      await queryClient.invalidateQueries({ queryKey: ['my-portfolios'] });
    },
  });

  const isLoading = isMePending || isPortfoliosPending;
  const items = portfolios?.data.items ?? [];
  const profileComplete = isProfileComplete(me?.data.expertProfile);
  const canApply = profileComplete && items.length > 0 && !isPending;

  const goCreate = () => {
    router.push('/create-portfolio');
  };

  const goHome = () => {
    router.replace('/');
  };

  // 로딩 중엔 본문을 그리지 않아 빈/반쪽 상태가 깜빡이지 않게
  if (isLoading) {
    return (
      <section className={styles.Container}>
        <div className={styles.titleWrapper}>
          <Image src={signupLogo} alt="moveit" priority />
          <h1 className={styles.title}>
            전문가 신청을 위해
            <br />
            필수 정보를 작성해주세요
          </h1>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.Container}>
      <div className={styles.titleWrapper}>
        <Image src={signupLogo} alt="moveit" priority />
        <h1 className={styles.title}>
          전문가 신청을 위해
          <br />
          필수 정보를 작성해주세요
        </h1>
      </div>

      <div className={styles.sectionHeader}>
        <p className={styles.sectionTitle}>포트폴리오 등록</p>
        {items.length > 0 && (
          <button type="button" className={styles.addTopBtn} onClick={goCreate}>
            포트폴리오 등록
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className={styles.emptyBox}>
          <p className={styles.emptyDesc}>
            포트폴리오를 등록하시면 승인후
            <br />
            프로필, 판매 중 서비스 페이지에 노출됩니다.
          </p>
          <button type="button" className={styles.addBtn} onClick={goCreate}>
            포트폴리오 등록하기
          </button>
        </div>
      ) : (
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.id} className={styles.card}>
              <div className={styles.cardThumb}>
                {item.thumbnailUrl !== null && (
                  <Image
                    src={item.thumbnailUrl}
                    alt={item.title}
                    fill
                    sizes="276px"
                    style={{ objectFit: 'cover' }}
                  />
                )}
              </div>
              <p className={styles.cardTitle}>{item.title}</p>
              <div className={styles.cardActions}>
                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={() => {
                    router.push(`/create-portfolio?id=${item.id}`);
                  }}
                >
                  편집하기
                </button>
                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={() => {
                    setDeleteTargetId(item.id);
                  }}
                >
                  삭제하기
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className={styles.submitArea}>
        <button
          type="button"
          className={styles.submitBtn}
          disabled={!canApply}
          onClick={() => {
            apply();
          }}
        >
          전문가 승인신청
        </button>
        <p className={styles.skipDesc}>
          {profileComplete ? (
            <>
              전문가 승인 신청을 눌러야지만
              <br />
              전문가 승인이 가능합니다.
            </>
          ) : (
            <>
              프로필 모든 항목을 입력해야 신청할 수 있어요.
              <br />
              마이페이지에서 정보 입력 후 승인신청해주세요.
            </>
          )}
        </p>
        <button type="button" className={styles.skipBtn} onClick={goHome}>
          건너뛰기
        </button>
      </div>

      <ConfirmModal
        isOpen={doneOpen}
        onClose={goHome}
        title="전문가 승인 신청이 완료되었습니다."
        description="관리자 승인 후 전문가로 활동할 수 있어요."
        actions={[{ label: '확인', variant: 'blue', onClick: goHome }]}
      />

      <ConfirmModal
        isOpen={deleteTargetId !== null}
        onClose={() => {
          setDeleteTargetId(null);
        }}
        title="포트폴리오 삭제"
        description={
          <>
            정말 등록하신
            <br />
            포트폴리오를 삭제 하시겠습니까?
          </>
        }
        actions={[
          {
            label: '예',
            variant: 'blue',
            onClick: () => {
              if (deleteTargetId !== null) {
                removePortfolio(deleteTargetId);
              }
            },
          },
          {
            label: '아니오',
            variant: 'white',
            onClick: () => {
              setDeleteTargetId(null);
            },
          },
        ]}
      />
    </section>
  );
}
