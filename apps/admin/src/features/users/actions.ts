'use server';

import { api } from '@repo/fetcher';
import { revalidatePath } from 'next/cache';

function revalidate(userId: string) {
  revalidatePath(`/users/${userId}`);
}

export async function blockUser(userId: string): Promise<void> {
  await api.post(`/admin/users/${userId}/blacklist`, {});
  revalidate(userId);
}

export async function unblockUser(userId: string): Promise<void> {
  await api.delete(`/admin/users/${userId}/blacklist`);
  revalidate(userId);
}

export async function approveExpert(userId: string): Promise<void> {
  await api.post(`/admin/users/${userId}/expert/approve`, {});
  revalidate(userId);
}

export async function rejectExpert(
  userId: string,
  rejectReason: string,
): Promise<void> {
  await api.post(`/admin/users/${userId}/expert/reject`, { rejectReason });
  revalidate(userId);
}

export async function completeOrderSettlement(orderId: string): Promise<void> {
  await api.patch(`/admin/orders/${orderId}/settlement`, {});
}

// TODO: 취소/환불 승인 — API 주소 확인 후 구현
// export async function approveCancelRequest(orderId: string, reason: string): Promise<void> {
//   await api.post(`/admin/orders/${orderId}/???`, { reason });
// }
//
// export async function approveRefundRequest(orderId: string, reason: string): Promise<void> {
//   await api.post(`/admin/orders/${orderId}/???`, { reason });
// }

export async function deleteCommunityPost(
  userId: string,
  postId: string,
  deleteReason: string,
): Promise<void> {
  await api.delete(`/admin/community/posts/${postId}`, { deleteReason });
  revalidate(userId);
}

export async function deleteCommunityComment(
  userId: string,
  commentId: string,
  deleteReason: string,
): Promise<void> {
  await api.delete(`/admin/community/comments/${commentId}`, { deleteReason });
  revalidate(userId);
}
