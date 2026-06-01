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
  BLOCKED: {
    status: HttpStatus.FORBIDDEN,
    message: '차단된 계정입니다.',
    code: 'BLOCKED',
  },
  VALIDATION_ERROR: {
    status: HttpStatus.BAD_REQUEST,
    message: '입력값이 올바르지 않습니다.',
    code: 'VALIDATION_ERROR',
  },
} as const;

export const OAUTH_ERRORS = {
  OAUTH_DUPLICATE_EMAIL: {
    status: HttpStatus.CONFLICT,
    message: '이 이메일로 가입된 계정이 있습니다. (OAuth)',
    code: 'OAUTH_DUPLICATE_EMAIL',
  },
  OAUTH_SIGNUP_TOKEN_INVALID: {
    status: HttpStatus.UNAUTHORIZED,
    message: '가입 토큰이 유효하지 않습니다.',
    code: 'OAUTH_SIGNUP_TOKEN_INVALID',
  },
  OAUTH_SIGNUP_TOKEN_EXPIRED: {
    status: HttpStatus.UNAUTHORIZED,
    message: '역할 선택 시간 만료. 구글 로그인을 다시 시도해 주세요.',
    code: 'OAUTH_SIGNUP_TOKEN_EXPIRED',
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
  DELETED: {
    status: HttpStatus.FORBIDDEN,
    message: '탈퇴한 계정입니다.',
    code: 'DELETED',
  },
  INVALID_PASSWORD: {
    status: HttpStatus.BAD_REQUEST,
    message: '현재 비밀번호가 올바르지 않습니다.',
  },
  PASSWORD_MISMATCH: {
    status: HttpStatus.BAD_REQUEST,
    message: '새 비밀번호가 일치하지 않습니다.',
  },
  ROLE_MISMATCH: {
    status: HttpStatus.BAD_REQUEST,
    message: '해당 사용자 역할에서는 조회할 수 없는 리소스입니다.',
  },
  ALREADY_BLOCKED: {
    status: HttpStatus.CONFLICT,
    message: '이미 블랙리스트에 등록된 회원입니다.',
  },
  NOT_BLOCKED: {
    status: HttpStatus.CONFLICT,
    message: '블랙리스트에 등록되지 않은 회원입니다.',
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
    status: HttpStatus.CONFLICT,
    message: '이미 삭제된 서비스입니다.',
  },
  FORBIDDEN_NOT_OWNER: {
    status: HttpStatus.FORBIDDEN,
    message: '본인이 등록한 서비스만 수정, 상태 변경 또는 종료할 수 있습니다.',
  },
  FORBIDDEN_NOT_EXPERT: {
    status: HttpStatus.FORBIDDEN,
    message: '전문가의 서비스만 조회할 수 있습니다.',
  },
  IMAGE_PARTIAL_UPDATE: {
    status: HttpStatus.BAD_REQUEST,
    message: '메인 이미지와 상세 이미지는 함께 수정해야 합니다.',
  },
  MAIN_IMAGE_REQUIRED: {
    status: HttpStatus.BAD_REQUEST,
    message: '메인 이미지는 정확히 1개여야 합니다.',
    code: 'PORTFOLIO_MAIN_IMAGE_REQUIRED',
  },
  DETAIL_IMAGE_INVALID: {
    status: HttpStatus.BAD_REQUEST,
    message: '상세 이미지는 최소 1개, 최대 10개까지 등록할 수 있습니다.',
    code: 'PORTFOLIO_DETAIL_IMAGE_INVALID',
  },
} as const;

export const ORDER_ERRORS = {
  NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: '주문을 찾을 수 없습니다.',
  },
  FORBIDDEN_NOT_OWNER: {
    status: HttpStatus.FORBIDDEN,
    message: '본인의 주문에만 접근할 수 있습니다.',
  },
  INVALID_STATUS: {
    status: HttpStatus.BAD_REQUEST,
    message: '유효하지 않은 주문 상태입니다.',
  },
  AMOUNT_MISMATCH: {
    status: HttpStatus.BAD_REQUEST,
    message: '결제 요청 금액이 실제 주문 금액과 일치하지 않습니다.',
  },
  ALREADY_PROCESSED: {
    status: HttpStatus.CONFLICT,
    message: '이미 결제가 완료되었거나 취소된 주문건입니다.',
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
    status: HttpStatus.CONFLICT,
    message: '이미 승인된 결제입니다.',
  },
  DUPLICATE_PAYMENT_KEY: {
    status: HttpStatus.CONFLICT,
    message: '이미 사용된 결제 키입니다.',
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

export const CLIENT_PROFILE_ERRORS = {
  NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: '의뢰인 프로필을 찾을 수 없습니다.',
  },
  ALREADY_EXISTS: {
    status: HttpStatus.CONFLICT,
    message: '이미 클라이언트 프로필이 존재합니다.',
  },
  MIXED_SERVICE_GROUP: {
    status: HttpStatus.BAD_REQUEST,
    message: '관심 분야는 하나의 서비스 그룹에서만 선택할 수 있습니다.',
  },
} as const;

export const EXPERT_PROFILE_ERRORS = {
  NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: '전문가 프로필을 찾을 수 없습니다.',
  },
  ALREADY_EXISTS: {
    status: HttpStatus.CONFLICT,
    message: '이미 전문가 프로필이 존재합니다.',
  },
  MIXED_SERVICE_GROUP: {
    status: HttpStatus.BAD_REQUEST,
    message: '전문 분야는 하나의 서비스 그룹에서만 선택할 수 있습니다.',
  },
} as const;

export const PORTFOLIO_ERRORS = {
  NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: '포트폴리오를 찾을 수 없습니다.',
    code: 'PORTFOLIO_NOT_FOUND',
  },
  MAIN_IMAGE_REQUIRED: {
    status: HttpStatus.BAD_REQUEST,
    message: '메인 이미지는 정확히 1개여야 합니다.',
    code: 'PORTFOLIO_MAIN_IMAGE_REQUIRED',
  },
  DETAIL_IMAGE_INVALID: {
    status: HttpStatus.BAD_REQUEST,
    message: '상세 이미지는 최소 1개, 최대 10개까지 등록할 수 있습니다.',
    code: 'PORTFOLIO_DETAIL_IMAGE_INVALID',
  },
  MISSING_STACK_TYPE: {
    status: HttpStatus.BAD_REQUEST,
    message:
      '디자인, 프론트엔드, 백엔드 각 기술 유형별로 최소 1개씩 입력해 주세요.',
    code: 'PORTFOLIO_MISSING_STACK_TYPE',
  },
  NOT_EXPERT: {
    status: HttpStatus.UNAUTHORIZED,
    message: '전문가만 포트폴리오를 등록할 수 있습니다.',
    code: 'PORTFOLIO_NOT_EXPERT',
  },
  FORBIDDEN: {
    status: HttpStatus.FORBIDDEN,
    message: '본인이 등록한 포트폴리오만 수정하거나 삭제할 수 있습니다.',
    code: 'PORTFOLIO_FORBIDDEN',
  },
} as const;

export const REVIEW_ERRORS = {
  NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: '존재하지 않는 리뷰입니다.',
    code: 'REVIEW_NOT_FOUND',
  },
  ALREADY_EXISTS: {
    status: HttpStatus.CONFLICT,
    message: '이미 리뷰를 작성한 주문입니다.',
    code: 'REVIEW_ALREADY_EXISTS',
  },
  ORDER_NOT_REVIEWABLE: {
    status: HttpStatus.BAD_REQUEST,
    message: '리뷰를 작성할 수 없는 주문 상태입니다.',
    code: 'REVIEW_ORDER_NOT_REVIEWABLE',
  },
  ORDER_SERVICE_MISMATCH: {
    status: HttpStatus.BAD_REQUEST,
    message: '주문과 서비스가 일치하지 않습니다.',
    code: 'REVIEW_ORDER_SERVICE_MISMATCH',
  },
  NOTHING_TO_UPDATE: {
    status: HttpStatus.BAD_REQUEST,
    message: '수정된 내용이 없습니다.',
    code: 'REVIEW_NOTHING_TO_UPDATE',
  },
};

export const UPLOAD_ERRORS = {
  FILE_NOT_ATTACHED: {
    status: HttpStatus.BAD_REQUEST,
    message: '파일이 첨부되지 않았습니다.',
  },
  INVALID_FILE_TYPE: {
    status: HttpStatus.BAD_REQUEST,
    message: '허용되지 않는 파일 형식입니다. (jpeg, png, webp만 허용)',
  },
  IMAGE_METADATA_UNREADABLE: {
    status: HttpStatus.BAD_REQUEST,
    message: '이미지 메타데이터를 읽을 수 없습니다. 손상된 파일일 수 있습니다.',
  },
  IMAGE_WIDTH_TOO_SMALL: {
    status: HttpStatus.BAD_REQUEST,
    message: '이미지 가로는 최소 600px 이상이어야 합니다.',
  },
  IMAGE_HEIGHT_TOO_LARGE: {
    status: HttpStatus.BAD_REQUEST,
    message: '이미지 세로는 최대 3000px 이하여야 합니다.',
  },
  PROFILE_IMAGE_TOO_LARGE: {
    status: HttpStatus.BAD_REQUEST,
    message: '프로필 이미지의 가로와 세로는 각각 500px 이하여야 합니다.',
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

export const COMMUNITY_POSTS_ERRORS = {
  NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: '게시글을 찾을 수 없습니다.',
    code: 'COMMUNITY_POSTS_NOT_FOUND',
  },
  FORBIDDEN: {
    status: HttpStatus.FORBIDDEN,
    message: '본인이 등록한 게시글만 수정, 삭제할 수 있습니다.',
    code: 'COMMUNITY_POSTS_FORBIDDEN',
  },
  ALREADY_DELETED: {
    status: HttpStatus.CONFLICT,
    message: '삭제된 게시글입니다.',
    code: 'COMMUNITY_POSTS_ALREADY_DELETED',
  },
  CONTENT_TOO_SHORT: {
    status: HttpStatus.BAD_REQUEST,
    message: '게시글 내용은 최소 1자 이상이어야 합니다.',
    code: 'COMMUNITY_POSTS_CONTENT_TOO_SHORT',
  },
  NOTHING_TO_UPDATE: {
    status: HttpStatus.BAD_REQUEST,
    message: '수정할 항목이 없습니다.',
    code: 'COMMUNITY_POSTS_NOTHING_TO_UPDATE',
  },
} as const;

export const CHAT_ERRORS = {
  ROOM_NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: '채팅방을 찾을 수 없습니다.',
    code: 'CHAT_ROOM_NOT_FOUND',
  },
  FORBIDDEN_NOT_PARTICIPANT: {
    status: HttpStatus.FORBIDDEN,
    message: '채팅방 참여자만 접근할 수 있습니다.',
    code: 'CHAT_FORBIDDEN_NOT_PARTICIPANT',
  },
  FORBIDDEN_NOT_CLIENT: {
    status: HttpStatus.FORBIDDEN,
    message: '클라이언트만 채팅방을 생성할 수 있습니다.',
    code: 'CHAT_FORBIDDEN_NOT_CLIENT',
  },
} as const;

export const CS_CHAT_ERRORS = {
  ROOM_NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: '문의방을 찾을 수 없습니다.',
    code: 'CS_CHAT_ROOM_NOT_FOUND',
  },
  FORBIDDEN: {
    status: HttpStatus.FORBIDDEN,
    message: '접근 권한이 없습니다.',
    code: 'CS_CHAT_FORBIDDEN',
  },
  ALREADY_CLOSED: {
    status: HttpStatus.BAD_REQUEST,
    message: '이미 종료된 문의입니다.',
    code: 'CS_CHAT_ALREADY_CLOSED',
  },
  FORBIDDEN_NOT_ADMIN: {
    status: HttpStatus.FORBIDDEN,
    message: '관리자만 이 작업을 수행할 수 있습니다.',
    code: 'CS_CHAT_FORBIDDEN_NOT_ADMIN',
  },
} as const;

export const COMMENTS_ERRORS = {
  CONTENT_TOO_SHORT: {
    status: HttpStatus.BAD_REQUEST,
    message: '댓글 내용은 최소 1자 이상이어야 합니다.',
    code: 'COMMENTS_CONTENT_TOO_SHORT',
  },
  CONTENT_TOO_LONG: {
    status: HttpStatus.BAD_REQUEST,
    message: '댓글 내용은 최대 1000자 이하여야 합니다.',
    code: 'COMMENTS_CONTENT_TOO_LONG',
  },
} as const;
