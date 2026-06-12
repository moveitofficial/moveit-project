'use client';

import { Modal } from '@repo/ui/Modal';
import { Heart, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { PORTFOLIO_MODAL_MAX_WIDTH } from '../../constants';
import {
  getBusinessSectorLabel,
  getExpertInitials,
  getStackTypeLabel,
} from '../../utils';

import * as styles from './PortfolioDetailModal.css';

import type { PortfolioModalExpertContext } from '../../types';
import type { ConsultationInquiryContext } from '@/feature/consultation/types';
import type { PortfolioDetail, PortfolioSkill, StackType } from '@/mocks/types';

import { ConsultationInquiryModal } from '@/feature/consultation/components/ConsultationInquiryModal';
import { getTechStackLabel } from '@/mocks/metadata';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  portfolio: PortfolioDetail | null;
  expert: PortfolioModalExpertContext;
  expertUserId?: string;
  serviceId?: string;
  isLoading: boolean;
}

const STACK_TYPE_ORDER: StackType[] = ['DESIGN', 'FRONTEND', 'BACKEND'];

function groupSkillsByType(
  skills: PortfolioSkill[],
): Partial<Record<StackType, PortfolioSkill[]>> {
  const grouped: Partial<Record<StackType, PortfolioSkill[]>> = {};

  for (const skill of skills) {
    const current = grouped[skill.stackType] ?? [];
    grouped[skill.stackType] = [...current, skill];
  }

  return grouped;
}

function sortImages(portfolio: PortfolioDetail) {
  const mainImage = portfolio.images.find((image) => image.isMain);
  const otherImages = portfolio.images.filter((image) => !image.isMain);

  if (mainImage === undefined) {
    return portfolio.images;
  }

  return [mainImage, ...otherImages];
}

export default function PortfolioDetailModal({
  isOpen,
  onClose,
  portfolio,
  expert,
  expertUserId,
  serviceId,
  isLoading,
}: Props) {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  const skillsByType =
    portfolio === null ? {} : groupSkillsByType(portfolio.skills);
  const sortedImages = portfolio === null ? [] : sortImages(portfolio);

  const consultationContext: ConsultationInquiryContext | null =
    expertUserId !== undefined && serviceId !== undefined
      ? {
          expertUserId,
          serviceId,
          companyName: expert.companyName,
          contactTime: expert.contactTime,
        }
      : null;

  return (
    <>
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth={PORTFOLIO_MODAL_MAX_WIDTH}
      className={styles.modalPanel}
    >
      <header className={styles.header}>
        <div className={styles.expertBanner}>
          <div className={styles.expertAvatar}>
            {getExpertInitials(expert.companyName)}
          </div>
          <div className={styles.expertInfo}>
            <p className={styles.expertName}>{expert.companyName}</p>
            <p className={styles.expertHours}>
              연락 가능시간 : 평일 {expert.contactTime.start} ~{' '}
              {expert.contactTime.end}
            </p>
          </div>
        </div>

        <div className={styles.headerActions}>
          {consultationContext === null ? null : (
            <button
              type="button"
              className={styles.consultButton}
              onClick={() => {
                setIsConsultationOpen(true);
              }}
            >
              상담 견적 문의
            </button>
          )}
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="닫기"
          >
            <X size={24} />
          </button>
        </div>
      </header>

      {isLoading ? (
        <p className={styles.loadingState}>포트폴리오를 불러오는 중입니다.</p>
      ) : portfolio === null ? null : (
        <div className={styles.body}>
          <div className={styles.titleRow}>
            <h2 className={styles.title}>{portfolio.title}</h2>
            <button
              type="button"
              className={styles.favoriteButton}
              aria-label="찜하기"
            >
              <Heart size={20} strokeWidth={2.5} />
              <span className={styles.favoriteCount}>0</span>
            </button>
          </div>

          <div className={styles.contentRow}>
            <div className={styles.leftPanel}>
              <p className={styles.description}>{portfolio.description}</p>

              <div className={styles.metaSection}>
                <h3 className={styles.metaSectionTitle}>업종</h3>
                <div className={styles.tagList}>
                  <span className={styles.tagChip}>
                    {getBusinessSectorLabel(portfolio.businessSector)}
                  </span>
                </div>
              </div>

              {STACK_TYPE_ORDER.map((stackType) => {
                const skills = skillsByType[stackType];
                if (skills === undefined || skills.length === 0) {
                  return null;
                }

                return (
                  <div key={stackType} className={styles.metaSection}>
                    <h3 className={styles.metaSectionTitle}>
                      {getStackTypeLabel(stackType)}
                    </h3>
                    <div className={styles.tagList}>
                      {skills.map((skill) => (
                        <span key={skill.stackName} className={styles.tagChip}>
                          {getTechStackLabel(skill.stackName)}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}

              <div className={styles.metaSection}>
                <h3 className={styles.metaSectionTitle}>고객사</h3>
                <div className={styles.tagList}>
                  <span className={styles.tagChip}>{portfolio.clientName}</span>
                </div>
              </div>
            </div>

            <div className={styles.rightPanel}>
              <div className={styles.imageStack}>
                {sortedImages.map((image) => (
                  <Image
                    key={image.id}
                    src={image.url}
                    alt=""
                    width={720}
                    height={540}
                    className={styles.portfolioImage}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>

    {consultationContext === null ? null : (
      <ConsultationInquiryModal
        isOpen={isConsultationOpen}
        onClose={() => {
          setIsConsultationOpen(false);
        }}
        context={consultationContext}
      />
    )}
    </>
  );
}
