import { HttpStatus } from '@nestjs/common';

export const AUTH_ERRORS = {
  DUPLICATE_EMAIL: {
    status: HttpStatus.CONFLICT,
    message: '이미 가입된 이메일입니다.',
    code: 'AUTH_DUPLICATE_EMAIL',
  },
  INVALID_CREDENTIALS: {
    status: HttpStatus.UNAUTHORIZED,
    message: '이메일 또는 비밀번호가 올바르지 않습니다.',
    code: 'AUTH_INVALID_CREDENTIALS',
  },
  BLOCKED: {
    status: HttpStatus.FORBIDDEN,
    message: '차단된 계정입니다.',
    code: 'AUTH_BLOCKED',
  },
  TOKEN_EXPIRED: {
    status: HttpStatus.UNAUTHORIZED,
    message: '토큰이 만료되었습니다.',
    code: 'AUTH_TOKEN_EXPIRED',
  },
  REFRESH_TOKEN_INVALID: {
    status: HttpStatus.UNAUTHORIZED,
    message: '유효하지 않은 리프레시 토큰입니다.',
    code: 'AUTH_REFRESH_TOKEN_INVALID',
  },
  INTERNAL_SERVER_ERROR: {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: '서버 오류가 발생했습니다.',
    code: 'AUTH_INTERNAL_SERVER_ERROR',
  },
} as const;

export const USER_ERRORS = {
  NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: '유저를 찾을 수 없습니다.',
    code: 'USER_NOT_FOUND',
  },
  ALREADY_EXISTS: {
    status: HttpStatus.CONFLICT,
    message: '이미 존재하는 유저입니다.',
    code: 'USER_ALREADY_EXISTS',
  },
  BLOCKED: {
    status: HttpStatus.FORBIDDEN,
    message: '차단된 계정입니다.',
    code: 'USER_BLOCKED',
  },
  DELETED: {
    status: HttpStatus.UNAUTHORIZED,
    message: '탈퇴한 계정입니다.',
    code: 'USER_DELETED',
  },
  INTERNAL_SERVER_ERROR: {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: '서버 오류가 발생했습니다.',
    code: 'USER_INTERNAL_SERVER_ERROR',
  },
} as const;

export const SERVICE_ERRORS = {
  NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: '서비스를 찾을 수 없습니다.',
    code: 'SERVICE_NOT_FOUND',
  },
  NOT_AVAILABLE: {
    status: HttpStatus.BAD_REQUEST,
    message: '이용할 수 없는 서비스입니다.',
    code: 'SERVICE_NOT_AVAILABLE',
  },
  ALREADY_DELETED: {
    status: HttpStatus.BAD_REQUEST,
    message: '이미 삭제된 서비스입니다.',
    code: 'SERVICE_ALREADY_DELETED',
  },
} as const;

export const ORDER_ERRORS = {
  NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: '주문을 찾을 수 없습니다.',
    code: 'ORDER_NOT_FOUND',
  },
  INVALID_STATUS: {
    status: HttpStatus.BAD_REQUEST,
    message: '유효하지 않은 주문 상태입니다.',
    code: 'ORDER_INVALID_STATUS',
  },
  ALREADY_CANCELED: {
    status: HttpStatus.BAD_REQUEST,
    message: '이미 취소된 주문입니다.',
    code: 'ORDER_ALREADY_CANCELED',
  },
  ALREADY_REFUNDED: {
    status: HttpStatus.BAD_REQUEST,
    message: '이미 환불된 주문입니다.',
    code: 'ORDER_ALREADY_REFUNDED',
  },
} as const;

export const PAYMENT_ERRORS = {
  NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: '결제 정보를 찾을 수 없습니다.',
    code: 'PAYMENT_NOT_FOUND',
  },
  FAILED: {
    status: HttpStatus.BAD_REQUEST,
    message: '결제에 실패했습니다.',
    code: 'PAYMENT_FAILED',
  },
  AMOUNT_MISMATCH: {
    status: HttpStatus.BAD_REQUEST,
    message: '결제 금액이 일치하지 않습니다.',
    code: 'PAYMENT_AMOUNT_MISMATCH',
  },
  ALREADY_CONFIRMED: {
    status: HttpStatus.BAD_REQUEST,
    message: '이미 승인된 결제입니다.',
    code: 'PAYMENT_ALREADY_CONFIRMED',
  },
} as const;

export const REFUND_ERRORS = {
  NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: '환불 정보를 찾을 수 없습니다.',
    code: 'REFUND_NOT_FOUND',
  },
  ALREADY_REQUESTED: {
    status: HttpStatus.BAD_REQUEST,
    message: '이미 환불 요청된 주문입니다.',
    code: 'REFUND_ALREADY_REQUESTED',
  },
  INVALID_STATUS: {
    status: HttpStatus.BAD_REQUEST,
    message: '유효하지 않은 환불 상태입니다.',
    code: 'REFUND_INVALID_STATUS',
  },
} as const;

export const EXPERT_ERRORS = {
  NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: '전문가를 찾을 수 없습니다.',
    code: 'EXPERT_NOT_FOUND',
  },
  NOT_APPROVED: {
    status: HttpStatus.FORBIDDEN,
    message: '승인되지 않은 전문가입니다.',
    code: 'EXPERT_NOT_APPROVED',
  },
  ALREADY_APPROVED: {
    status: HttpStatus.BAD_REQUEST,
    message: '이미 승인된 전문가입니다.',
    code: 'EXPERT_ALREADY_APPROVED',
  },
  REJECTED: {
    status: HttpStatus.FORBIDDEN,
    message: '승인이 거절된 전문가입니다.',
    code: 'EXPERT_REJECTED',
  },
} as const;
