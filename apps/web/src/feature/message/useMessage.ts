'use client';

import {
  skipToken,
  useInfiniteQuery,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import {
  createReport,
  createTradeRequest,
  getMessageRooms,
  getMessages,
  getOrderPayment,
  getRoomOtherServices,
  getRoomService,
  requestScheduleChange,
  updateOrderSchedule,
  uploadReportImages,
  uploadRoomFile,
} from './api';

import type { ReportReason, UpdateScheduleParams } from './api';

export const MESSAGE_ROOMS_KEY = ['messageRooms'];

// 채팅방 목록. 10초 폴링 + 10초 캐시. 선택한 방이 뒤쪽 페이지에 있을 수 있어
// 페이지 단위 무한쿼리로 받고(MessageView에서 찾을 때까지 로드), hasNext로 다음 페이지 판단.
export function useMessageRooms(search: string) {
  return useInfiniteQuery({
    queryKey: [...MESSAGE_ROOMS_KEY, search],
    queryFn: ({ pageParam }) => getMessageRooms(search, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined,
    refetchOnMount: 'always',
    refetchInterval: 10_000,
    staleTime: 10_000,
  });
}

// 방 입장 시 메시지 내역. 커서 기반 무한 쿼리(위로 스크롤 시 이전 메시지 로드).
// pages[0] = 최신 30개, 그다음 페이지일수록 과거.
export function useMessageHistory(roomId: string | null) {
  return useInfiniteQuery({
    queryKey: ['messageHistory', roomId],
    queryFn: roomId
      ? ({ pageParam }) => getMessages(roomId, pageParam)
      : skipToken,
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    refetchOnMount: 'always',
  });
}

// 방의 고정 서비스(문의 서비스) — 서비스 엔드포인트에서 직접.
export function useRoomService(serviceId: string | null) {
  return useQuery({
    queryKey: ['roomService', serviceId],
    queryFn: serviceId ? () => getRoomService(serviceId) : skipToken,
  });
}

// 주문 결제 상세(거래상세 모달). 미결제(PENDING) 주문은 404라 재시도 안 함.
export function useOrderPayment(orderId: string | null) {
  return useQuery({
    queryKey: ['orderPayment', orderId],
    queryFn: orderId ? () => getOrderPayment(orderId) : skipToken,
    retry: false,
  });
}

// 오른쪽 패널: 전문가의 다른 서비스.
export function useRoomOtherServices(serviceId: string | null) {
  return useQuery({
    queryKey: ['roomOtherServices', serviceId],
    queryFn: serviceId ? () => getRoomOtherServices(serviceId) : skipToken,
  });
}

// 거래(결제) 요청 뮤테이션 — 판매자.
export function useCreateTradeRequest(roomId: string) {
  return useMutation({
    mutationFn: (agreedServicePrice: number) =>
      createTradeRequest(roomId, agreedServicePrice),
  });
}

// 일정 등록/변경 뮤테이션.
export function useUpdateSchedule(orderId: string) {
  return useMutation({
    mutationFn: (params: UpdateScheduleParams) =>
      updateOrderSchedule(orderId, params),
  });
}

// 일정 변경 요청 뮤테이션 — 판매자.
export function useRequestScheduleChange(orderId: string) {
  return useMutation({
    mutationFn: (roomId: string) => requestScheduleChange(orderId, roomId),
  });
}

// 파일 업로드 뮤테이션. 생성된 FILE 메시지는 소켓으로 도착한다.
export function useUploadRoomFile(roomId: string) {
  return useMutation({
    mutationFn: (file: File) => uploadRoomFile(roomId, file),
  });
}

// 신고 제출: 증거 이미지 있으면 업로드 후 신고 생성.
export function useSubmitReport() {
  return useMutation({
    mutationFn: async (params: {
      reportedUserId: string;
      reason: ReportReason;
      detail: string;
      files: File[];
    }) => {
      let reportId: string | undefined;
      let imageUrls: string[] | undefined;
      if (params.files.length > 0) {
        const uploaded = await uploadReportImages(params.files);
        reportId = uploaded.reportId;
        imageUrls = uploaded.imageUrls;
      }
      await createReport({
        reportId,
        reportedUserId: params.reportedUserId,
        reason: params.reason,
        detail: params.detail,
        imageUrls,
      });
    },
  });
}

export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delay);
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debounced;
}
