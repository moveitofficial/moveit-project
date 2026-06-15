import type { Role } from '@/mocks/types';

export interface MypageMenuItem {
  label: string;
  href: string;
}

export const MYPAGE_MENU_BY_ROLE = {
  CLIENT: [
    { label: '내 정보', href: '/mypage' },
    { label: '비밀번호 변경', href: '/mypage/password' },
    { label: '구매관리', href: '/mypage/orders' },
    { label: '일정 관리', href: '/mypage/schedule' },
    { label: '내가 쓴 게시글', href: '/mypage/posts' },
    { label: '내가 쓴 리뷰', href: '/mypage/reviews' },
    { label: '내가 쓴 댓글', href: '/mypage/comments' },
    { label: '회원탈퇴', href: '/mypage/withdraw' },
  ],
  EXPERT: [
    { label: '프로필관리', href: '/mypage' },
    { label: '비밀번호 변경', href: '/mypage/password' },
    { label: '판매관리', href: '/mypage/orders' },
    { label: '포트폴리오 관리', href: '/mypage/portfolios' },
    { label: '서비스관리', href: '/mypage/services' },
    { label: '일정 관리', href: '/mypage/schedule' },
    { label: '내가 쓴 게시글', href: '/mypage/posts' },
    { label: '내가 쓴 리뷰', href: '/mypage/reviews' },
    { label: '내가 쓴 댓글', href: '/mypage/comments' },
    { label: '회원탈퇴', href: '/mypage/withdraw' },
  ],
} as const satisfies Record<Role, readonly MypageMenuItem[]>;

export function getMypageMenuItems(role: Role): readonly MypageMenuItem[] {
  return MYPAGE_MENU_BY_ROLE[role];
}
