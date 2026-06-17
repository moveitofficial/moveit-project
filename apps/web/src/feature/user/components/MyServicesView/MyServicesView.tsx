'use client';

import starFill from '@public/Card/starFill.svg';
import { Modal } from '@repo/ui/Modal';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import * as styles from './MyServicesView.css';

import type { MyServiceItem } from '@/feature/user/my-services/api';

import { getService } from '@/feature/expertService/api';
import { buildServiceDetailHref } from '@/feature/serviceDetail/utils';
import {
  useDeleteService,
  useMyServicesQuery,
  useUpdateServiceStatus,
} from '@/feature/user/my-services/queries';
import { useMyUserQuery } from '@/feature/user/queries';
import { getTechStackLabel } from '@/mocks/metadata';

// 상황별 모달 문구: 작업중(blocked)이면 안내, 아니면 확인.
const MODAL_COPY = {
  delete: {
    title: '서비스 삭제',
    blocked:
      '현재 서비스에서 작업중인 내용이 있습니다.\n작업완료후 서비스를 삭제 해주세요.',
    confirm:
      '현재 서비스를 삭제 하게되면 서비스에 데이터가 모두 삭제됩니다.\n정말 삭제 하시겠습니까?',
  },
  pause: {
    title: '서비스 판매중지',
    blocked:
      '현재 서비스에서 작업중인 내용이 있습니다.\n작업완료후 판매중지를 해주세요.',
    confirm:
      '현재 서비스를 판매중지 하게되면 메인에서 노출이 되지않습니다.\n정말 판매중지 하시겠습니까?',
  },
} as const;

export default function MyServicesView() {
  const { data: me } = useMyUserQuery();
  const isApprovedExpert =
    me?.role === 'EXPERT' && (me.expertProfile?.isApproved ?? false);

  const { data, isPending } = useMyServicesQuery();
  const updateStatus = useUpdateServiceStatus();
  const deleteService = useDeleteService();
  const [modal, setModal] = useState<{
    action: 'delete' | 'pause';
    serviceId: string;
    blocked: boolean; // 작업중(orderCount>0)이면 진행 불가
  } | null>(null);
  const [openingId, setOpeningId] = useState<string | null>(null);

  // 목록 API엔 group이 없어, 클릭 시 서비스를 조회해 그룹별 상세 경로로 새 탭에서 연다.
  // (조회가 비동기라 팝업 차단 방지로 빈 탭을 먼저 열고 이동)
  const handleOpen = (serviceId: string) => {
    if (openingId !== null) {
      return;
    }
    const tab = globalThis.open('', '_blank');
    if (tab !== null) {
      tab.opener = null;
    }
    setOpeningId(serviceId);
    void (async () => {
      try {
        const detail = await getService(serviceId);
        const href = buildServiceDetailHref(
          serviceId,
          detail.data.categoryRef.group,
        );
        if (tab !== null) {
          tab.location.href = href;
        }
      } catch {
        tab?.close();
      } finally {
        setOpeningId(null);
      }
    })();
  };

  // 삭제(CLOSED) 처리된 서비스는 목록에서 제외.
  const services = (data?.items ?? []).filter(
    (service) => service.status !== 'CLOSED',
  );

  // 작업중(orderCount>0)이면 차단 모달, 아니면 확인 모달.
  const openActionModal = (action: 'delete' | 'pause', service: MyServiceItem) => {
    setModal({ action, serviceId: service.id, blocked: service.orderCount > 0 });
  };

  const handleToggleStatus = (service: MyServiceItem) => {
    if (updateStatus.isPending) {
      return;
    }
    // 판매중 → 중지: 모달 확인. 중지 → 판매중: 바로 재개.
    if (service.status === 'ACTIVE') {
      openActionModal('pause', service);
      return;
    }
    updateStatus.mutate({ serviceId: service.id, status: 'ACTIVE' });
  };

  const handleModalConfirm = () => {
    if (modal === null) {
      return;
    }
    if (modal.blocked) {
      setModal(null); // 작업중이라 진행 불가 — 확인만
      return;
    }
    if (modal.action === 'delete') {
      if (deleteService.isPending) {
        return;
      }
      deleteService.mutate(modal.serviceId, {
        onSuccess: () => {
          setModal(null);
        },
      });
      return;
    }
    if (updateStatus.isPending) {
      return;
    }
    updateStatus.mutate(
      { serviceId: modal.serviceId, status: 'PAUSED' },
      {
        onSuccess: () => {
          setModal(null);
        },
      },
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>서비스관리</h2>
        {isApprovedExpert && services.length > 0 ? (
          <Link href="/create-service" className={styles.registerLink}>
            서비스 등록
          </Link>
        ) : null}
      </div>

      {isApprovedExpert ? isPending ? (
        <div className={styles.emptyBox}>
          <p className={styles.emptyText}>불러오는 중...</p>
        </div>
      ) : services.length === 0 ? (
        <div className={styles.emptyBox}>
          <p className={styles.emptyText}>
            등록된 서비스가 없습니다.
            {'\n'}
            새롭게 등록해주세요
          </p>
          <Link href="/create-service" className={styles.primaryButton}>
            서비스 등록하기
          </Link>
        </div>
      ) : (
        <ul className={styles.grid}>
          {services.map((service) => (
            <li key={service.id}>
              <ServiceCard
                service={service}
                onOpen={() => {
                  handleOpen(service.id);
                }}
                onToggleStatus={() => {
                  handleToggleStatus(service);
                }}
                onDelete={() => {
                  openActionModal('delete', service);
                }}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.emptyBox}>
          <p className={styles.emptyText}>
            판매자 승인되지 않았습니다.
            {'\n'}
            판매자 승인후 서비스를 등록 할 수 있습니다.
          </p>
          <Link href="/mypage" className={styles.primaryButton}>
            판매자 승인 신청하러 가기
          </Link>
        </div>
      )}

      <Modal
        isOpen={modal !== null}
        onClose={() => {
          setModal(null);
        }}
        maxWidth={360}
      >
        {modal === null ? null : (
          <div className={styles.modal}>
            <p className={styles.modalTitle}>{MODAL_COPY[modal.action].title}</p>
            <p className={styles.modalText}>
              {modal.blocked
                ? MODAL_COPY[modal.action].blocked
                : MODAL_COPY[modal.action].confirm}
            </p>
            <button
              type="button"
              className={styles.modalPrimary}
              onClick={handleModalConfirm}
              disabled={deleteService.isPending || updateStatus.isPending}
            >
              예
            </button>
            {modal.blocked ? null : (
              <button
                type="button"
                className={styles.modalSecondary}
                onClick={() => {
                  setModal(null);
                }}
              >
                아니오
              </button>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

interface ServiceCardProps {
  service: MyServiceItem;
  onOpen: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
}

function ServiceCard({
  service,
  onOpen,
  onToggleStatus,
  onDelete,
}: ServiceCardProps) {
  const isActive = service.status === 'ACTIVE';

  return (
    <div className={styles.card}>
      {/* 본문 클릭 → 서비스 상세로 이동 */}
      <button type="button" className={styles.cardBody} onClick={onOpen}>
        <span className={styles.thumb}>
          {service.thumbnailUrl === '' ? null : (
            <Image
              src={service.thumbnailUrl}
              alt={service.title}
              width={276}
              height={180}
              unoptimized
              className={styles.thumbImage}
            />
          )}
        </span>

        <span className={styles.chips}>
          {service.techStacks.slice(0, 3).map((stack) => (
            <span key={stack} className={styles.chip}>
              {getTechStackLabel(stack)}
            </span>
          ))}
        </span>

        <span className={styles.cardTitle}>{service.title}</span>

        <span className={styles.ratingRow}>
          <Image
            src={starFill}
            alt=""
            width={14}
            height={14}
            className={styles.starIcon}
          />
          <span className={styles.ratingText}>
            {service.rating.toFixed(1)}({service.reviewCount.toLocaleString()})
          </span>
        </span>

        <span className={styles.price}>
          {service.servicePrice.toLocaleString()}원
        </span>
      </button>

      <div className={styles.cardFooter}>
        <span className={isActive ? styles.statusActive : styles.statusPaused}>
          {isActive ? '판매중' : '판매중지'}
        </span>
        <div className={styles.actions}>
          <Link
            href={`/create-service?id=${service.id}`}
            target="_blank"
            rel="noreferrer"
            className={styles.actionBtn}
          >
            편집하기
          </Link>
          <button
            type="button"
            className={styles.actionBtn}
            onClick={onToggleStatus}
          >
            {isActive ? '판매중지' : '판매중'}
          </button>
          <button
            type="button"
            className={styles.actionDelete}
            onClick={onDelete}
          >
            삭제하기
          </button>
        </div>
      </div>
    </div>
  );
}
