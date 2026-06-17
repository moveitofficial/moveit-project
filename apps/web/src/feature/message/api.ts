import { api, ApiError } from '@repo/fetcher';

import type {
  ChatMessage,
  MessageHistory,
  MessageRoom,
  RoomServiceSummary,
} from './types';
import type {
  ApiSuccess,
  PaginatedResult,
  ServiceGroupName,
} from '@/mocks/types';

const BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
).replace(/\/$/, '');

// @repo/fetcher는 JSON 전용이라 멀티파트는 직접 fetch로 보낸다.
async function authMultipartPost<T>(
  path: string,
  formData: FormData,
): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });
  if (!response.ok) {
    const error = (await response.json().catch(() => ({}))) as {
      message?: string;
    };
    throw new ApiError(
      response.status,
      error.message ?? '파일 업로드 중 오류가 발생했습니다.',
    );
  }
  const json = (await response.json()) as ApiSuccess<T>;
  return json.data;
}

// 채팅방에 파일 업로드 → 백엔드가 FILE 메시지 생성 + 소켓 발송. 반환 메시지도 동일.
export async function uploadRoomFile(
  roomId: string,
  file: File,
): Promise<ChatMessage> {
  const formData = new FormData();
  formData.append('file', file);
  return authMultipartPost<ChatMessage>(
    `/chat/rooms/${roomId}/upload`,
    formData,
  );
}

export type ReportReason =
  | 'FALSE_INFORMATION'
  | 'ABUSE'
  | 'ILLEGAL_ACTIVITY'
  | 'EXTERNAL_CONTACT'
  | 'SPAM'
  | 'OTHER';

// 신고 증거 이미지 업로드 → reportId + 이미지 URL 목록.
export async function uploadReportImages(
  files: File[],
): Promise<{ reportId: string; imageUrls: string[] }> {
  const formData = new FormData();
  for (const file of files) {
    formData.append('reportImages', file);
  }
  const data = await authMultipartPost<{
    reportId: string;
    images: { url: string }[];
  }>('/reports/upload', formData);
  return { reportId: data.reportId, imageUrls: data.images.map((i) => i.url) };
}

export interface CreateReportParams {
  reportId?: string;
  reportedUserId: string;
  reason: ReportReason;
  detail: string;
  imageUrls?: string[];
}

// 신고 생성.
export async function createReport(params: CreateReportParams): Promise<void> {
  await api.post<ApiSuccess<unknown>>('/reports', params);
}

interface OtherServiceApi {
  id: string;
  title: string;
  servicePrice: number;
  thumbnailUrl: string;
  categoryRef: { group: ServiceGroupName };
}

interface ServiceDetailLite {
  id: string;
  title: string;
  servicePrice: number;
  images: { imgUrl: string; isMain: boolean }[];
  categoryRef: { group: ServiceGroupName };
}

// 내 채팅방 목록 (페이지네이션). search는 상대 닉네임/회사명 검색.
export async function getMessageRooms(
  search?: string,
  page = 1,
): Promise<PaginatedResult<MessageRoom>> {
  const query = new URLSearchParams({ page: String(page) });
  const trimmed = search?.trim() ?? '';
  if (trimmed.length > 0) {
    query.set('search', trimmed);
  }

  const response = await api.get<ApiSuccess<PaginatedResult<MessageRoom>>>(
    `/chat/rooms?${query.toString()}`,
  );
  return response.data;
}

// 채팅방 메시지 내역 (커서 페이지네이션).
export async function getMessages(
  roomId: string,
  cursor?: string,
): Promise<MessageHistory> {
  const query = cursor ? `?cursor=${cursor}` : '';
  const response = await api.get<ApiSuccess<MessageHistory>>(
    `/chat/rooms/${roomId}/messages${query}`,
  );
  return response.data;
}

export interface OrderPaymentCard {
  number: string;
  cardType: string;
  issuerCode: string;
  approveNo: string;
}

// GET /users/me/orders/:id/payment 응답(결제 정보). 금액 일부는 환불 시 null.
export interface OrderPaymentDetail {
  method: string;
  installmentMonths: number;
  approvedAt: string;
  card: OrderPaymentCard | null;
}

// 주문 결제 상세(결제 일시·수단·방식).
export async function getOrderPayment(
  orderId: string,
): Promise<OrderPaymentDetail> {
  const response = await api.get<ApiSuccess<OrderPaymentDetail>>(
    `/users/me/orders/${orderId}/payment`,
  );
  return response.data;
}

// 방의 고정 서비스(문의 서비스). 썸네일은 서비스 엔드포인트에서 직접 가져온다.
export async function getRoomService(
  serviceId: string,
): Promise<RoomServiceSummary> {
  const response = await api.get<ApiSuccess<ServiceDetailLite>>(
    `/services/${serviceId}`,
  );
  const data = response.data;
  const mainImage =
    data.images.find((image) => image.isMain) ?? data.images[0] ?? null;

  return {
    id: data.id,
    title: data.title,
    servicePrice: data.servicePrice,
    thumbnailUrl: mainImage?.imgUrl ?? '',
    group: data.categoryRef.group,
  };
}

// 이 전문가의 다른 서비스 (오른쪽 패널 "전문가 서비스").
export async function getRoomOtherServices(
  serviceId: string,
): Promise<RoomServiceSummary[]> {
  const response = await api.get<ApiSuccess<OtherServiceApi[]>>(
    `/services/${serviceId}/others`,
  );
  return response.data.map((item) => ({
    id: item.id,
    title: item.title,
    servicePrice: item.servicePrice,
    thumbnailUrl: item.thumbnailUrl,
    group: item.categoryRef.group,
  }));
}

// 거래(결제) 요청 — 판매자만. PENDING 주문 + TRADE_REQUEST 시스템 메시지 생성.
export async function createTradeRequest(
  roomId: string,
  agreedServicePrice: number,
): Promise<void> {
  await api.post<ApiSuccess<unknown>>(`/chat/rooms/${roomId}/trade-request`, {
    agreedServicePrice,
  });
}

export interface UpdateScheduleParams {
  endDate: string;
  roomId?: string;
}

// 일정 등록/변경 — 마감일(endDate) 설정. roomId를 주면 시스템 메시지 발송.
export async function updateOrderSchedule(
  orderId: string,
  params: UpdateScheduleParams,
): Promise<void> {
  await api.patch<ApiSuccess<unknown>>(`/orders/${orderId}/schedule`, params);
}

// 일정 변경 요청 — 판매자만. SCHEDULE_CHANGE_REQUEST 시스템 메시지 생성.
export async function requestScheduleChange(
  orderId: string,
  roomId: string,
): Promise<void> {
  await api.post<ApiSuccess<unknown>>(
    `/orders/${orderId}/schedule-change-request`,
    { roomId },
  );
}
