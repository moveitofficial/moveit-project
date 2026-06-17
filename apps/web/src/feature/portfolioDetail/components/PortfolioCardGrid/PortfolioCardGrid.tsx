'use client';

import Image from 'next/image';
import { useState } from 'react';

import { getPortfolioDetail } from '../../api';
import { PortfolioDetailModal } from '../PortfolioDetailModal';

import * as styles from './PortfolioCardGrid.css';

import type { PortfolioModalExpertContext } from '../../types';
import type { PortfolioDetail, PortfolioListItem } from '@/mocks/types';

const THUMB_SIZE = {
  default: 163,
  large: 276,
} as const;

type PortfolioCardGridSize = keyof typeof THUMB_SIZE;

interface Props {
  portfolios: PortfolioListItem[];
  expert: PortfolioModalExpertContext;
  expertUserId?: string;
  serviceId?: string;
  size?: PortfolioCardGridSize;
}

export default function PortfolioCardGrid({
  portfolios,
  expert,
  expertUserId,
  serviceId,
  size = 'default',
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [portfolioDetail, setPortfolioDetail] = useState<PortfolioDetail | null>(
    null,
  );

  const handleCardClick = (portfolioId: string) => {
    setIsModalOpen(true);
    setIsLoading(true);
    setPortfolioDetail(null);

    void getPortfolioDetail(portfolioId)
      .then((detail) => {
        setIsLoading(false);

        if (detail === null) {
          setIsModalOpen(false);
          return;
        }

        setPortfolioDetail(detail);
      })
      .catch(() => {
        setIsLoading(false);
        setIsModalOpen(false);
      });
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setPortfolioDetail(null);
    setIsLoading(false);
  };

  if (portfolios.length === 0) {
    return null;
  }

  const isLarge = size === 'large';
  const thumbPx = THUMB_SIZE[size];

  return (
    <>
      <div className={isLarge ? styles.gridLarge : styles.grid}>
        {portfolios.map((portfolio) => (
          <button
            key={portfolio.id}
            type="button"
            className={styles.cardButton}
            onClick={() => {
              handleCardClick(portfolio.id);
            }}
          >
            <span className={isLarge ? styles.cardLarge : styles.card}>
              <span
                className={
                  isLarge ? styles.thumbnailWrapperLarge : styles.thumbnailWrapper
                }
              >
                <Image
                  src={portfolio.thumbnailUrl}
                  alt={portfolio.title}
                  width={thumbPx}
                  height={thumbPx}
                  className={isLarge ? styles.thumbnailLarge : styles.thumbnail}
                />
              </span>
              <span className={isLarge ? styles.cardTitleLarge : styles.cardTitle}>
                {portfolio.title}
              </span>
            </span>
          </button>
        ))}
      </div>

      <PortfolioDetailModal
        isOpen={isModalOpen}
        onClose={handleClose}
        portfolio={portfolioDetail}
        expert={expert}
        expertUserId={expertUserId}
        serviceId={serviceId}
        isLoading={isLoading}
      />
    </>
  );
}
