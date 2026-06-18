'use client';

import expertImageFallback from '@public/profile.svg';
import { RectLabel } from '@repo/ui/RectLabel';
import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import {
  addFavoriteExpert,
  removeFavoriteExpert,
} from '../../api';
import { canInteractWithExpert } from '../../utils';
import { ExpertRestrictionModal } from '../ExpertDetailModals/ExpertDetailModals';
import * as viewStyles from '../ExpertDetailView/ExpertDetailView.css';
import ExpertInquiryModal from '../ExpertInquiryModal/ExpertInquiryModal';
import ExpertReportModal from '../ExpertReportModal/ExpertReportModal';

import * as heroStyles from './ExpertDetailHero.css';

import type {
  ExpertDetailBusinessInfo,
  ExpertDetailDisplayStats,
  ExpertDetailPageData,
  ExpertDetailViewerRole,
} from '../../types';

import { ConsultationSuccessModal } from '@/feature/consultation/components/ConsultationSuccessModal';
import {
  FAVORITES_KEY,
  useFavoriteExpertsQuery,
} from '@/feature/favorites/queries';
import { getTechStackLabel } from '@/mocks/metadata';

interface Props {
  data: ExpertDetailPageData;
  viewer: ExpertDetailViewerRole;
}

function StatBlock({
  stats,
}: {
  stats: ExpertDetailDisplayStats;
}) {
  const statItems = [
    {
      label: '총 거래',
      value: stats.totalOrderCount.toLocaleString(),
      sub: `${String(stats.serviceCount)}개 서비스`,
    },
    {
      label: '만족도',
      value: stats.averageRating.toFixed(1),
      sub: `${stats.reviewCount.toLocaleString()}개 리뷰`,
    },
    {
      label: '구매율',
      value: `${String(stats.purchaseRate)}%`,
      sub: stats.isNewExpert ? '응답이 빨라요' : '검증된 판매자',
    },
    {
      label: '완료율',
      value: `${String(stats.completionRate)}%`,
      sub: '일정 미준수 0',
    },
  ] as const;

  return (
    <div className={heroStyles.statsGrid}>
      {statItems.map((item) => (
        <div key={item.label} className={heroStyles.statItem}>
          <p className={heroStyles.statLabel}>{item.label}</p>
          <p className={heroStyles.statNumber}>
            {stats.isNewExpert ? '신규 전문가' : item.value}
          </p>
          <p className={heroStyles.statSubLabel}>{item.sub}</p>
        </div>
      ))}
    </div>
  );
}

function InfoBar({ info }: { info: ExpertDetailBusinessInfo }) {
  return (
    <div className={viewStyles.infoPanel}>
      <div className={viewStyles.infoItemWide}>
        <p className={viewStyles.infoLabel}>이런 분들과 협업 했어요</p>
        <div className={viewStyles.clientTagList}>
          {info.clientNames.map((name, index) => (
            <span key={`${name}-${String(index)}`} className={viewStyles.clientTag}>
              {name}
            </span>
          ))}
        </div>
      </div>
      <div className={viewStyles.infoItem}>
        <p className={viewStyles.infoLabel}>설립년도</p>
        <p className={viewStyles.infoValue}>
          {info.foundedYearLabel ?? '-'}
        </p>
      </div>
      <div className={viewStyles.infoItem}>
        <p className={viewStyles.infoLabel}>지역</p>
        <p className={viewStyles.infoValue}>{info.regionLabel ?? '-'}</p>
      </div>
      <div className={viewStyles.infoItem}>
        <p className={viewStyles.infoLabel}>인원수</p>
        <p className={viewStyles.infoValue}>{info.employeeRangeLabel ?? '-'}</p>
      </div>
      <div className={viewStyles.infoItemTime}>
        <p className={viewStyles.infoLabel}>연락 가능 시간</p>
        <p className={viewStyles.infoValueTime}>{info.contactTimeLabel}</p>
      </div>
    </div>
  );
}

export default function ExpertDetailHero({ data, viewer }: Props) {
  const { expert, displayStats, businessInfo, favoriteCount, portfolioExpertContext } =
    data;
  // 찜 여부는 찜목록(클라이언트 캐시)에서 렌더 시점에 판정한다.
  // SSR/소프트네비 시 상세의 isFavorite가 어긋나도, 찜목록 캐시 기준이라 즉시 정확.
  const queryClient = useQueryClient();
  const { data: favoriteExperts } = useFavoriteExpertsQuery();
  const [optimisticFavorite, setOptimisticFavorite] = useState<boolean | null>(
    null,
  );
  // 진입 시점의 찜 상태 기준(= favoriteCount가 반영하는 상태). 카운트 증감 계산용.
  const [favoriteCountBase, setFavoriteCountBase] = useState<boolean | null>(
    null,
  );

  const queryFavorite =
    favoriteExperts === undefined
      ? null
      : favoriteExperts.some((item) => item.id === expert.id);
  const serverFavorite = queryFavorite ?? expert.isFavorite;
  const isFavorite = optimisticFavorite ?? serverFavorite;
  const countBase = favoriteCountBase ?? expert.isFavorite;
  const favoriteCountDelta = isFavorite === countBase ? 0 : isFavorite ? 1 : -1;
  const displayFavoriteCount = favoriteCount + favoriteCountDelta;
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successRoomId, setSuccessRoomId] = useState<string | null>(null);
  const [isRestrictionOpen, setIsRestrictionOpen] = useState(false);

  // 본인 페이지는 받은 찜 수만 표시(토글 불가), 그 외는 찜 버튼.
  const showReport = viewer === 'client';
  const canInteract = canInteractWithExpert(viewer);

  // 첫 조회 결과로 카운트 기준을 한 번만 고정(이후 토글 증감이 정확히 반영되도록).
  useEffect(() => {
    if (queryFavorite !== null && favoriteCountBase === null) {
      setFavoriteCountBase(queryFavorite);
    }
  }, [queryFavorite, favoriteCountBase]);

  const openRestrictedAction = () => {
    setIsRestrictionOpen(true);
  };

  const handleFavoriteClick = () => {
    if (!canInteract) {
      openRestrictedAction();
      return;
    }

    const nextFavorite = !isFavorite;
    setOptimisticFavorite(nextFavorite);

    void (async () => {
      try {
        await (nextFavorite
          ? addFavoriteExpert(expert.id)
          : removeFavoriteExpert(expert.id));
        // 찜목록 캐시 갱신 후 낙관값 해제 → 서버 기준으로 동기화.
        await queryClient.invalidateQueries({
          queryKey: [...FAVORITES_KEY, 'experts'],
        });
      } catch {
        // 실패 시에도 낙관값 해제 → 서버 기준 복귀
      } finally {
        setOptimisticFavorite(null);
      }
    })();
  };

  const handleReportClick = () => {
    if (!canInteract) {
      openRestrictedAction();
      return;
    }

    setIsReportOpen(true);
  };

  const handleInquiryClick = () => {
    if (!canInteract) {
      openRestrictedAction();
      return;
    }

    setIsInquiryOpen(true);
  };

  const inquiryServices = data.services.map((service) => ({
    id: service.id,
    title: service.title,
  }));

  return (
    <>
      <div className={heroStyles.heroRow}>
        <div className={heroStyles.profileGroup}>
          <div className={heroStyles.avatar}>
            {expert.profileImageUrl ? (
              <Image
                src={expert.profileImageUrl}
                alt={`${expert.companyName} 프로필`}
                width={72}
                height={72}
                className={heroStyles.avatarImage}
              />
            ) : (
              <Image
                src={expertImageFallback}
                alt={`${expert.companyName} 프로필`}
                width={72}
                height={72}
                className={heroStyles.avatarImage}
              />
            )}
          </div>

          <div className={heroStyles.profileContent}>
            <div className={heroStyles.titleRow}>
              <h1 className={heroStyles.companyName}>{expert.companyName}</h1>
              <div className={heroStyles.titleActions}>
                  {viewer === 'owner' ? (
                    <span className={heroStyles.favoriteButton}>
                      <Heart size={20} strokeWidth={2.5} fill="none" />
                      <span className={heroStyles.favoriteCount}>
                        {Math.max(0, displayFavoriteCount).toLocaleString()}
                      </span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      className={clsx(
                        heroStyles.favoriteButton,
                        isFavorite && heroStyles.favoriteButtonActive,
                      )}
                      aria-pressed={isFavorite}
                      aria-label="찜하기"
                      onClick={handleFavoriteClick}
                    >
                      <Heart
                        size={20}
                        strokeWidth={2.5}
                        fill={isFavorite ? 'currentColor' : 'none'}
                      />
                      <span className={heroStyles.favoriteCount}>
                        {Math.max(0, displayFavoriteCount).toLocaleString()}
                      </span>
                    </button>
                  )}
                  {showReport ? (
                    <button
                      type="button"
                      className={heroStyles.reportButton}
                      onClick={handleReportClick}
                    >
                      신고
                    </button>
                  ) : null}
              </div>
            </div>

            {expert.ceoName ? (
              <p className={heroStyles.ceoName}>대표자 : {expert.ceoName}</p>
            ) : null}

            <p className={heroStyles.description}>{expert.description}</p>

            <div className={heroStyles.tagList}>
              {expert.techStacks.slice(0, 6).map((stack) => (
                <RectLabel
                  key={stack}
                  text={getTechStackLabel(stack)}
                  color="blue50"
                />
              ))}
            </div>
          </div>
        </div>

        <div className={heroStyles.actionColumn}>
          {viewer === 'owner' ? (
            <Link href="/mypage" className={heroStyles.primaryButton}>
              프로필편집
            </Link>
          ) : null}

          {viewer === 'client' ? (
            <button
              type="button"
              className={heroStyles.primaryButton}
              onClick={handleInquiryClick}
            >
              상담 견적 문의
            </button>
          ) : null}

          {viewer === 'guest' ? (
            <Link href="/signup" className={heroStyles.primaryButton}>
              회원가입
            </Link>
          ) : null}
        </div>
      </div>

      <StatBlock stats={displayStats} />
      <InfoBar info={businessInfo} />

      <ExpertReportModal
        isOpen={isReportOpen}
        reportedUserId={expert.id}
        onClose={() => {
          setIsReportOpen(false);
        }}
      />

      <ExpertInquiryModal
        isOpen={isInquiryOpen}
        expertUserId={expert.id}
        onClose={() => {
          setIsInquiryOpen(false);
        }}
        expertContext={portfolioExpertContext}
        services={inquiryServices}
        onSubmitSuccess={(roomId) => {
          setSuccessRoomId(roomId);
          setIsSuccessOpen(true);
        }}
      />

      <ConsultationSuccessModal
        isOpen={isSuccessOpen}
        roomId={successRoomId}
        onClose={() => {
          setIsSuccessOpen(false);
        }}
      />

      <ExpertRestrictionModal
        isOpen={isRestrictionOpen}
        onClose={() => {
          setIsRestrictionOpen(false);
        }}
      />
    </>
  );
}
