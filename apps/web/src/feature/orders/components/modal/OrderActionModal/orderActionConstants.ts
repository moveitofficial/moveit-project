export interface ConfirmCopy {
  title: string;
  description: string;
}

// TODO: 피그마에 없는 안내문구 수정 필요
export const CONFIRM_COPY = {
  requestCancel: {
    title: '주문취소',
    description:
      '주문을 취소하시겠습니까?\n주문 취소 시 진행 중인 거래가 중단되며, 해당 요청은 되돌릴 수 없습니다.\n취소 후에는 동일한 서비스에 대해 다시 주문하셔야 합니다',
  },
  confirmPurchase: {
    title: '구매확정',
    description:
      '구매를 확정하시겠습니까?\n구매 확정 시 거래가 완료되며, 이후에는 환불이 불가능합니다.\n진행된 작업 내용을 다시 한 번 확인해 주세요.',
  },
  confirmPurchaseCompleted: {
    title: '구매확정 완료',
    description:
      '리뷰를 작성해 주세요.\n여러분의 경험은 다른 이용자들에게 큰 도움이 됩니다.\n판매자가 더 나은 서비스를 제공할 수 있도록 솔직한 후기를 남겨주세요.',
  },
  requestRefund: {
    title: '환불요청',
    description:
      '환불 요청하시겠습니까?\n환불 요청시 진행 중인 거래가 중단되며, 해당 요청은 되돌릴 수 없습니다.\n환불 후에는 동일한 서비스에 대해 다시 주문하셔야 합니다',
  },
  refundRequestCompleted: {
    title: '환불 요청 완료',
    description:
      '환불 요청이 완료되었습니다.\n전문가가 환불을 승인하면 전액 환불됩니다.\n카드사에 따라 영업일 기준 최대 7일이 소요될 수 있습니다.',
  },
  refundRequestCancelled: {
    title: '환불 요청 취소',
    description:
      '환불 요청이 취소되었습니다.\n요청하신 환불은 정상적으로 취소되었으며, 거래는 이전 상태로 유지됩니다.\n필요하신 경우 언제든지 다시 환불 요청을 진행하실 수 있습니다.',
  },
  requestSettlement: {
    title: '정산요청',
    description: '정산을 요청하시겠습니까?',
  },
  requestScheduleChange: {
    title: '일정변경 요청',
    description:
      '일정 변경을 요청하시겠습니까?\n구매자에게 일정 변경 요청 메시지가 전송됩니다.',
  },
  requestPurchaseConfirm: {
    title: '구매확정 요청',
    description:
      '구매확정을 요청하시겠습니까?\n구매자에게 구매확정 요청 메시지가 전송됩니다.',
  },
  completeWork: {
    title: '작업완료',
    description: '작업을 완료하셨습니까?',
  },
  approveRefund: {
    title: '환불 승인',
    description:
      '환불을 승인하시겠습니까?\n기한이 만료되어 해당 거래는 전액 환불 처리됩니다.',
  },
  rejectRefund: {
    title: '환불 거절',
    description: '환불 요청을 거절하시겠습니까?',
  },
  approveCancel: {
    title: '취소 승인',
    description: '주문 취소를 승인하시겠습니까?',
  },
  rejectCancel: {
    title: '취소 거절',
    description: '주문 취소를 거절하시겠습니까?',
  },
  cancelRefund: {
    title: '환불취소',
    description: '환불 요청을 취소하시겠습니까?',
  },
  deleteReview: {
    title: '리뷰삭제',
    description:
      '리뷰를 삭제하시겠습니까?\n삭제된 리뷰는 복구할 수 없으며, 작성하신 내용과 평점이 모두 제거됩니다.',
  },
} as const satisfies Record<string, ConfirmCopy>;
