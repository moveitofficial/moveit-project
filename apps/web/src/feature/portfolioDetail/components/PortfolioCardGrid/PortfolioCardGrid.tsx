'use client';

import Image from 'next/image';
import { useState } from 'react';

import { getPortfolioDetail } from '../../api';
import { PortfolioDetailModal } from '../PortfolioDetailModal';

import * as styles from './PortfolioCardGrid.css';

import type { PortfolioModalExpertContext } from '../../types';
import type { PortfolioDetail, PortfolioListItem } from '@/mocks/types';

interface Props {
  portfolios: PortfolioListItem[];
  expert: PortfolioModalExpertContext;
  expertUserId?: string;
  serviceId?: string;
}

export default function PortfolioCardGrid({
  portfolios,
  expert,
  expertUserId,
  serviceId,
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

  return (
    <>
      <div className={styles.grid}>
        {portfolios.map((portfolio) => (
          <button
            key={portfolio.id}
            type="button"
            className={styles.cardButton}
            onClick={() => {
              handleCardClick(portfolio.id);
            }}
          >
            <span className={styles.card}>
              <span className={styles.thumbnailWrapper}>
                <Image
                  src={portfolio.thumbnailUrl}
                  alt={portfolio.title}
                  width={163}
                  height={163}
                  className={styles.thumbnail}
                />
              </span>
              <span className={styles.cardTitle}>{portfolio.title}</span>
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
