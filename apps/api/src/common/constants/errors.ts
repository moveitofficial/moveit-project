import { HttpStatus } from '@nestjs/common';

export const COMMON_ERRORS = {
  INTERNAL_SERVER_ERROR: {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: '서버 오류가 발생했습니다.',
    code: 'INTERNAL_SERVER_ERROR',
  },
  UNAUTHORIZED: {
    status: HttpStatus.UNAUTHORIZED,
    message: '인증이 필요합니다.',
    code: 'UNAUTHORIZED',
  },
  FORBIDDEN: {
    status: HttpStatus.FORBIDDEN,
    message: '접근 권한이 없습니다.',
    code: 'FORBIDDEN',
  },
  VALIDATION_ERROR: {
    status: HttpStatus.BAD_REQUEST,
    message: '입력값이 올바르지 않습니다.',
    code: 'VALIDATION_ERROR',
  },
} as const;

export const AUTH_ERRORS = {
  DUPLICATE_EMAIL: {
    status: HttpStatus.CONFLICT,
    message: '이미 가입된 이메일입니다.',
  },
  INVALID_CREDENTIALS: {
    status: HttpStatus.UNAUTHORIZED,
    message: '이메일 또는 비밀번호가 올바르지 않습니다.',
  },
  BLOCKED: {
    status: HttpStatus.FORBIDDEN,
    message: '차단된 계정입니다.',
  },
  TOKEN_EXPIRED: {
    status: HttpStatus.UNAUTHORIZED,
    message: '토큰이 만료되었습니다.',
  },
  ACCESS_TOKEN_INVALID: {
    status: HttpStatus.UNAUTHORIZED,
    message: '유효하지 않은 액세스 토큰입니다.',
  },
  REFRESH_TOKEN_INVALID: {
    status: HttpStatus.UNAUTHORIZED,
    message: '유효하지 않은 리프레시 토큰입니다.',
  },
} as const;

export const USER_ERRORS = {
  NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: '유저를 찾을 수 없습니다.',
  },
  ALREADY_EXISTS: {
    status: HttpStatus.CONFLICT,
    message: '이미 존재하는 유저입니다.',
  },
  BLOCKED: {
    status: HttpStatus.FORBIDDEN,
    message: '차단된 계정입니다.',
  },
  DELETED: {
    status: HttpStatus.UNAUTHORIZED,
    message: '탈퇴한 계정입니다.',
  },
  INVALID_PASSWORD: {
    status: HttpStatus.BAD_REQUEST,
    message: '현재 비밀번호가 올바르지 않습니다.',
  },
  PASSWORD_MISMATCH: {
    status: HttpStatus.BAD_REQUEST,
    message: '새 비밀번호가 일치하지 않습니다.',
  },
} as const;

export const SERVICE_ERRORS = {
  NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: '서비스를 찾을 수 없습니다.',
  },
  NOT_AVAILABLE: {
    status: HttpStatus.BAD_REQUEST,
    message: '이용할 수 없는 서비스입니다.',
  },
  ALREADY_DELETED: {
    status: HttpStatus.BAD_REQUEST,
    message: '이미 삭제된 서비스입니다.',
  },
} as const;

export const ORDER_ERRORS = {
  NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: '주문을 찾을 수 없습니다.',
  },
  INVALID_STATUS: {
    status: HttpStatus.BAD_REQUEST,
    message: '유효하지 않은 주문 상태입니다.',
  },
  ALREADY_CANCELED: {
    status: HttpStatus.BAD_REQUEST,
    message: '이미 취소된 주문입니다.',
  },
  ALREADY_REFUNDED: {
    status: HttpStatus.BAD_REQUEST,
    message: '이미 환불된 주문입니다.',
  },
} as const;

export const PAYMENT_ERRORS = {
  NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: '결제 정보를 찾을 수 없습니다.',
  },
  FAILED: {
    status: HttpStatus.BAD_REQUEST,
    message: '결제에 실패했습니다.',
  },
  AMOUNT_MISMATCH: {
    status: HttpStatus.BAD_REQUEST,
    message: '결제 금액이 일치하지 않습니다.',
  },
  ALREADY_CONFIRMED: {
    status: HttpStatus.BAD_REQUEST,
    message: '이미 승인된 결제입니다.',
  },
} as const;

export const REFUND_ERRORS = {
  NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: '환불 정보를 찾을 수 없습니다.',
  },
  ALREADY_REQUESTED: {
    status: HttpStatus.BAD_REQUEST,
    message: '이미 환불 요청된 주문입니다.',
  },
  INVALID_STATUS: {
    status: HttpStatus.BAD_REQUEST,
    message: '유효하지 않은 환불 상태입니다.',
  },
} as const;

export const EXPERT_ERRORS = {
  NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: '전문가를 찾을 수 없습니다.',
  },
  NOT_APPROVED: {
    status: HttpStatus.FORBIDDEN,
    message: '승인되지 않은 전문가입니다.',
  },
  ALREADY_APPROVED: {
    status: HttpStatus.BAD_REQUEST,
    message: '이미 승인된 전문가입니다.',
  },
  REJECTED: {
    status: HttpStatus.FORBIDDEN,
    message: '승인이 거절된 전문가입니다.',
  },
} as const;
