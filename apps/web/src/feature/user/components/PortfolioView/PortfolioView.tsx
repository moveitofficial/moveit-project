'use client';

import { ConfirmModal } from '@repo/ui/Modal';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import * as styles from './PortfolioView.css';

import { deletePortfolio, getMyPortfolios } from '@/feature/signup/api';
import { useMyUserQuery } from '@/feature/user/queries';

const RETURN_URL = '/mypage/portfolios';

export default function PortfolioView() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const { data: user } = useMyUserQuery();
  const { data: portfolios, isPending } = useQuery({
    queryKey: ['my-portfolios'],
    queryFn: getMyPortfolios,
    staleTime: 0,
  });

  const { mutate: removePortfolio } = useMutation({
    mutationFn: deletePortfolio,
    onSuccess: async () => {
      setDeleteTargetId(null);
      await queryClient.invalidateQueries({ queryKey: ['my-portfolios'] });
    },
  });

  const items = portfolios?.data.items ?? [];
  const isLastOne = items.length === 1;

  const goCreate = () => {
    router.push(`/create-portfolio?returnUrl=${RETURN_URL}`);
  };

  if (isPending) return null;

  return (
    <section className={styles.wrapper}>
      <div className={styles.header}>
        <h1 className={styles.heading}>포트폴리오 관리</h1>
        {items.length > 0 && (
          <button type="button" className={styles.addButton} onClick={goCreate}>
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
          <button type="button" className={styles.emptyButton} onClick={goCreate}>
            포트폴리오 등록하기
          </button>
        </div>
      ) : (
        <ul className={styles.list}>
          {items.map((item) => (
            <li
              key={item.id}
              className={styles.card}
              onClick={() => {
                if (user?.id) {
                  router.push(`/experts/${user.id}/portfolios`);
                }
              }}
            >
              <div className={styles.cardThumb}>
                {item.thumbnailUrl !== null && (
                  <Image
                    src={item.thumbnailUrl}
                    alt={item.title}
                    fill
                    sizes="201px"
                    style={{ objectFit: 'cover' }}
                  />
                )}
              </div>
              <p className={styles.cardTitle}>{item.title}</p>
              <div className={styles.cardActions}>
                <button
                  type="button"
                  className={styles.actionButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/create-portfolio?id=${item.id}&returnUrl=${RETURN_URL}`);
                  }}
                >
                  편집하기
                </button>
                <button
                  type="button"
                  className={styles.actionButton}
                  onClick={(e) => {
                    e.stopPropagation();
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

      <ConfirmModal
        isOpen={deleteTargetId !== null}
        onClose={() => {
          setDeleteTargetId(null);
        }}
        title="포트폴리오 삭제"
        description={
          isLastOne ? (
            <>
              현재 등록된 포트폴리오가 1개뿐이라
              <br />
              삭제가 제한됩니다. 포트폴리오는
              <br />
              최소 1개 이상 유지되어야 하며,
              <br />
              삭제를 원하실 경우,
              <br />
              새로운 포트폴리오를 먼저 등록한 뒤
              <br />
              기존 포트폴리오를 선택하여 삭제해 주세요.
            </>
          ) : (
            <>
              포트폴리오를 삭제하면 해당
              <br />
              내용은 다시 복구할 수 없습니다.
              <br />
              정말 삭제하시겠습니까?
            </>
          )
        }
        actions={
          isLastOne
            ? [
                {
                  label: '예',
                  variant: 'blue',
                  onClick: () => {
                    setDeleteTargetId(null);
                  },
                },
              ]
            : [
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
              ]
        }
      />
    </section>
  );
}
