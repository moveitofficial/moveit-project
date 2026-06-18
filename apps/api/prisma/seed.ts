/* eslint-disable @typescript-eslint/no-non-null-assertion, unicorn/no-process-exit */
import { fakerKO as faker } from '@faker-js/faker';
import {
  type Admin,
  AdminActionType,
  AuthProvider,
  BusinessSector,
  CommunityCategory,
  CsChatStatus,
  type ExpertProfile,
  type Service,
  MainSectionType,
  MainTargetType,
  MessageType,
  NotificationCategory,
  OrderStatus,
  PaymentStatus,
  type Portfolio,
  PrismaClient,
  RefundStatus,
  RefundType,
  Region,
  ReportReason,
  ReportStatus,
  Role,
  SenderType,
  ServiceCategoryName,
  ServiceGroupName,
  ServiceStatus,
  StackType,
  SystemMessageType,
  TechStackName,
  type User,
} from '@prisma/client';
import { SYSTEM_MESSAGE_CONTENT } from '@repo/socket-events';
import bcrypt from 'bcrypt';
import { config as loadEnv } from 'dotenv';

import {
  NOTIFICATION_CATALOG,
  type NotificationContentVars,
} from '../src/notifications/notification.catalog';

loadEnv({ path: `.env.${process.env.NODE_ENV ?? 'development'}` });

// ─── 상수 ───────────────────────────────────────────────────────────────
const SEED_PASSWORD = 'Test1234!';

const SAMPLE_IMAGES = [
  'https://picsum.photos/seed/moveit-1/800/1200',
  'https://picsum.photos/seed/moveit-2/800/1200',
  'https://picsum.photos/seed/moveit-3/800/1200',
  'https://picsum.photos/seed/moveit-4/800/1200',
  'https://picsum.photos/seed/moveit-5/800/1200',
  'https://picsum.photos/seed/moveit-6/800/1200',
  'https://picsum.photos/seed/moveit-7/800/1200',
  'https://picsum.photos/seed/moveit-8/800/1200',
  'https://picsum.photos/seed/moveit-9/800/1200',
  'https://picsum.photos/seed/moveit-10/800/1200',
];

const PROFILE_IMAGES = [
  'https://picsum.photos/seed/profile-1/400/400',
  'https://picsum.photos/seed/profile-2/400/400',
  'https://picsum.photos/seed/profile-3/400/400',
  'https://picsum.photos/seed/profile-4/400/400',
  'https://picsum.photos/seed/profile-5/400/400',
  'https://picsum.photos/seed/profile-6/400/400',
  'https://picsum.photos/seed/profile-7/400/400',
  'https://picsum.photos/seed/profile-8/400/400',
  'https://picsum.photos/seed/profile-9/400/400',
  'https://picsum.photos/seed/profile-10/400/400',
];

const BANNER_IMAGES = [
  'https://picsum.photos/seed/banner-1/1920/600',
  'https://picsum.photos/seed/banner-2/1920/600',
  'https://picsum.photos/seed/banner-3/1920/600',
];

const REPORT_REASONS: ReportReason[] = [
  ReportReason.FALSE_INFORMATION,
  ReportReason.ABUSE,
  ReportReason.ILLEGAL_ACTIVITY,
  ReportReason.EXTERNAL_CONTACT,
  ReportReason.SPAM,
  ReportReason.OTHER,
];

const COMMENT_TEMPLATES = [
  '잘 봤습니다! 도움이 많이 됐어요.',
  '저도 비슷한 경험이 있었어요.',
  '이 부분 더 자세히 알려주실 수 있을까요?',
  '감사합니다 :)',
  '좋은 정보 공유해주셔서 감사해요!',
  '저도 추천드립니다.',
  '관련 자료가 있다면 공유해주세요.',
  '실제로 적용해봤는데 효과가 좋았어요.',
  '오 저도 이거 고민하던 차였는데 큰 도움이 되네요',
  '혹시 이쪽 분야 입문서 추천 가능할까요?',
  '저도 비슷하게 진행 중인데 결과 공유 부탁드려요',
  '글 잘 읽었습니다. 다음 글도 기대할게요!',
];

// 1:1 채팅 대화 스크립트 — 단계별로 client/expert가 번갈아 주고받는 자연스러운 흐름
interface ChatLine {
  sender: 'client' | 'expert';
  text: string;
}

// 거래 요청 후 결제 전 — 협의 단계
const CHAT_INTRO_SCRIPTS: ChatLine[][] = [
  [
    { sender: 'client', text: '안녕하세요, 혹시 지금 작업 의뢰 가능할까요?' },
    {
      sender: 'expert',
      text: '네 안녕하세요! 가능합니다. 어떤 작업 도와드릴까요?',
    },
    { sender: 'client', text: '회사 소개 랜딩 페이지 하나 제작하려고 해요.' },
    {
      sender: 'expert',
      text: '반응형으로 깔끔하게 작업 가능합니다. 참고하실 만한 사이트나 자료가 있을까요?',
    },
    {
      sender: 'client',
      text: '네, 정리해서 보내드릴게요. 일정은 어느 정도 걸릴까요?',
    },
    {
      sender: 'expert',
      text: '분량 확인 후 정확히 안내드릴게요. 견적도 함께 정리해서 드리겠습니다.',
    },
    { sender: 'client', text: '확인했습니다. 그럼 결제 진행할게요!' },
  ],
  [
    { sender: 'client', text: '코칭 신청하려고 하는데 초보도 괜찮을까요?' },
    {
      sender: 'expert',
      text: '그럼요, 기초부터 차근차근 진행하니 걱정 안 하셔도 됩니다.',
    },
    { sender: 'client', text: '주로 어떤 방식으로 진행되나요?' },
    {
      sender: 'expert',
      text: '실습 위주로 진행하고, 매 회차마다 과제 피드백 드려요.',
    },
    { sender: 'client', text: '좋네요. 시간대는 평일 저녁도 가능할까요?' },
    {
      sender: 'expert',
      text: '네 조율 가능합니다. 결제해주시면 일정 잡을게요.',
    },
  ],
  [
    {
      sender: 'client',
      text: '견적 문의드려요. 앱 디자인 시안 작업 가능하신가요?',
    },
    {
      sender: 'expert',
      text: '안녕하세요, 가능합니다. 화면 수가 대략 몇 개 정도일까요?',
    },
    {
      sender: 'client',
      text: '메인이랑 상세까지 한 8개 정도 생각하고 있어요.',
    },
    {
      sender: 'expert',
      text: '확인했습니다. 레퍼런스 주시면 톤앤매너 맞춰서 작업하겠습니다.',
    },
    { sender: 'client', text: '네 바로 결제하고 자료 전달드릴게요.' },
  ],
];

// 결제 후 — 작업 진행 단계
const CHAT_BODY_SCRIPTS: ChatLine[][] = [
  [
    { sender: 'expert', text: '결제 확인했습니다. 바로 작업 시작할게요!' },
    { sender: 'client', text: '넵 잘 부탁드립니다 :)' },
    { sender: 'expert', text: '메인 컬러는 어떤 톤으로 잡을까요?' },
    { sender: 'client', text: '블루 계열로 깔끔하게 부탁드려요.' },
    { sender: 'expert', text: '알겠습니다. 초안 나오면 바로 공유드릴게요.' },
    { sender: 'client', text: '천천히 하셔도 됩니다. 퀄리티가 우선이라서요.' },
    { sender: 'expert', text: '감사합니다. 중간 결과물 곧 보여드리겠습니다.' },
  ],
  [
    { sender: 'expert', text: '자료 잘 받았습니다. 오늘부터 진행하겠습니다.' },
    {
      sender: 'client',
      text: '네 확인 감사합니다. 궁금한 점 있으면 말씀 주세요.',
    },
    { sender: 'expert', text: '혹시 로고 원본 파일도 받을 수 있을까요?' },
    { sender: 'client', text: '아 네, 지금 바로 보내드릴게요.' },
    { sender: 'expert', text: '감사합니다. 받는 대로 반영하겠습니다.' },
    {
      sender: 'client',
      text: '진행 상황 중간중간 공유해주시면 좋을 것 같아요.',
    },
    { sender: 'expert', text: '넵 단계별로 공유드리겠습니다.' },
  ],
];

// 산출물 전달 후 — 마무리 단계
const CHAT_CLOSING_SCRIPTS: ChatLine[][] = [
  [
    { sender: 'expert', text: '최종 산출물 전달드립니다. 확인 부탁드려요.' },
    {
      sender: 'client',
      text: '확인했습니다. 깔끔하게 잘 나왔네요, 감사합니다!',
    },
    {
      sender: 'expert',
      text: '감사합니다. 추가 수정 필요하시면 편하게 말씀 주세요.',
    },
    { sender: 'client', text: '네 우선 잘 사용해볼게요. 수고 많으셨습니다!' },
  ],
  [
    { sender: 'expert', text: '요청하신 부분 모두 반영해서 전달드렸어요.' },
    {
      sender: 'client',
      text: '빠르게 작업해주셔서 감사해요. 만족스럽습니다 :)',
    },
    {
      sender: 'expert',
      text: '좋게 봐주셔서 감사합니다. 다음에도 잘 부탁드려요!',
    },
  ],
];

const SERVICE_TITLES_PROJECT = [
  '반응형 웹사이트 제작 (Next.js + TypeScript)',
  '랜딩페이지 제작 (마케팅·런칭용)',
  '쇼핑몰 풀스택 개발 (React + Node.js)',
  '관리자 대시보드 개발',
  '백엔드 API 설계 및 구현 (NestJS)',
  'iOS/Android 크로스 플랫폼 앱 개발',
  '데이터 분석 대시보드 구축',
  'AI 챗봇 개발 (GPT API 연동)',
  '실시간 채팅 기능 개발 (WebSocket)',
  'SaaS MVP 1개월 완성',
  '결제 시스템 연동 (토스/포트원)',
  'AWS 인프라 구축 및 CI/CD 세팅',
  '브랜드 홈페이지 리뉴얼',
  '게임 클라이언트 개발 (Unity)',
];

const SERVICE_TITLES_COACHING = [
  '주니어 개발자 코드리뷰 1:1 코칭',
  'React 입문부터 실전까지 4주 과정',
  '백엔드 면접 대비 시스템 디자인 코칭',
  '신입 프론트 부트캠프 멘토링',
  '취업 포트폴리오 리뷰 및 컨설팅',
  '개발자 이직 컨설팅 (이력서·면접)',
  'TypeScript 마이그레이션 1:1 코칭',
  'AWS 자격증 합격 코칭',
  '클린 아키텍처 실전 적용 코칭',
  '데이터 분석 SQL 기초 코칭',
  '코딩테스트 합격 알고리즘 코칭',
  '스타트업 CTO 직군 멘토링',
];

const PREPARATION_NOTES = [
  '작업 시작 전 기획서와 참고 자료를 준비해 주세요.',
  '필요한 서비스의 구체적인 요구사항과 예시 자료를 미리 준비해 주시면 더 효율적입니다.',
  '디자인 가이드, 브랜드 컬러, 로고 등의 자료가 있다면 함께 공유해 주세요.',
  '참고하실 만한 유사 서비스/사이트 URL을 알려주시면 도움이 됩니다.',
  '계획된 일정과 예상 마감일을 미리 알려주세요.',
  '브랜드 톤앤매너, 타겟 사용자 페르소나가 정리되어 있으면 더 좋습니다.',
  '결제 / 회원 / 알림 등 필수 기능 목록을 정리해 주세요.',
];

const REFUND_POLICIES = [
  '작업 시작 전 100% 환불, 작업 중 50% 환불, 작업 완료 후 환불 불가',
  '작업 시작 전 100% 환불 가능. 작업 진행 후엔 진행률에 따라 환불 산정.',
  '구매 확정 전까지 협의를 통해 환불 가능. 작업 완료 후 환불 불가.',
  '시안 1차 전달 전까지 100% 환불, 시안 전달 후 50% 환불, 최종 납품 후 환불 불가.',
  '계약 후 7일 이내 80% 환불, 이후 30% 환불. 작업물 인도 후엔 환불 불가.',
];

const SERVICE_SCOPES = [
  '디자인 시안 2회 제공 + 반응형 코딩 + 수정 3회 포함',
  '메인 페이지 디자인 + 서브 페이지 5개 + 모바일 반응형 + SEO 최적화',
  '로고 디자인 + 컬러 가이드 + 폰트 가이드 + AI/SVG 원본 제공',
  'API 30개 설계 및 구현 + 데이터베이스 모델링 + 배포까지',
  '4주 1:1 멘토링 (주 2회 90분) + 코드리뷰 + 커리큘럼 제공',
  '이력서 1회 + 모의면접 2회 + 포트폴리오 피드백 1회',
  '기능 명세 정리 + 와이어프레임 + 화면 디자인 + 프론트엔드 구현',
];

const SERVICE_DESCRIPTIONS_PROJECT = [
  '안녕하세요. 5년 차 풀스택 개발자입니다. 스타트업/중소기업 자사몰 및 SaaS 개발을 다수 진행했고, Next.js와 NestJS를 주력으로 합니다. 의뢰 주신 분의 비즈니스 목적과 사용자 흐름을 충분히 파악한 후 견적과 일정을 협의 드립니다.',
  '7년 차 백엔드 엔지니어이며 결제·정산·실시간 채팅 등 미션 크리티컬한 도메인 다수 경험이 있습니다. 운영 가능한 안정적인 코드와 명확한 문서를 함께 제공해 드립니다.',
  '디자인 + 프론트엔드 풀세트로 진행 가능한 디자이너 겸 개발자입니다. 단순한 외주가 아니라 비즈니스의 페인포인트부터 같이 고민하는 파트너십을 지향합니다.',
  '대형 커머스 플랫폼 출신 시니어로, 트래픽이 많은 서비스 구조 설계가 강점입니다. 단순 구현뿐 아니라 운영 단계까지 고려한 아키텍처를 제공합니다.',
];

const SERVICE_DESCRIPTIONS_COACHING = [
  '신입~3년 차 개발자를 대상으로 합니다. 실무에서 마주치는 문제 위주로 코드리뷰와 리팩토링을 같이 진행하며, 단순 정답이 아니라 의사결정 과정을 가르치는 데 중점을 둡니다.',
  '5년 동안 100명 이상의 멘티를 지도했습니다. 각자의 학습 속도와 목표에 맞춘 커리큘럼으로, 단순 강의가 아닌 실무 프로젝트 기반 코칭을 진행합니다.',
  '대기업 / 유니콘 스타트업 면접 경험을 바탕으로 시스템 디자인, 알고리즘, 이력서 첨삭까지 한 번에 도와드립니다.',
  '주니어 → 시니어 성장 과정을 압축해서 전달하는 데 자신 있습니다. 첫 1회 무료 상담으로 방향성을 잡아드립니다.',
];

const SERVICE_STEPS = [
  ['요구사항 분석', '디자인/기획', '개발 및 검수'],
  ['상담 및 요구사항 정리', '시안 작업', '수정 및 최종 납품'],
  ['프로젝트 킥오프', '주차별 작업 및 리뷰', '최종 인수인계'],
  ['목표 설정', '실습 기반 진행', '최종 평가 및 피드백'],
];

const FAQ_TEMPLATES_PROJECT: { question: string; answer: string }[] = [
  {
    question: '제작 기간은 얼마나 걸리나요?',
    answer:
      '의뢰 내용과 범위에 따라 다르며, 평균적으로 4~8주 정도 소요됩니다. 첫 상담에서 정확한 일정을 안내드립니다.',
  },
  {
    question: '수정 횟수는 어떻게 되나요?',
    answer:
      '서비스 안내에 명시된 횟수 내에서 무료 수정 가능합니다. 초과 시 별도 견적이 발생합니다.',
  },
  {
    question: '원본 파일도 제공해 주시나요?',
    answer:
      '디자인 원본(피그마/AI), 소스 코드(깃 저장소) 모두 제공해 드립니다.',
  },
  {
    question: '결제는 어떻게 하나요?',
    answer:
      '무빗 안전 결제 시스템을 통해 진행됩니다. 구매 확정 전까지 무빗이 결제 금액을 안전하게 보관합니다.',
  },
];

const FAQ_TEMPLATES_COACHING: { question: string; answer: string }[] = [
  {
    question: '비전공자도 들을 수 있나요?',
    answer:
      '네, 기초부터 차근차근 진행하기 때문에 비전공자분들도 충분히 따라오실 수 있습니다.',
  },
  {
    question: '진행 방식은 어떻게 되나요?',
    answer:
      '온라인 화상 코칭이 기본이며, 별도 협의 시 오프라인 진행도 가능합니다.',
  },
  {
    question: '수업 자료는 제공되나요?',
    answer: '코칭에 필요한 학습 자료, 예제 코드, 과제는 모두 제공해 드립니다.',
  },
  {
    question: '결제 후 환불은 어떻게 되나요?',
    answer:
      '코칭 시작 전 100% 환불 가능합니다. 시작 후엔 회차별로 환불 산정됩니다.',
  },
];

const pickServiceStatus = (): ServiceStatus => {
  const n = Math.random();
  if (n < 0.8) return ServiceStatus.ACTIVE;
  if (n < 0.95) return ServiceStatus.PAUSED;
  return ServiceStatus.CLOSED;
};

const PORTFOLIO_TITLES = [
  'B2B SaaS 어드민 대시보드 리뉴얼',
  '커머스 자사몰 풀스택 개발',
  '병원 예약 시스템 구축',
  '교육 플랫폼 LMS 개발',
  '핀테크 결제 시스템 연동',
  '음식 배달 앱 백엔드 마이그레이션',
  '부동산 매물 플랫폼 신규 런칭',
  '커뮤니티 SNS 앱 개발',
  '브랜드 공식 홈페이지 리뉴얼',
  '대기업 그룹웨어 모듈 개발',
  '실시간 채팅 기반 고객센터 시스템',
  '구독 결제 SaaS MVP 개발',
  'AI 챗봇 도입 프로젝트',
  '재고관리 ERP 신규 개발',
  '광고 캠페인 관리 콘솔 구축',
];

const PORTFOLIO_DESCRIPTIONS = [
  '프로젝트 진행 기간 3개월, 팀 규모 4명으로 진행한 프로젝트입니다. 주요 기술 스택은 Next.js, NestJS, PostgreSQL이며, 트래픽 3배 증가와 페이지 로드 속도 60% 개선이라는 성과를 만들어냈습니다. 클라이언트와의 긴밀한 커뮤니케이션을 통해 요구사항을 정확히 반영했고, 운영 안정성도 크게 향상시켰습니다.',
  '구체적 요구사항 분석부터 디자인, 개발, 배포까지 전 과정을 함께 진행했습니다. 클라이언트 만족도 평가에서 평균 4.8점을 받았으며, 출시 후 6개월간 안정적인 운영을 이어가고 있습니다. 디자인 시안 작업부터 코드 리뷰까지 한 사이클 안에서 처리했습니다.',
  '레거시 코드 리팩토링 + 신규 기능 추가가 핵심이었던 프로젝트입니다. 단위 테스트 커버리지를 80%까지 끌어올렸고, 배포 자동화 파이프라인을 구축해 배포 주기를 주 1회 → 일 1회로 단축시켰습니다.',
  '크로스 플랫폼 모바일 앱 개발 프로젝트로 iOS와 Android 동시에 런칭했습니다. 출시 후 6개월 만에 사용자 10만 명을 돌파했으며, 앱스토어 평점 4.7을 유지하고 있습니다. 푸시 알림, 결제, 소셜 로그인 등 핵심 기능 다수를 구현했습니다.',
  '대용량 트래픽을 처리하기 위한 백엔드 아키텍처 설계 프로젝트입니다. Redis 캐싱과 큐 시스템을 도입해 동시 접속 1만 명을 안정적으로 처리할 수 있는 구조를 만들었습니다. 운영 비용도 40% 절감했습니다.',
];

const PORTFOLIO_CLIENTS = [
  '(주)테크앤테크',
  '(주)스타트업컴퍼니',
  '(주)이커머스코리아',
  '(주)헬스케어솔루션',
  '(주)에듀테크그룹',
  '(주)핀테크원',
  '(주)리테일플랫폼',
  '(주)디자인스튜디오',
  '(주)클라우드워크스',
  '(주)데이터인사이트',
  '비공개',
];

const REPLY_TEMPLATES = [
  '저도 같은 생각입니다 👍',
  '좋은 의견 감사합니다!',
  '저는 조금 다르게 생각하는데, 이런 케이스는 어떨까요?',
  '답변 감사합니다. 큰 도움이 됐습니다.',
  '추가로 궁금한 점이 있는데 DM 드려도 될까요?',
  '저는 이렇게 해결했어요!',
  '좋은 인사이트 얻고 갑니다',
  '관련해서 참고할 만한 자료 더 있을까요?',
];

const COMMUNITY_POST_TITLES = [
  '[질문] React useEffect 의존성 배열 어떻게 관리하시나요?',
  '[질문] NestJS DI 컨테이너 활용 패턴 추천 부탁드려요',
  '[질문] PostgreSQL 인덱스 안 들어가는 케이스 정리해 주실 분',
  '[질문] 사이드 프로젝트 클라우드 비용 어떻게 줄이세요?',
  '[질문] 코드리뷰 받을 때 어떤 부분을 가장 중점적으로 보시나요?',
  '[팁] TypeScript strict 모드 점진적 도입 노하우 공유',
  '[팁] 모노레포에서 의존성 관리 깔끔하게 하는 법',
  '[팁] React Query 캐시 정책 실전 가이드',
  '[팁] AWS Lambda 콜드 스타트 최적화 체크리스트',
  '[팁] 코딩테스트 자주 나오는 그래프 알고리즘 정리',
  '[후기] 6개월 차 신입 개발자 솔직 회고',
  '[후기] 부트캠프 수료 후 첫 취업까지 4개월 기록',
  '[후기] 시니어로 이직하고 느낀 3가지',
  '[후기] 사이드 프로젝트로 월 매출 100만원 도전 한 달 회고',
  '[스터디] 6월 알고리즘 스터디 모집합니다 (주 1회, 온라인)',
  '[스터디] 백엔드 시스템 디자인 스터디원 모집 (3명)',
  '[스터디] React Native 실전 프로젝트 같이 하실 분',
  '[스터디] AWS 자격증 SAA 스터디원 구합니다',
  '[자유] 여러분의 개발자 책상 사진 공유 부탁드려요',
  '[자유] 사이드 프로젝트 동료 구합니다 (백엔드)',
  '[자유] 신입 시절 가장 후회되는 선택은?',
  '[자유] 좋아하는 기술 블로그 추천 해주세요',
];

const COMMUNITY_POST_CONTENTS = [
  '실무에서 자주 부딪히는 케이스인데 여러분은 어떻게 처리하시는지 궁금해서 글 남깁니다. 제 경우에는 useCallback이랑 같이 써서 의존성을 최소화하려고 하는데, 가끔은 그게 오히려 더 복잡해지는 것 같더라구요. 다른 분들의 노하우 듣고 싶습니다.',
  '최근에 비슷한 문제를 겪었는데 결국 인덱스 힌트 + 쿼리 재작성으로 해결했습니다. EXPLAIN ANALYZE 결과를 같이 보면서 디버깅하는 게 가장 효율적이더라구요. 도움이 되었으면 합니다.',
  '회사에서 6개월 동안 진행한 프로젝트 회고입니다. 기술적 도전과제뿐만 아니라 팀 협업이나 일정 관리 측면에서 배운 점이 많았어요. 같은 길을 걷고 계신 분들께 도움이 되었으면 좋겠습니다.',
  '주니어부터 시니어까지 누구나 환영합니다. 매주 일요일 오후 8시 온라인 미팅으로 진행할 예정입니다. 관심 있으신 분 댓글이나 DM 부탁드려요.',
  '비전공자 출신으로 첫 회사를 다니면서 느낀 점을 솔직하게 적어봤습니다. 정답은 아니지만 비슷한 고민 하시는 분들께 공감되었으면 좋겠어요.',
  '오랜만에 블로그 글을 정리하다가 다른 분들이 추천하는 블로그도 궁금해졌습니다. 한국어 / 영어 모두 환영입니다. 댓글에 공유 부탁드려요!',
];

// ─── helpers ────────────────────────────────────────────────────────────
const pick = <T>(arr: readonly T[]): T =>
  arr[Math.floor(Math.random() * arr.length)]!;
const rand = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const shuffle = <T>(arr: readonly T[]): T[] =>
  [...arr].sort(() => Math.random() - 0.5);
const pickImage = (): string => pick(SAMPLE_IMAGES);
const pickProfileImage = (): string => pick(PROFILE_IMAGES);
const range = (n: number): number[] => Array.from({ length: n }, (_, i) => i);

// ─── Order Scenario ─────────────────────────────────────────────────────
type RefundApprover = 'expert' | 'admin';

interface ScenarioPlan {
  status: OrderStatus;
  refund?: {
    type: RefundType;
    status: RefundStatus;
    approvedBy?: RefundApprover;
  };
}

interface SeededOrderInfo {
  orderId: string;
  clientUserId: string;
  expertUserId: string;
  serviceTitle: string;
  status: OrderStatus;
  refundType?: RefundType;
  refundStatus?: RefundStatus;
  approvedBy?: RefundApprover;
}

// ─── Seeder ─────────────────────────────────────────────────────────────
class Seeder {
  readonly #prisma: PrismaClient;
  // (client-expert-service) 조합 → 채팅방 id 캐시.
  // 모든 주문이 이 게이트웨이를 통해 방을 공유/생성 → 주문마다 채팅 진입 보장 + 방 중복 방지.
  readonly #roomCache = new Map<string, string>();

  constructor(prisma: PrismaClient) {
    this.#prisma = prisma;
  }

  async run(): Promise<void> {
    if (process.env.NODE_ENV !== 'development') {
      throw new Error('⚠️ 프로덕션 환경에서는 시딩을 실행하지 않습니다.');
    }

    console.warn('🌱 시딩 시작...');

    const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);

    await this.#resetDb();
    console.warn('✅ 기존 데이터 삭제 완료');

    const { techStacks, serviceGroups, serviceCategories } =
      await this.#seedCatalogs();
    console.warn(
      `✅ 카탈로그 생성 — TechStack ${techStacks.length.toString()}, ServiceGroup ${serviceGroups.length.toString()}, ServiceCategory ${serviceCategories.length.toString()}`,
    );

    const { superAdmin, staffAdmins } = await this.#seedAdmins(passwordHash);
    const inactiveCount = staffAdmins.filter(
      (a) => a.lastLoginAt === null,
    ).length;
    console.warn(
      `✅ 어드민 — 최고관리자 1, 직원 ${staffAdmins.length.toString()} (미로그인 ${inactiveCount.toString()})`,
    );

    const { clients, experts } = await this.#seedUsers(passwordHash);
    console.warn(
      `✅ 유저 — CLIENT ${clients.length.toString()}, EXPERT ${experts.length.toString()}`,
    );

    await this.#seedWithdrawnUsers(passwordHash);
    console.warn(`✅ 탈퇴 유저 — CLIENT 30, EXPERT 30 (사유 다양)`);

    const expertProfiles = await this.#seedExpertProfiles(
      experts,
      techStacks,
      serviceGroups,
      serviceCategories,
      [superAdmin, ...staffAdmins],
    );
    console.warn(
      `✅ 전문가 프로필/카테고리/기술스택 ${expertProfiles.length.toString()}개`,
    );

    await this.#seedClientProfiles(clients, serviceGroups, serviceCategories);
    console.warn(`✅ 클라이언트 프로필 ${clients.length.toString()}개`);

    const portfolios = await this.#seedPortfolios(expertProfiles);
    console.warn(
      `✅ 포트폴리오 ${portfolios.length.toString()}개 (이미지/스킬 포함)`,
    );

    const services = await this.#seedServices(
      experts,
      expertProfiles,
      techStacks,
      serviceGroups,
      serviceCategories,
    );
    console.warn(
      `✅ 서비스 ${services.length.toString()}개 (이미지/스텝/FAQ 포함)`,
    );

    const seededOrders = await this.#seedOrdersAndPayments(
      clients,
      services,
      superAdmin,
    );
    const testOrders = await this.#seedRefundTestPair(
      passwordHash,
      serviceGroups,
      serviceCategories,
      superAdmin,
    );
    console.warn(`✅ 주문/결제/리뷰/환불`);

    await this.#updateExpertRatings(experts);
    console.warn(`✅ 전문가 평점/리뷰수 집계 갱신`);

    await this.#seedFavorites(clients, experts, services);
    console.warn(`✅ 즐겨찾기`);

    await this.#seedRecentlyViewedServices(clients, services);
    console.warn(`✅ 최근 본 서비스 (CLIENT 전용)`);

    await this.#seedReports(clients, experts);
    const reportCount = await this.#prisma.report.count();
    console.warn(`✅ 신고 ${reportCount.toString()}건 (사유 6종 균등)`);

    await this.#seedCommunity(clients, experts, superAdmin);
    const postCount = await this.#prisma.communityPost.count();
    const commentCount = await this.#prisma.comment.count();
    const likeCount = await this.#prisma.like.count();
    console.warn(
      `✅ 게시판 ${postCount.toString()}건 (댓글 ${commentCount.toString()} / 좋아요 ${likeCount.toString()})`,
    );

    // 채팅방은 #seedOrdersAndPayments / 테스트 주문 시드에서 주문마다 생성·연결됨
    const chatRoomCount = await this.#prisma.chatRoom.count();
    const messageCount = await this.#prisma.message.count();
    console.warn(
      `✅ 1:1 채팅 ${chatRoomCount.toString()}방 (메시지 ${messageCount.toString()}) — 모든 주문에 연결`,
    );

    await this.#seedCsChatRooms(clients, superAdmin);
    console.warn(`✅ CS 채팅 25방 (OPEN 12 / ASSIGNED 8 / CLOSED 5)`);

    await this.#seedNotifications(clients, experts, [
      ...seededOrders,
      ...testOrders,
    ]);
    const notificationCount = await this.#prisma.notification.count();
    console.warn(`✅ 알림 ${notificationCount.toString()}건`);

    await this.#seedBanners();
    await this.#seedMainSettings(experts, services);
    await this.#seedFaqs();
    await this.#seedStatistics(experts, serviceGroups, serviceCategories);
    await this.#seedCategoryFeaturedServices(serviceGroups, services);
    await this.#seedAdminActivityLogs([superAdmin, ...staffAdmins]);
    console.warn(`✅ 배너/메인설정/FAQ/통계/카테고리추천/어드민로그`);

    const testServiceId = await this.#seedOrdersApiTestData();
    console.warn(`✅ Orders API 테스트 시드 (주문 10건 + 타인 주문 1건)`);

    await this.#seedAdminUserSubListTestData();
    console.warn(
      `✅ Admin User 하위 리스트 테스트 시드 (test 계정 각 reports/posts/comments 30건씩)`,
    );

    console.warn('\n────────────────────────────');
    console.warn(`🔑 테스트 계정 (공통 비밀번호: ${SEED_PASSWORD})`);
    console.warn(`   admin@moveit.com         (ADMIN)`);
    console.warn(`   client1~200@moveit.com    (CLIENT)`);
    console.warn(
      `   expert1~100@moveit.com   (EXPERT, expert1~8 신청 대기 / expert9~16 거절 / expert17~100 승인)`,
    );
    console.warn('');
    console.warn(`🧪 Orders API 테스트 (비밀번호: Test1234!)`);
    console.warn(`   client@test.com   (CLIENT)`);
    console.warn(`   expert@test.com   (EXPERT, 승인 완료)`);
    console.warn(`   other@test.com    (CLIENT, 403 검증용)`);
    console.warn(`   serviceId         ${testServiceId}`);
    console.warn('────────────────────────────');
    console.warn('✅ 시딩 완료');
  }

  // ─── 1. Reset ─────────────────────────────────────────────────────────
  async #resetDb(): Promise<void> {
    // 외래키 의존성 역순으로 삭제
    await this.#prisma.adminActivityLog.deleteMany();
    await this.#prisma.categoryFeaturedService.deleteMany();
    await this.#prisma.notification.deleteMany();
    await this.#prisma.mainSetting.deleteMany();
    await this.#prisma.banner.deleteMany();
    await this.#prisma.faq.deleteMany();
    await this.#prisma.statisticsByCategory.deleteMany();
    await this.#prisma.statisticsBySeller.deleteMany();
    await this.#prisma.csMessageAttachment.deleteMany();
    await this.#prisma.csChatRoom.updateMany({ data: { lastMessageId: null } });
    await this.#prisma.csMessage.deleteMany();
    await this.#prisma.csChatRoom.deleteMany();
    await this.#prisma.messageAttachment.deleteMany();
    await this.#prisma.chatRoom.updateMany({ data: { lastMessageId: null } });
    await this.#prisma.chatParticipant.deleteMany();
    await this.#prisma.message.deleteMany();
    await this.#prisma.chatRoom.deleteMany();
    await this.#prisma.like.deleteMany();
    await this.#prisma.comment.deleteMany();
    await this.#prisma.communityPost.deleteMany();
    await this.#prisma.reportImage.deleteMany();
    await this.#prisma.report.deleteMany();
    await this.#prisma.favoriteService.deleteMany();
    await this.#prisma.favoriteExpert.deleteMany();
    await this.#prisma.recentlyViewedService.deleteMany();
    await this.#prisma.review.deleteMany();
    await this.#prisma.refund.deleteMany();
    await this.#prisma.payment.deleteMany();
    await this.#prisma.order.deleteMany();
    await this.#prisma.serviceFaq.deleteMany();
    await this.#prisma.serviceStep.deleteMany();
    await this.#prisma.serviceImage.deleteMany();
    await this.#prisma.serviceTechStack.deleteMany();
    await this.#prisma.service.deleteMany();
    await this.#prisma.portfolioSkill.deleteMany();
    await this.#prisma.portfolioImage.deleteMany();
    await this.#prisma.portfolio.deleteMany();
    await this.#prisma.expertTechStack.deleteMany();
    await this.#prisma.expertSpecialtyCategory.deleteMany();
    await this.#prisma.clientInterestCategory.deleteMany();
    await this.#prisma.expertProfile.deleteMany();
    await this.#prisma.clientProfile.deleteMany();
    await this.#prisma.serviceCategory.deleteMany();
    await this.#prisma.serviceGroup.deleteMany();
    await this.#prisma.techStack.deleteMany();
    await this.#prisma.admin.deleteMany();
    await this.#prisma.user.deleteMany();
  }

  // ─── 2. 카탈로그 ──────────────────────────────────────────────────────
  async #seedCatalogs(): Promise<{
    techStacks: { id: string; name: TechStackName }[];
    serviceGroups: { id: string; name: ServiceGroupName }[];
    serviceCategories: { id: string; name: ServiceCategoryName }[];
  }> {
    const techStackNames = Object.values(TechStackName);
    const techStacks = await Promise.all(
      techStackNames.map((name) =>
        this.#prisma.techStack.create({
          data: { name },
          select: { id: true, name: true },
        }),
      ),
    );

    const serviceGroupNames = Object.values(ServiceGroupName);
    const serviceGroups = await Promise.all(
      serviceGroupNames.map((name) =>
        this.#prisma.serviceGroup.create({
          data: { name },
          select: { id: true, name: true },
        }),
      ),
    );

    const serviceCategoryNames = Object.values(ServiceCategoryName);
    const serviceCategories = await Promise.all(
      serviceCategoryNames.map((name) =>
        this.#prisma.serviceCategory.create({
          data: { name },
          select: { id: true, name: true },
        }),
      ),
    );

    return { techStacks, serviceGroups, serviceCategories };
  }

  // ─── 3. Admin ─────────────────────────────────────────────────────────
  async #seedAdmins(
    passwordHash: string,
  ): Promise<{ superAdmin: Admin; staffAdmins: Admin[] }> {
    // 최고 관리자 1명
    const superAdmin = await this.#prisma.admin.create({
      data: {
        email: 'admin@moveit.com',
        password: passwordHash,
        name: '무빗 최고관리자',
        isSuper: true,
        mustChangePassword: false,
        lastLoginAt: new Date(),
      },
    });

    // 직원 5명 (그 중 2명은 한 번도 로그인 안 한 상태 — 임시 비번 미변경)
    const staffAdmins = await Promise.all(
      range(5).map((i) => {
        const hasLoggedIn = i < 3; // 앞 3명은 로그인 + 비번 변경 완료, 뒤 2명은 신규
        return this.#prisma.admin.create({
          data: {
            email: `staff${(i + 1).toString()}@moveit.com`,
            password: passwordHash,
            name: `무빗 직원${(i + 1).toString()}`,
            isSuper: false,
            mustChangePassword: !hasLoggedIn,
            lastLoginAt: hasLoggedIn ? faker.date.recent({ days: 30 }) : null,
          },
        });
      }),
    );

    return { superAdmin, staffAdmins };
  }

  // ─── 4. Users ─────────────────────────────────────────────────────────
  async #seedUsers(
    passwordHash: string,
  ): Promise<{ clients: User[]; experts: User[] }> {
    const regions = Object.values(Region);

    const providers = Object.values(AuthProvider);
    // client1·expert1은 LOCAL 고정(이메일 로그인 테스트 보장), 나머지는 4종 provider 랜덤
    const resolveProvider = (i: number): AuthProvider =>
      i === 0 ? AuthProvider.LOCAL : pick(providers);

    const clients = await Promise.all(
      range(200).map((i) => {
        const provider = resolveProvider(i);
        const isLocal = provider === AuthProvider.LOCAL;
        return this.#prisma.user.create({
          data: {
            email: `client${(i + 1).toString()}@moveit.com`,
            name: `${faker.person.lastName()}${faker.person.firstName()}`,
            password: isLocal ? passwordHash : null,
            provider,
            providerId: isLocal ? null : faker.string.numeric(15),
            role: Role.CLIENT,
            profileImageUrl: pickProfileImage(),
            region: pick(regions),
            phoneNumber: faker.phone.number(),
            createdAt: faker.date.past({ years: 2 }),
          },
        });
      }),
    );

    const experts = await Promise.all(
      range(100).map((i) => {
        const provider = resolveProvider(i);
        const isLocal = provider === AuthProvider.LOCAL;
        return this.#prisma.user.create({
          data: {
            email: `expert${(i + 1).toString()}@moveit.com`,
            name: `${faker.person.lastName()}${faker.person.firstName()}`,
            password: isLocal ? passwordHash : null,
            provider,
            providerId: isLocal ? null : faker.string.numeric(15),
            role: Role.EXPERT,
            profileImageUrl: pickProfileImage(),
            region: pick(regions),
            phoneNumber: faker.phone.number(),
            bankName: pick([
              '국민',
              '신한',
              '우리',
              '하나',
              '카카오뱅크',
              '농협',
              'IBK기업',
              'SC제일',
              '토스뱅크',
            ]),
            bankAccount: faker.finance.accountNumber(),
            createdAt: faker.date.past({ years: 2 }),
          },
        });
      }),
    );

    return { clients, experts };
  }

  // ─── 4-b. 탈퇴 유저 (탈퇴유저 페이지 시드) ────────────────────────────────
  async #seedWithdrawnUsers(passwordHash: string): Promise<void> {
    const regions = Object.values(Region);
    const providers = Object.values(AuthProvider);

    // 길이 다양 — 짧음 / 중간 / 매우 김 / null(미입력) 섞기
    const DELETION_REASONS: (string | null)[] = [
      '서비스를 더 이상 사용하지 않습니다.',
      '비슷한 다른 서비스를 이용 중입니다.',
      '개인정보 보호 차원에서 탈퇴합니다.',
      '계정을 잠시 사용하지 않을 예정입니다.',
      '원하는 서비스를 찾기 어려웠습니다.',
      '가격이 부담스럽습니다.',
      '플랫폼 사용법이 어려워서 탈퇴합니다.',
      '거래 중 문제가 있어서 탈퇴합니다.',
      '앱이 자주 느려져서 탈퇴합니다.',
      '알림이 너무 많이 와서 탈퇴합니다.',
      null,
      null,
      '한 번 탈퇴 후 다시 가입할지 고민 중입니다. 잠시 보류하려고 합니다.',
      '본 서비스의 정책에 동의할 수 없는 부분이 있어 탈퇴합니다. 특히 데이터 활용 정책 및 마케팅 동의 관련 부분에서 우려되는 점이 있어 검토 후 재가입을 고려해보겠습니다.',
      '오랜 기간 서비스를 사용하면서 여러 가지 불편한 점들을 경험했습니다. 처음에는 단순한 문제들이라 생각하고 넘겼지만, 시간이 지날수록 누적되어 결국 결정을 내리게 되었습니다. 우선 매칭 시스템이 기대했던 만큼 정확하지 않았고, 응답 속도도 느린 편이었습니다. 또한 결제 과정에서 자주 오류가 발생했고, 환불 처리가 지연되는 경우가 많았습니다. 고객센터에 문의를 해도 해결까지 며칠씩 걸렸으며, 같은 문제가 반복적으로 발생했습니다. 무엇보다 거래 상대방과의 분쟁 조정 절차가 명확하지 않아 불안감이 컸습니다. 이러한 이유들로 인해 다른 플랫폼을 알아보게 되었고, 최종적으로 탈퇴를 결정하게 되었습니다. 그동안 이용해 주신 점 감사드립니다.',
      '탈퇴사유입니다.탈퇴사유입니다.탈퇴사유입니다.탈퇴사유입니다.탈퇴사유입니다.탈퇴사유입니다.탈퇴사유입니다.탈퇴사유입니다.탈퇴사유입니다.탈퇴사유입니다.탈퇴사유입니다.탈퇴사유입니다.탈퇴사유입니다.탈퇴사유입니다.',
    ];

    const createWithdrawn = (i: number, role: Role) => {
      const provider = pick(providers);
      const isLocal = provider === AuthProvider.LOCAL;
      const createdAt = faker.date.past({ years: 3 });
      const deletedAt = faker.date.between({ from: createdAt, to: new Date() });
      const isClient = role === Role.CLIENT;
      const namePrefix = isClient ? '탈퇴클라이언트' : '탈퇴전문가';
      const emailPrefix = isClient ? 'withdrawn_client' : 'withdrawn_expert';
      const suffix = (i + 1).toString();

      return this.#prisma.user.create({
        data: {
          email: `${emailPrefix}${suffix}@moveit.com`,
          name: `${namePrefix}${suffix}`,
          password: isLocal ? passwordHash : null,
          provider,
          providerId: isLocal ? null : faker.string.numeric(15),
          role,
          region: pick(regions),
          phoneNumber: faker.phone.number(),
          isDeleted: true,
          deletedAt,
          deletionReason: pick(DELETION_REASONS),
          createdAt,
        },
      });
    };

    await Promise.all(range(30).map((i) => createWithdrawn(i, Role.CLIENT)));
    await Promise.all(range(30).map((i) => createWithdrawn(i, Role.EXPERT)));
  }

  // ─── 5. ExpertProfile + 매핑 ──────────────────────────────────────────
  async #seedExpertProfiles(
    experts: User[],
    techStacks: { id: string; name: TechStackName }[],
    serviceGroups: { id: string; name: ServiceGroupName }[],
    serviceCategories: { id: string; name: ServiceCategoryName }[],
    admins: Admin[],
  ): Promise<ExpertProfile[]> {
    const profiles: ExpertProfile[] = [];

    // 전문가 상태 분포 (UI 검증용 — 모든 상태 보장)
    // index 0~7 (expert1~8): 신청 대기 (isApplied=true, isApproved=false, rejectedAt=null)
    // index 8~15 (expert9~16): 승인 거절 (isApplied=true, isApproved=false, rejectedAt+rejectReason)
    // index 16~99 (expert17~100): 승인 완료 (isApproved=true)
    const PENDING_COUNT = 8;
    const REJECTED_COUNT = 8;
    const REJECT_REASONS = [
      '사업자등록증 정보가 부족합니다.',
      '제출하신 포트폴리오가 가이드라인에 부합하지 않습니다.',
      '본인 확인이 어려워 거절되었습니다.',
      '회사 정보 검증에 실패했습니다.',
      '포트폴리오 이미지에 저작권 문제가 의심됩니다.',
      '제공해 주신 사업자 번호가 유효하지 않습니다.',
      '활동 기간이 기준에 미달합니다.',
      '제출 서류의 진위 확인이 어려워 거절되었습니다.',
    ];

    for (const [index, expert] of experts.entries()) {
      const isPending = index < PENDING_COUNT;
      const isRejected = !isPending && index < PENDING_COUNT + REJECTED_COUNT;
      const isApproved = !isPending && !isRejected;

      const profile = await this.#prisma.expertProfile.create({
        data: {
          userId: expert.id,
          isApplied: true,
          appliedAt: faker.date.recent({ days: 90 }),
          isApproved,
          approvedAt: isApproved ? faker.date.recent({ days: 60 }) : null,
          approvedByAdminId: isApproved ? pick(admins).id : null,
          rejectedAt: isRejected ? faker.date.recent({ days: 30 }) : null,
          rejectReason: isRejected
            ? (REJECT_REASONS[index - PENDING_COUNT] ?? REJECT_REASONS[0]!)
            : null,
          businessName: faker.company.name(),
          businessNumber: String(index + 1).padStart(10, '0'),
          ceoName: expert.name ?? faker.person.fullName(),
          contactTimeStart: '10:00',
          contactTimeEnd: '19:00',
          foundedYear: rand(2010, 2024) * 100 + rand(1, 12),
          employeeMin: rand(1, 10),
          employeeMax: rand(11, 50),
          description: faker.lorem.paragraphs(2),
        },
      });
      profiles.push(profile);

      // 전문 분야: 그룹 1개 고정 + 그 안에서 카테고리 1~3개 (UI 상한 + MIXED_SERVICE_GROUP 정책 준수)
      const pickedGroup = pick(serviceGroups);
      const pickedCategories = shuffle(serviceCategories).slice(0, rand(2, 3));
      for (const pickedCategory of pickedCategories) {
        await this.#prisma.expertSpecialtyCategory.create({
          data: {
            expertProfileId: profile.id,
            serviceGroupId: pickedGroup.id,
            serviceCategoryId: pickedCategory.id,
          },
        });
      }

      // 기술 스택 (각 EXPERT마다 3~5개)
      const pickedTechs = shuffle(techStacks).slice(0, rand(3, 5));
      for (const tech of pickedTechs) {
        await this.#prisma.expertTechStack.create({
          data: { expertProfileId: profile.id, techStackId: tech.id },
        });
      }
    }

    return profiles;
  }

  // ─── 6. ClientProfile + 관심 카테고리 ─────────────────────────────────
  async #seedClientProfiles(
    clients: User[],
    serviceGroups: { id: string; name: ServiceGroupName }[],
    serviceCategories: { id: string; name: ServiceCategoryName }[],
  ): Promise<void> {
    for (const client of clients) {
      const profile = await this.#prisma.clientProfile.create({
        data: {
          userId: client.id,
          nickname: `${faker.person.lastName()}${faker.person.firstName()}`,
        },
      });

      // 관심 분야: 그룹 1개 고정 + 그 안에서 카테고리 1~3개 (UI 상한 3 + MIXED_SERVICE_GROUP 정책 준수)
      const pickedGroup = pick(serviceGroups);
      const pickedCategories = shuffle(serviceCategories).slice(0, rand(2, 3));
      for (const pickedCategory of pickedCategories) {
        await this.#prisma.clientInterestCategory.create({
          data: {
            clientProfileId: profile.id,
            serviceGroupId: pickedGroup.id,
            serviceCategoryId: pickedCategory.id,
          },
        });
      }
    }
  }

  // ─── 7. Portfolio + 이미지 + 스킬 ─────────────────────────────────────
  async #seedPortfolios(expertProfiles: ExpertProfile[]): Promise<Portfolio[]> {
    const portfolios: Portfolio[] = [];
    const businessSectors = Object.values(BusinessSector);
    const stackTypes = Object.values(StackType);
    const techStackNames = Object.values(TechStackName);

    for (const profile of expertProfiles) {
      // 승인 전문가: 5~10개 / 신청 대기: 1~3개 (제출은 했지만 검토 중) / 거절: 0~2개
      const count = profile.isApproved
        ? rand(5, 10)
        : profile.rejectedAt
          ? rand(0, 2)
          : rand(1, 3);
      for (let i = 0; i < count; i++) {
        const portfolio = await this.#prisma.portfolio.create({
          data: {
            expertProfileId: profile.id,
            title: pick(PORTFOLIO_TITLES),
            description: pick(PORTFOLIO_DESCRIPTIONS),
            clientName: pick(PORTFOLIO_CLIENTS),
            businessSector: pick(businessSectors),
          },
        });
        portfolios.push(portfolio);

        // 이미지 4~12장 (썸네일 1 + 상세 3~11)
        const imageCount = rand(4, 12);
        await this.#prisma.portfolioImage.createMany({
          data: range(imageCount).map((idx) => ({
            portfolioId: portfolio.id,
            imgUrl: pickImage(),
            isMain: idx === 0,
          })),
        });

        // 스킬 3~6개 — 중복 방지를 위해 shuffle + slice
        const pickedNames = shuffle(techStackNames).slice(0, rand(3, 6));
        await this.#prisma.portfolioSkill.createMany({
          data: pickedNames.map((stackName) => ({
            portfolioId: portfolio.id,
            stackName,
            stackType: pick(stackTypes),
          })),
        });
      }
    }

    return portfolios;
  }

  // ─── 8. Service + TechStack + 이미지 + 스텝 + FAQ ─────────────────────
  async #seedServices(
    experts: User[],
    expertProfiles: ExpertProfile[],
    techStacks: { id: string; name: TechStackName }[],
    serviceGroups: { id: string; name: ServiceGroupName }[],
    serviceCategories: { id: string; name: ServiceCategoryName }[],
  ): Promise<Service[]> {
    const services: Service[] = [];

    // UI 테스트용 보장 케이스 — 첫 4명 승인 전문가에 고정 분배
    const projectGroupId = serviceGroups.find(
      (g) => g.name === ServiceGroupName.PROJECT_REQUEST,
    )?.id;
    const coachingGroupId = serviceGroups.find(
      (g) => g.name === ServiceGroupName.IT_COACHING,
    )?.id;
    if (!projectGroupId || !coachingGroupId) {
      throw new Error(
        '필수 ServiceGroup(IT_COACHING, PROJECT_REQUEST)이 시드 단계에 없습니다',
      );
    }
    const guaranteedPlan = [
      { count: 30, groupId: projectGroupId, status: ServiceStatus.ACTIVE },
      { count: 30, groupId: coachingGroupId, status: ServiceStatus.ACTIVE },
      { count: 10, groupId: projectGroupId, status: ServiceStatus.ACTIVE },
      { count: 10, groupId: coachingGroupId, status: ServiceStatus.ACTIVE },
    ];
    let guaranteedIndex = 0;

    for (const expert of experts) {
      const profile = expertProfiles.find((p) => p.userId === expert.id);
      if (!profile) continue;
      if (!profile.isApproved) continue;

      const guaranteed = guaranteedPlan[guaranteedIndex];
      if (guaranteed) guaranteedIndex++;
      const count = guaranteed?.count ?? rand(8, 22);

      for (let i = 0; i < count; i++) {
        const serviceGroupId = guaranteed?.groupId ?? pick(serviceGroups).id;
        const isCoaching = serviceGroupId === coachingGroupId;
        const titlePool = isCoaching
          ? SERVICE_TITLES_COACHING
          : SERVICE_TITLES_PROJECT;
        const descriptionPool = isCoaching
          ? SERVICE_DESCRIPTIONS_COACHING
          : SERVICE_DESCRIPTIONS_PROJECT;
        const faqPool = isCoaching
          ? FAQ_TEMPLATES_COACHING
          : FAQ_TEMPLATES_PROJECT;

        const service = await this.#prisma.service.create({
          data: {
            expertUserId: expert.id,
            title: pick(titlePool),
            workDuration: rand(7, 90),
            revisionCount: rand(0, 10),
            serviceScope: pick(SERVICE_SCOPES),
            servicePrice: rand(5, 100) * 100_000,
            description: pick(descriptionPool),
            preparationNotes: pick(PREPARATION_NOTES),
            refundPolicy: pick(REFUND_POLICIES),
            status: guaranteed?.status ?? pickServiceStatus(),
            serviceGroupId,
            serviceCategoryId: pick(serviceCategories).id,
            createdAt: faker.date.past({ years: 1 }),
          },
        });
        services.push(service);

        // 기술 스택 (서비스마다 1~3개 — 최대 3개 제한)
        const pickedTechs = shuffle(techStacks).slice(0, rand(1, 3));
        await this.#prisma.serviceTechStack.createMany({
          data: pickedTechs.map((tech) => ({
            serviceId: service.id,
            techStackId: tech.id,
          })),
        });

        // 이미지 (썸네일 1 + 상세 3~7)
        const imageCount = rand(4, 8);
        await this.#prisma.serviceImage.createMany({
          data: range(imageCount).map((idx) => ({
            serviceId: service.id,
            imgUrl: pickImage(),
            isMain: idx === 0,
          })),
        });

        // 스텝 3개
        const pickedSteps = pick(SERVICE_STEPS);
        for (const [s, step] of pickedSteps.entries()) {
          await this.#prisma.serviceStep.create({
            data: {
              serviceId: service.id,
              title: step,
              description: faker.lorem.sentence(),
              order: s + 1,
            },
          });
        }

        // FAQ 3~4개
        const shuffledFaq = shuffle(faqPool).slice(0, rand(3, 4));
        await this.#prisma.serviceFaq.createMany({
          data: shuffledFaq.map((faq) => ({
            serviceId: service.id,
            question: faq.question,
            answer: faq.answer,
          })),
        });
      }
    }

    return services;
  }

  // ─── 8-b. 주문↔채팅방 게이트웨이 ──────────────────────────────────────
  // 같은 (client, expert, service) 조합은 방 1개를 공유. 처음 만들 때 참여자 +
  // 기본 메시지 흐름까지 채워 채팅 진입/목록 노출이 보장되게 한다.
  async #getOrCreateOrderRoom(
    clientId: string,
    expertId: string,
    serviceId: string,
    orderId: string,
  ): Promise<string> {
    const key = `${clientId}-${expertId}-${serviceId}`;
    const cached = this.#roomCache.get(key);
    if (cached) return cached;

    const room = await this.#prisma.chatRoom.create({
      data: {
        clientUserId: clientId,
        expertUserId: expertId,
        currentServiceId: serviceId,
        createdAt: faker.date.recent({ days: 60 }),
      },
    });
    await this.#prisma.chatParticipant.createMany({
      data: [
        { chatRoomId: room.id, userId: clientId },
        { chatRoomId: room.id, userId: expertId },
      ],
    });

    let lastMessageId: string | null = null;
    const addSystem = async (systemType: SystemMessageType): Promise<void> => {
      const message = await this.#prisma.message.create({
        data: {
          chatRoomId: room.id,
          type: MessageType.SYSTEM,
          systemType,
          content: SYSTEM_MESSAGE_CONTENT[systemType],
          orderId,
        },
      });
      lastMessageId = message.id;
    };
    const addLines = async (lines: ChatLine[]): Promise<void> => {
      for (const line of lines) {
        const message = await this.#prisma.message.create({
          data: {
            chatRoomId: room.id,
            senderId: line.sender === 'client' ? clientId : expertId,
            type: MessageType.TEXT,
            content: line.text,
          },
        });
        lastMessageId = message.id;
      }
    };

    // 절반은 '거래요청 → 협의' 단계부터, 나머지는 결제 흐름부터
    if (Math.random() < 0.5) {
      await addSystem(SystemMessageType.TRADE_REQUEST);
      await addLines(pick(CHAT_INTRO_SCRIPTS));
    }
    await addSystem(SystemMessageType.PAYMENT_COMPLETED);
    await addSystem(SystemMessageType.PAYMENT_HELD);
    await addSystem(SystemMessageType.SCHEDULE_REQUEST);
    await addLines(pick(CHAT_BODY_SCRIPTS));
    await addLines(pick(CHAT_CLOSING_SCRIPTS));

    await this.#prisma.chatRoom.update({
      where: { id: room.id },
      data: { lastMessageId },
    });

    this.#roomCache.set(key, room.id);
    return room.id;
  }

  // ─── 9. Order + Payment + Review + Refund ─────────────────────────────
  // 14가지 시나리오로 약 600개 주문 생성 — 각 환불/취소 흐름 풀 커버 + 운영급 분포
  async #seedOrdersAndPayments(
    clients: User[],
    services: Service[],
    admin: Admin,
  ): Promise<SeededOrderInfo[]> {
    const orderPlan: ScenarioPlan[] = [
      // 1. NEGOTIATING — 결제 직후, 협의 중
      ...range(50).map(() => ({ status: OrderStatus.NEGOTIATING })),
      // 2. NEGOTIATING + REJECTED(CANCEL) — 취소 거절 후 복귀 (재요청 가능)
      ...range(15).map(() => ({
        status: OrderStatus.NEGOTIATING,
        refund: { type: RefundType.CANCEL, status: RefundStatus.REJECTED },
      })),
      // 3. CANCEL_REQUESTED — 전문가 승인/거절 대기 중
      ...range(50).map(() => ({
        status: OrderStatus.CANCEL_REQUESTED,
        refund: { type: RefundType.CANCEL, status: RefundStatus.REQUESTED },
      })),
      // 4. PAYMENT_CANCELLED — 취소 완료 (전문가 18 + 어드민 18)
      ...range(18).map(() => ({
        status: OrderStatus.PAYMENT_CANCELLED,
        refund: {
          type: RefundType.CANCEL,
          status: RefundStatus.COMPLETED,
          approvedBy: 'expert' as const,
        },
      })),
      ...range(18).map(() => ({
        status: OrderStatus.PAYMENT_CANCELLED,
        refund: {
          type: RefundType.CANCEL,
          status: RefundStatus.COMPLETED,
          approvedBy: 'admin' as const,
        },
      })),
      // 5. IN_PROGRESS — 작업 진행 중
      ...range(80).map(() => ({ status: OrderStatus.IN_PROGRESS })),
      // 6. DEADLINE_IMMINENT — 마감 임박
      ...range(50).map(() => ({ status: OrderStatus.DEADLINE_IMMINENT })),
      // 7. EXPIRED — 기한 만료, 환불 요청 전
      ...range(35).map(() => ({ status: OrderStatus.EXPIRED })),
      // 8. EXPIRED + REJECTED(REFUND) — 환불 거절 후 복귀 (재요청 가능)
      ...range(18).map(() => ({
        status: OrderStatus.EXPIRED,
        refund: { type: RefundType.REFUND, status: RefundStatus.REJECTED },
      })),
      // 9. REFUND_REQUESTED — 환불 요청 진행 중 (PR-B 취소 가능)
      ...range(50).map(() => ({
        status: OrderStatus.REFUND_REQUESTED,
        refund: { type: RefundType.REFUND, status: RefundStatus.REQUESTED },
      })),
      // 10. REFUND_COMPLETED — 환불 완료 (전문가 18 + 어드민 18)
      ...range(18).map(() => ({
        status: OrderStatus.REFUND_COMPLETED,
        refund: {
          type: RefundType.REFUND,
          status: RefundStatus.COMPLETED,
          approvedBy: 'expert' as const,
        },
      })),
      ...range(18).map(() => ({
        status: OrderStatus.REFUND_COMPLETED,
        refund: {
          type: RefundType.REFUND,
          status: RefundStatus.COMPLETED,
          approvedBy: 'admin' as const,
        },
      })),
      // 11. WORK_COMPLETED — 작업 완료, 구매확정 대기
      ...range(40).map(() => ({ status: OrderStatus.WORK_COMPLETED })),
      // 12. PURCHASE_CONFIRMED — 구매확정
      ...range(35).map(() => ({ status: OrderStatus.PURCHASE_CONFIRMED })),
      // 13. SETTLEMENT_REQUESTED — 정산 요청
      ...range(50).map(() => ({ status: OrderStatus.SETTLEMENT_REQUESTED })),
      // 14. SETTLEMENT_COMPLETED — 정산 완료
      ...range(35).map(() => ({ status: OrderStatus.SETTLEMENT_COMPLETED })),
    ];

    const seededOrders: SeededOrderInfo[] = [];
    const adminReasons = [
      '업체 일정 만료로 인해 전액환불',
      '결제 잘못하여 취소하였다고 함',
      '서비스 진행 어려움',
      '연락 두절',
    ];

    const usedClientServicePairs = new Set<string>();
    for (const plan of orderPlan) {
      const { status } = plan;
      // 한 유저는 한 서비스에 한 번만 문의/주문 → (client, service) 유일 보장
      let client = pick(clients);
      let service = pick(services);
      while (usedClientServicePairs.has(`${client.id}-${service.id}`)) {
        client = pick(clients);
        service = pick(services);
      }
      usedClientServicePairs.add(`${client.id}-${service.id}`);
      const isConfirmed =
        status === OrderStatus.PURCHASE_CONFIRMED ||
        status === OrderStatus.SETTLEMENT_REQUESTED ||
        status === OrderStatus.SETTLEMENT_COMPLETED;
      const isSettled = status === OrderStatus.SETTLEMENT_COMPLETED;
      const platformFee = Math.floor(service.servicePrice * 0.1);

      const order = await this.#prisma.order.create({
        data: {
          clientUserId: client.id,
          expertUserId: service.expertUserId,
          serviceId: service.id,
          agreedServicePrice: service.servicePrice,
          platformFee,
          totalAmount: service.servicePrice + platformFee,
          status,
          startDate: faker.date.recent({ days: 30 }),
          endDate:
            status === OrderStatus.NEGOTIATING
              ? null
              : faker.date.soon({ days: 30 }),
          confirmedAt: isConfirmed ? faker.date.recent({ days: 30 }) : null,
          settledAt: isSettled ? faker.date.recent({ days: 10 }) : null,
          settledByAdminId: isSettled ? admin.id : null,
        },
      });

      const payment = await this.#prisma.payment.create({
        data: {
          orderId: order.id,
          clientUserId: client.id,
          paidAmount: order.totalAmount,
          status:
            status === OrderStatus.PAYMENT_CANCELLED
              ? PaymentStatus.CANCELLED
              : status === OrderStatus.REFUND_COMPLETED
                ? PaymentStatus.REFUNDED
                : PaymentStatus.PAID,
          method: pick([
            '신용카드 롯데',
            '신용카드 신한',
            '신용카드 KB국민',
            '신용카드 삼성',
            '신용카드 현대',
            '신용카드 하나',
          ]),
          installmentMonths: pick([1, 1, 1, 1, 2, 3, 6, 12]),
          paymentKey: faker.string.uuid(),
          rawData: { provider: 'toss', mock: true },
          approvedAt: new Date(),
        },
      });

      // 구매확정 이후 단계는 리뷰 작성 가능
      if (isConfirmed) {
        await this.#prisma.review.create({
          data: {
            orderId: order.id,
            userId: client.id,
            rating: rand(3, 5),
            content: faker.lorem.paragraph(),
          },
        });
      }

      if (plan.refund) {
        const { type, status: refundStatus, approvedBy } = plan.refund;
        const isCompleted = refundStatus === RefundStatus.COMPLETED;
        const isAdminApproved = approvedBy === 'admin';

        await this.#prisma.refund.create({
          data: {
            paymentId: payment.id,
            clientUserId: client.id,
            expertUserId: service.expertUserId,
            refundAmount: order.totalAmount,
            type,
            status: refundStatus,
            adminReason: isAdminApproved ? pick(adminReasons) : null,
            approvedAdminId: isAdminApproved ? admin.id : null,
            requestedAt: new Date(),
            approvedAt: isCompleted ? new Date() : null,
            refundedAt: isCompleted ? new Date() : null,
            paymentKey: payment.paymentKey,
            rawData: { provider: 'toss', mock: true },
          },
        });
      }

      const roomId = await this.#getOrCreateOrderRoom(
        client.id,
        service.expertUserId,
        service.id,
        order.id,
      );
      await this.#prisma.order.update({
        where: { id: order.id },
        data: { chatRoomId: roomId },
      });

      seededOrders.push({
        orderId: order.id,
        clientUserId: client.id,
        expertUserId: service.expertUserId,
        serviceTitle: service.title,
        status,
        refundType: plan.refund?.type,
        refundStatus: plan.refund?.status,
        approvedBy: plan.refund?.approvedBy,
      });
    }

    return seededOrders;
  }

  // ─── 9-b. 환불/취소 테스트 전용 페어 (LOCAL, 비번 SEED_PASSWORD) ──────
  // client_test@moveit.com + expert_test@moveit.com 이 같은 서비스로 묶임
  async #seedRefundTestPair(
    passwordHash: string,
    serviceGroups: { id: string; name: ServiceGroupName }[],
    serviceCategories: { id: string; name: ServiceCategoryName }[],
    admin: Admin,
  ): Promise<SeededOrderInfo[]> {
    const clientTest = await this.#prisma.user.create({
      data: {
        email: 'client_test@moveit.com',
        name: '테스트 클라이언트',
        password: passwordHash,
        provider: AuthProvider.LOCAL,
        role: Role.CLIENT,
        profileImageUrl: pickProfileImage(),
        region: Region.SEOUL,
        phoneNumber: faker.phone.number(),
      },
    });
    await this.#prisma.clientProfile.create({
      data: { userId: clientTest.id, nickname: 'test-client' },
    });

    const expertTest = await this.#prisma.user.create({
      data: {
        email: 'expert_test@moveit.com',
        name: '테스트 전문가',
        password: passwordHash,
        provider: AuthProvider.LOCAL,
        role: Role.EXPERT,
        profileImageUrl: pickProfileImage(),
        region: Region.SEOUL,
        phoneNumber: faker.phone.number(),
        bankName: '국민',
        bankAccount: faker.finance.accountNumber(),
      },
    });
    await this.#prisma.expertProfile.create({
      data: {
        userId: expertTest.id,
        isApplied: true,
        appliedAt: new Date(),
        isApproved: true,
        approvedAt: new Date(),
        approvedByAdminId: admin.id,
        businessName: '환불취소 테스트 사업체',
        businessNumber: '0000000101',
        ceoName: '테스트 대표',
        contactTimeStart: '10:00',
        contactTimeEnd: '19:00',
        foundedYear: 202_001,
        employeeMin: 1,
        employeeMax: 5,
        description: '환불/취소 테스트 전용 전문가입니다.',
      },
    });

    // 각 시나리오 충분히 — 테스트 귀신 모드 (한 시나리오에 3건씩)
    // 한 유저는 한 서비스에 한 번만 문의 가능 → 주문마다 별도 서비스 생성
    const testPlan: ScenarioPlan[] = [
      // 취소 요청 테스트용 (NEGOTIATING ×3)
      ...range(3).map(() => ({ status: OrderStatus.NEGOTIATING })),
      // 전문가 취소 승인/거절 테스트용 (CANCEL_REQUESTED ×3)
      ...range(3).map(() => ({
        status: OrderStatus.CANCEL_REQUESTED,
        refund: { type: RefundType.CANCEL, status: RefundStatus.REQUESTED },
      })),
      // 환불 요청 테스트용 (EXPIRED ×3)
      ...range(3).map(() => ({ status: OrderStatus.EXPIRED })),
      // 전문가 환불 승인/거절 + 클라이언트 환불 요청 취소 테스트용 (REFUND_REQUESTED ×3)
      ...range(3).map(() => ({
        status: OrderStatus.REFUND_REQUESTED,
        refund: { type: RefundType.REFUND, status: RefundStatus.REQUESTED },
      })),
    ];

    const seeded: SeededOrderInfo[] = [];

    for (const [i, plan] of testPlan.entries()) {
      const { status } = plan;
      const service = await this.#prisma.service.create({
        data: {
          expertUserId: expertTest.id,
          title: `환불·취소 테스트 서비스 ${(i + 1).toString()}`,
          workDuration: 30,
          revisionCount: 3,
          serviceScope: '환불/취소 흐름 검증용',
          servicePrice: 1_000_000,
          description: '환불·취소 API 테스트 전용 서비스입니다.',
          preparationNotes: '테스트 시나리오 진행 전 기획서를 준비해주세요.',
          refundPolicy:
            '작업 시작 전 100% 환불, 작업 중 50% 환불, 작업 완료 후 환불 불가',
          status: ServiceStatus.ACTIVE,
          serviceGroupId: serviceGroups[0]!.id,
          serviceCategoryId: serviceCategories[0]!.id,
        },
      });
      await this.#prisma.serviceImage.create({
        data: { serviceId: service.id, imgUrl: pickImage(), isMain: true },
      });
      const platformFee = Math.floor(service.servicePrice * 0.1);

      const order = await this.#prisma.order.create({
        data: {
          clientUserId: clientTest.id,
          expertUserId: expertTest.id,
          serviceId: service.id,
          agreedServicePrice: service.servicePrice,
          platformFee,
          totalAmount: service.servicePrice + platformFee,
          status,
          startDate: faker.date.recent({ days: 30 }),
          endDate:
            status === OrderStatus.NEGOTIATING
              ? null
              : faker.date.soon({ days: 30 }),
        },
      });

      const payment = await this.#prisma.payment.create({
        data: {
          orderId: order.id,
          clientUserId: clientTest.id,
          paidAmount: order.totalAmount,
          status: PaymentStatus.PAID,
          method: '신용카드 신한',
          installmentMonths: 1,
          paymentKey: faker.string.uuid(),
          rawData: { provider: 'toss', mock: true },
          approvedAt: new Date(),
        },
      });

      if (plan.refund) {
        await this.#prisma.refund.create({
          data: {
            paymentId: payment.id,
            clientUserId: clientTest.id,
            expertUserId: expertTest.id,
            refundAmount: order.totalAmount,
            type: plan.refund.type,
            status: plan.refund.status,
            requestedAt: new Date(),
            paymentKey: payment.paymentKey,
            rawData: { provider: 'toss', mock: true },
          },
        });
      }

      const roomId = await this.#getOrCreateOrderRoom(
        clientTest.id,
        expertTest.id,
        service.id,
        order.id,
      );
      await this.#prisma.order.update({
        where: { id: order.id },
        data: { chatRoomId: roomId },
      });

      seeded.push({
        orderId: order.id,
        clientUserId: clientTest.id,
        expertUserId: expertTest.id,
        serviceTitle: service.title,
        status,
        refundType: plan.refund?.type,
        refundStatus: plan.refund?.status,
      });
    }

    return seeded;
  }

  // ─── 9-2. Expert 평점/리뷰수 집계 ─────────────────────────────────────
  async #updateExpertRatings(experts: User[]): Promise<void> {
    for (const expert of experts) {
      const reviews = await this.#prisma.review.findMany({
        where: { order: { expertUserId: expert.id } },
        select: { rating: true },
      });
      if (reviews.length === 0) continue;

      const avgRating =
        reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

      await this.#prisma.expertProfile.update({
        where: { userId: expert.id },
        data: {
          avgRating,
          reviewCount: reviews.length,
        },
      });
    }
  }

  // ─── 10. Favorites ────────────────────────────────────────────────────
  async #seedFavorites(
    clients: User[],
    experts: User[],
    services: Service[],
  ): Promise<void> {
    const pairs = new Set<string>();
    for (let i = 0; i < 1500; i++) {
      const client = pick(clients);
      const service = pick(services);
      const key = `${client.id}-${service.id}`;
      if (pairs.has(key)) continue;
      pairs.add(key);
      await this.#prisma.favoriteService.create({
        data: {
          clientUserId: client.id,
          serviceId: service.id,
          createdAt: faker.date.recent({ days: 90 }),
        },
      });
    }

    const expertPairs = new Set<string>();
    for (let i = 0; i < 500; i++) {
      const client = pick(clients);
      const expert = pick(experts);
      const key = `${client.id}-${expert.id}`;
      if (expertPairs.has(key)) continue;
      expertPairs.add(key);
      await this.#prisma.favoriteExpert.create({
        data: {
          clientUserId: client.id,
          expertUserId: expert.id,
          createdAt: faker.date.recent({ days: 90 }),
        },
      });
    }
  }

  // ─── 10-2. Recently Viewed Services (CLIENT 전용) ─────────────────────
  async #seedRecentlyViewedServices(
    clients: User[],
    services: Service[],
  ): Promise<void> {
    const pairs = new Set<string>();
    for (let i = 0; i < 3000; i++) {
      const client = pick(clients);
      const service = pick(services);
      const key = `${client.id}-${service.id}`;
      if (pairs.has(key)) continue;
      pairs.add(key);
      await this.#prisma.recentlyViewedService.create({
        data: {
          clientUserId: client.id,
          serviceId: service.id,
          viewedAt: faker.date.recent({ days: 30 }),
        },
      });
    }
  }

  // ─── 11. Reports + 증거 이미지 ───────────────────────────────────────
  async #seedReports(clients: User[], experts: User[]): Promise<void> {
    // 150건 — 60 PENDING(처리 대기) + 90 COMPLETED(처리 완료)
    // 사유 6종 균등 분배 (각 25건)
    const total = 150;
    const pendingCount = 60;
    for (let i = 0; i < total; i++) {
      const isPending = i < pendingCount;
      const reason = REPORT_REASONS[i % REPORT_REASONS.length]!;
      const report = await this.#prisma.report.create({
        data: {
          reporterId: pick(clients).id,
          reportedId: pick(experts).id,
          reason,
          status: isPending ? ReportStatus.PENDING : ReportStatus.COMPLETED,
          detail: faker.lorem.paragraph(),
          createdAt: faker.date.recent({ days: 90 }),
        },
      });

      // 증거 이미지 1~3장
      const imageCount = rand(1, 3);
      await this.#prisma.reportImage.createMany({
        data: range(imageCount).map(() => ({
          reportsId: report.id,
          imageUrl: pickImage(),
        })),
      });
    }
  }

  // ─── 12. Community ────────────────────────────────────────────────────
  async #seedCommunity(
    clients: User[],
    experts: User[],
    admin: Admin,
  ): Promise<void> {
    const categories = Object.values(CommunityCategory);
    const allUsers = [...clients, ...experts];

    // 관리자 댓글 삭제 사유 후보 (다양한 케이스 검증용)
    const ADMIN_COMMENT_DELETE_REASONS = [
      '욕설/비방',
      '외부 연락처 유도',
      '스팸/광고',
      '허위·과장 정보',
      '음란성 콘텐츠',
      '운영 정책 위반',
    ];

    for (let i = 0; i < 80; i++) {
      const author = pick(allUsers);
      // 카테고리 균등 분배
      const category = categories[i % categories.length]!;
      // 처음 10건은 인기 게시글 (높은 좋아요/댓글), 그 외는 일반
      const isPopular = i < 10;
      // 2건은 삭제됨 (인기 게시글 외에서)
      const isDeleted = i === 30 || i === 55;
      const post = await this.#prisma.communityPost.create({
        data: {
          userId: author.id,
          category,
          title: pick(COMMUNITY_POST_TITLES),
          content: pick(COMMUNITY_POST_CONTENTS),
          deletedAt: isDeleted ? new Date() : null,
          deleteReason: isDeleted ? '운영 정책 위반' : null,
          deletedByAdminId: isDeleted ? admin.id : null,
          createdAt: faker.date.recent({ days: 60 }),
        },
      });

      // 댓글: 인기 게시글은 20~40개, 일반은 0~10개
      const commentCount = isPopular ? rand(20, 40) : rand(0, 10);
      const createdComments: { id: string }[] = [];
      for (let c = 0; c < commentCount; c++) {
        // 약 1/6 확률로 관리자 삭제
        const isAdminDeleted = (i + c) % 6 === 0;
        const comment = await this.#prisma.comment.create({
          data: {
            postId: post.id,
            userId: pick(allUsers).id,
            content: pick(COMMENT_TEMPLATES),
            deletedAt: isAdminDeleted ? new Date() : null,
            deleteReason: isAdminDeleted
              ? pick(ADMIN_COMMENT_DELETE_REASONS)
              : null,
            deletedByAdminId: isAdminDeleted ? admin.id : null,
          },
        });
        createdComments.push({ id: comment.id });
      }

      // 대댓글 — 댓글의 30%에 1~3개씩
      for (const parent of createdComments) {
        if (Math.random() < 0.3) {
          const replyCount = rand(1, 3);
          for (let r = 0; r < replyCount; r++) {
            await this.#prisma.comment.create({
              data: {
                postId: post.id,
                userId: pick(allUsers).id,
                parentCommentId: parent.id,
                content: pick(REPLY_TEMPLATES),
              },
            });
          }
        }
      }

      // 좋아요: 인기 게시글 50~120명, 일반 0~15명
      const likers = shuffle(allUsers).slice(
        0,
        isPopular ? rand(50, 120) : rand(0, 15),
      );
      if (likers.length > 0) {
        await this.#prisma.like.createMany({
          data: likers.map((u) => ({ postId: post.id, userId: u.id })),
          skipDuplicates: true,
        });
      }
    }
  }

  // ─── 14. CS 채팅 ──────────────────────────────────────────────────────
  async #seedCsChatRooms(clients: User[], admin: Admin): Promise<void> {
    // 25건 — 12 OPEN(처리 대기) + 8 ASSIGNED + 5 CLOSED
    const statusPlan: CsChatStatus[] = [
      ...Array.from({ length: 12 }, () => CsChatStatus.OPEN),
      ...Array.from({ length: 8 }, () => CsChatStatus.ASSIGNED),
      ...Array.from({ length: 5 }, () => CsChatStatus.CLOSED),
    ];

    for (const status of statusPlan) {
      const client = pick(clients);
      const room = await this.#prisma.csChatRoom.create({
        data: {
          userId: client.id,
          assignedAdminId:
            status === CsChatStatus.ASSIGNED || status === CsChatStatus.CLOSED
              ? admin.id
              : null,
          status,
        },
      });

      // 메시지 3~6개
      const messageCount = rand(3, 6);
      let lastMessageId: string | null = null;
      for (let m = 0; m < messageCount; m++) {
        const fromUser = m % 2 === 0;
        const message = await this.#prisma.csMessage.create({
          data: {
            chatRoomId: room.id,
            senderType: fromUser ? SenderType.USER : SenderType.ADMIN,
            senderUserId: fromUser ? client.id : null,
            senderAdminId: fromUser ? null : admin.id,
            content: faker.lorem.sentence(),
            type: MessageType.TEXT,
          },
        });
        lastMessageId = message.id;
      }

      await this.#prisma.csChatRoom.update({
        where: { id: room.id },
        data: { lastMessageId },
      });
    }
  }

  // ─── 15. Notifications ────────────────────────────────────────────────
  // 시나리오별 정합성 알림 — 각 주문 흐름에 맞는 알림을 박아 알림함 테스트 보장
  async #seedNotifications(
    clients: User[],
    experts: User[],
    orders: SeededOrderInfo[],
  ): Promise<void> {
    const allUsers = [...clients, ...experts];
    const clientById = new Map(clients.map((c) => [c.id, c]));

    interface NotificationSeed {
      userId: string;
      category: NotificationCategory;
      vars: NotificationContentVars;
      referenceId: string;
    }

    const seeds: NotificationSeed[] = [];

    for (const order of orders) {
      const client = clientById.get(order.clientUserId);
      const vars: NotificationContentVars = {
        serviceTitle: order.serviceTitle,
        clientName: client?.name ?? '회원',
      };
      const cli = order.clientUserId;
      const exp = order.expertUserId;
      const push = (userId: string, category: NotificationCategory): void => {
        seeds.push({ userId, category, vars, referenceId: order.orderId });
      };

      // 모든 주문 공통: 결제 성공 + 새 주문
      push(cli, NotificationCategory.PAYMENT_SUCCESS);
      push(exp, NotificationCategory.ORDER_CREATED);

      // 시나리오별 알림
      switch (order.status) {
        case OrderStatus.NEGOTIATING: {
          if (order.refundStatus === RefundStatus.REJECTED) {
            push(cli, NotificationCategory.ORDER_CANCEL_REJECTED_BY_EXPERT);
          }
          break;
        }
        case OrderStatus.CANCEL_REQUESTED: {
          push(exp, NotificationCategory.ORDER_CANCEL_REQUESTED);
          push(cli, NotificationCategory.ORDER_CANCEL_REQUESTED_TO_CLIENT);
          break;
        }
        case OrderStatus.PAYMENT_CANCELLED: {
          if (order.approvedBy === 'admin') {
            push(cli, NotificationCategory.ORDER_CANCEL_APPROVED_BY_ADMIN);
            push(exp, NotificationCategory.ORDER_CANCEL_APPROVED_BY_ADMIN);
          } else {
            push(cli, NotificationCategory.ORDER_CANCEL_APPROVED_BY_EXPERT);
          }
          break;
        }
        case OrderStatus.IN_PROGRESS: {
          push(cli, NotificationCategory.SCHEDULE_REGISTERED);
          push(exp, NotificationCategory.SCHEDULE_REGISTERED);
          break;
        }
        case OrderStatus.DEADLINE_IMMINENT: {
          push(cli, NotificationCategory.DEADLINE_REMINDER);
          push(exp, NotificationCategory.DEADLINE_REMINDER);
          break;
        }
        case OrderStatus.EXPIRED: {
          push(cli, NotificationCategory.DEADLINE_EXPIRED);
          push(exp, NotificationCategory.DEADLINE_EXPIRED);
          if (order.refundStatus === RefundStatus.REJECTED) {
            push(cli, NotificationCategory.REFUND_REJECTED_BY_EXPERT);
          }
          break;
        }
        case OrderStatus.REFUND_REQUESTED: {
          push(exp, NotificationCategory.REFUND_REQUESTED);
          push(cli, NotificationCategory.REFUND_REQUESTED_TO_CLIENT);
          break;
        }
        case OrderStatus.REFUND_COMPLETED: {
          if (order.approvedBy === 'admin') {
            push(cli, NotificationCategory.REFUND_APPROVED_BY_ADMIN);
            push(exp, NotificationCategory.REFUND_APPROVED_BY_ADMIN);
          } else {
            push(cli, NotificationCategory.REFUND_APPROVED_BY_EXPERT);
          }
          break;
        }
        case OrderStatus.WORK_COMPLETED: {
          push(cli, NotificationCategory.WORK_COMPLETED);
          push(exp, NotificationCategory.PURCHASE_CONFIRM_PENDING);
          break;
        }
        case OrderStatus.PURCHASE_CONFIRMED: {
          push(exp, NotificationCategory.PURCHASE_CONFIRMED);
          break;
        }
        case OrderStatus.SETTLEMENT_REQUESTED: {
          push(exp, NotificationCategory.SETTLEMENT_REQUEST_REMINDER);
          break;
        }
        case OrderStatus.SETTLEMENT_COMPLETED: {
          push(exp, NotificationCategory.SETTLEMENT_DONE);
          break;
        }
      }
    }

    // 일반 알림 — 커뮤니티/계정/스케줄 양념 (30건)
    const generalCategories: NotificationCategory[] = [
      NotificationCategory.POST_COMMENT,
      NotificationCategory.POST_REPLY,
      NotificationCategory.POST_LIKE,
      NotificationCategory.EXPERT_APPROVED,
      NotificationCategory.SCHEDULE_REMINDER,
    ];
    for (const _i of range(30)) {
      const category = pick(generalCategories);
      seeds.push({
        userId: pick(allUsers).id,
        category,
        vars: {
          postTitle: faker.lorem.sentence(),
          rejectReason: '신원 확인 자료가 부족합니다',
        },
        referenceId: faker.string.uuid(),
      });
    }

    await this.#prisma.notification.createMany({
      data: seeds.map((s) => {
        const meta = NOTIFICATION_CATALOG[s.category];
        return {
          userId: s.userId,
          type: meta.type,
          category: s.category,
          content: meta.buildContent(s.vars),
          referenceType: meta.referenceType,
          referenceId: s.referenceId,
          isRead: Math.random() < 0.3,
        };
      }),
    });
  }

  // ─── 16. Banners ──────────────────────────────────────────────────────
  async #seedBanners(): Promise<void> {
    await this.#prisma.banner.createMany({
      data: BANNER_IMAGES.map((imageUrl, i) => ({
        imageUrl,
        actionUrl: `https://moveit.local/promo/${(i + 1).toString()}`,
      })),
    });
  }

  // ─── 17. MainSettings ─────────────────────────────────────────────────
  async #seedMainSettings(experts: User[], services: Service[]): Promise<void> {
    const PER_SECTION = 4;

    for (const sectionType of Object.values(MainSectionType)) {
      const isExpertSection =
        sectionType === MainSectionType.MOVEIT_POPULAR_COACHING ||
        sectionType === MainSectionType.MOVEIT_POPULAR_PROJECT_EXPERT;
      const targetType = isExpertSection
        ? MainTargetType.USER
        : MainTargetType.SERVICE;

      const targets = isExpertSection
        ? shuffle(experts).slice(0, PER_SECTION)
        : shuffle(services).slice(0, PER_SECTION);

      for (const target of targets) {
        await this.#prisma.mainSetting.create({
          data: {
            sectionType,
            targetType,
            targetUserId: isExpertSection ? target.id : null,
            targetServiceId: isExpertSection ? null : target.id,
          },
        });
      }
    }
  }

  // ─── 18. FAQs ─────────────────────────────────────────────────────────
  async #seedFaqs(): Promise<void> {
    const faqs = [
      {
        title: '서비스 이용 방법이 궁금해요',
        content: '회원가입 후 원하는 서비스를 검색해서 신청하시면 됩니다.',
      },
      {
        title: '결제는 어떻게 진행되나요?',
        content: '카드, 계좌이체, 간편결제를 지원합니다.',
      },
      {
        title: '환불 규정이 어떻게 되나요?',
        content: '서비스별 환불 정책을 참고해주세요.',
      },
      {
        title: '전문가로 활동하고 싶어요',
        content: '전문가 등록 페이지에서 신청 가능합니다.',
      },
      {
        title: '문의는 어디로 하나요?',
        content: 'CS 채팅으로 언제든 문의해주세요.',
      },
    ];
    await this.#prisma.faq.createMany({ data: faqs });
  }

  // ─── 19. Statistics ───────────────────────────────────────────────────
  async #seedStatistics(
    experts: User[],
    serviceGroups: { id: string; name: ServiceGroupName }[],
    serviceCategories: { id: string; name: ServiceCategoryName }[],
  ): Promise<void> {
    // 최근 7일치 일별 통계
    const statsDates = range(7).map((daysAgo) => {
      const d = new Date();
      d.setUTCDate(d.getUTCDate() - daysAgo);
      d.setUTCHours(0, 0, 0, 0);
      return d;
    });

    for (const expert of experts) {
      for (const date of statsDates) {
        await this.#prisma.statisticsBySeller.create({
          data: {
            sellerUserId: expert.id,
            date,
            totalTransactionAmount: rand(1_000_000, 50_000_000),
            totalTransactionCount: rand(1, 30),
            maxTransactionAmount: rand(500_000, 5_000_000),
          },
        });
      }
    }

    for (const group of serviceGroups) {
      for (const category of serviceCategories) {
        for (const date of statsDates) {
          await this.#prisma.statisticsByCategory.create({
            data: {
              serviceGroupId: group.id,
              serviceCategoryId: category.id,
              date,
              totalTransactionAmount: rand(1_000_000, 100_000_000),
              totalTransactionCount: rand(1, 100),
              maxTransactionAmount: rand(500_000, 10_000_000),
            },
          });
        }
      }
    }
  }

  // ─── 20. CategoryFeaturedServices (그룹별 추천 서비스) ─────────────
  async #seedCategoryFeaturedServices(
    serviceGroups: { id: string; name: ServiceGroupName }[],
    services: Service[],
  ): Promise<void> {
    for (const group of serviceGroups) {
      const groupServices = services.filter(
        (s) => s.serviceGroupId === group.id,
      );
      const picked = shuffle(groupServices).slice(
        0,
        Math.min(3, groupServices.length),
      );
      for (const service of picked) {
        await this.#prisma.categoryFeaturedService.create({
          data: {
            serviceGroupId: group.id,
            serviceId: service.id,
          },
        });
      }
    }
  }

  // ─── 21. AdminActivityLogs ─────────────────────────────────────────
  async #seedAdminActivityLogs(admins: Admin[]): Promise<void> {
    // 실제로 가리킬 수 있는 id 후보 미리 조회 → enrich 시 매칭되도록
    const [users, faqs, csChatRooms, mainSettings, settledOrders] =
      await Promise.all([
        this.#prisma.user.findMany({ select: { id: true, role: true } }),
        this.#prisma.faq.findMany({ select: { id: true } }),
        this.#prisma.csChatRoom.findMany({ select: { id: true } }),
        this.#prisma.mainSetting.findMany({ select: { id: true } }),
        this.#prisma.order.findMany({
          where: { status: OrderStatus.SETTLEMENT_COMPLETED },
          select: { id: true },
        }),
      ]);

    // 액션의 의미에 맞게 user 풀 분리
    // - 전문가 승인/거절 → expert role
    // - 취소/환불 승인 → client role (구매자가 요청한 거니까)
    // - 블랙리스트 등록/해제 → 어떤 role이든 가능 (전체)
    const expertUsers = users.filter((u) => u.role === Role.EXPERT);
    const clientUsers = users.filter((u) => u.role === Role.CLIENT);

    const EXPERT_TARGET_ACTIONS = new Set<AdminActionType>([
      AdminActionType.EXPERT_APPROVED,
      AdminActionType.EXPERT_REJECTED,
    ]);
    const CLIENT_TARGET_ACTIONS = new Set<AdminActionType>([
      AdminActionType.CANCEL_APPROVED,
      AdminActionType.REFUND_APPROVED,
    ]);
    const BLACKLIST_ACTIONS = new Set<AdminActionType>([
      AdminActionType.BLACKLIST_ADDED,
      AdminActionType.BLACKLIST_REMOVED,
    ]);
    const FAQ_ACTIONS = new Set<AdminActionType>([
      AdminActionType.FAQ_CREATED,
      AdminActionType.FAQ_UPDATED,
      AdminActionType.FAQ_DELETED,
    ]);
    const CS_ACTIONS = new Set<AdminActionType>([
      AdminActionType.CS_ASSIGNED,
      AdminActionType.CS_CLOSED,
    ]);
    const MAIN_ACTIONS = new Set<AdminActionType>([
      AdminActionType.MAIN_UPDATED,
    ]);
    const SETTLEMENT_ACTIONS = new Set<AdminActionType>([
      AdminActionType.SETTLEMENT_COMPLETED,
    ]);

    const pickRefId = (actionType: AdminActionType): string | null => {
      if (EXPERT_TARGET_ACTIONS.has(actionType)) return pick(expertUsers).id;
      if (CLIENT_TARGET_ACTIONS.has(actionType)) return pick(clientUsers).id;
      if (BLACKLIST_ACTIONS.has(actionType)) return pick(users).id;
      if (FAQ_ACTIONS.has(actionType)) return pick(faqs).id;
      if (CS_ACTIONS.has(actionType)) return pick(csChatRooms).id;
      if (MAIN_ACTIONS.has(actionType)) {
        if (mainSettings.length === 0) return null;
        return pick(mainSettings).id;
      }
      if (SETTLEMENT_ACTIONS.has(actionType)) {
        if (settledOrders.length === 0) return null;
        return pick(settledOrders).id;
      }
      return null;
    };

    const actionTypes = Object.values(AdminActionType);
    // 각 actionType 1건씩 (모든 종류 노출 확인용)
    for (const actionType of actionTypes) {
      await this.#prisma.adminActivityLog.create({
        data: {
          adminId: pick(admins).id,
          actionType,
          referenceId: pickRefId(actionType),
          createdAt: faker.date.recent({ days: 30 }),
        },
      });
    }
    // 추가 랜덤 100건 — 무한스크롤 테스트용
    for (let i = 0; i < 100; i++) {
      const actionType = pick(actionTypes);
      await this.#prisma.adminActivityLog.create({
        data: {
          adminId: pick(admins).id,
          actionType,
          referenceId: pickRefId(actionType),
          createdAt: faker.date.recent({ days: 30 }),
        },
      });
    }
  }

  // ─── 22. Orders API 테스트 시드 ──────────────────────────────────────
  // 고정 계정(client@test.com / expert@test.com / other@test.com) + 상태별 주문 묶음.
  // 비밀번호 Test1234!, 기존 시드와 별개로 끝에 추가됨.
  async #seedOrdersApiTestData(): Promise<string> {
    const testPasswordHash = await bcrypt.hash('Test1234!', 10);
    const regions = Object.values(Region);

    // 1) 고정 계정 3개
    const [client, expert, other] = await Promise.all([
      this.#prisma.user.create({
        data: {
          email: 'client@test.com',
          name: '테스트 의뢰인',
          password: testPasswordHash,
          provider: AuthProvider.LOCAL,
          role: Role.CLIENT,
          profileImageUrl: pickProfileImage(),
          region: pick(regions),
          phoneNumber: faker.phone.number(),
        },
      }),
      this.#prisma.user.create({
        data: {
          email: 'expert@test.com',
          name: '테스트 전문가',
          password: testPasswordHash,
          provider: AuthProvider.LOCAL,
          role: Role.EXPERT,
          profileImageUrl: pickProfileImage(),
          region: pick(regions),
          phoneNumber: faker.phone.number(),
          bankName: '국민',
          bankAccount: faker.finance.accountNumber(),
        },
      }),
      this.#prisma.user.create({
        data: {
          email: 'other@test.com',
          name: '테스트 타인',
          password: testPasswordHash,
          provider: AuthProvider.LOCAL,
          role: Role.CLIENT,
          profileImageUrl: pickProfileImage(),
          region: pick(regions),
          phoneNumber: faker.phone.number(),
        },
      }),
    ]);

    // 2) expert ExpertProfile (승인 완료) — 승인한 관리자 한 명 골라서 박음
    const approvingAdmin = await this.#prisma.admin.findFirst();
    if (!approvingAdmin) {
      throw new Error('관리자가 없음 — Admin 시드 누락');
    }
    await this.#prisma.expertProfile.create({
      data: {
        userId: expert.id,
        isApplied: true,
        appliedAt: faker.date.recent({ days: 60 }),
        isApproved: true,
        approvedAt: faker.date.recent({ days: 30 }),
        approvedByAdminId: approvingAdmin.id,
        businessName: faker.company.name(),
        businessNumber: '0000000102',
        ceoName: expert.name ?? '테스트 전문가',
        contactTimeStart: '10:00',
        contactTimeEnd: '19:00',
        foundedYear: 202_005,
        employeeMin: 1,
        employeeMax: 10,
        description: 'Orders API 테스트용 전문가입니다',
      },
    });

    // 2-1) client / other 의 ClientProfile (어드민 유저 상세에서 닉네임·관심분야 노출용)
    await Promise.all([
      this.#prisma.clientProfile.create({
        data: { userId: client.id, nickname: '카키쿠키' },
      }),
      this.#prisma.clientProfile.create({
        data: { userId: other.id, nickname: '타인유저' },
      }),
    ]);

    // 3) expert 소유 ACTIVE 서비스 1개
    const serviceGroup = await this.#prisma.serviceGroup.findFirst();
    const serviceCategory = await this.#prisma.serviceCategory.findFirst();
    if (!serviceGroup || !serviceCategory) {
      throw new Error('카탈로그 시드 누락 — ServiceGroup/Category 없음');
    }

    const expertService = await this.#prisma.service.create({
      data: {
        expertUserId: expert.id,
        title: '[테스트] Orders API용 서비스',
        workDuration: 30,
        revisionCount: 3,
        serviceScope: 'Orders API 테스트 전용',
        servicePrice: 1_000_000,
        description: 'Orders API 테스트용 서비스입니다',
        preparationNotes: '준비 사항 안내',
        refundPolicy: '환불 정책 안내',
        status: ServiceStatus.ACTIVE,
        serviceGroupId: serviceGroup.id,
        serviceCategoryId: serviceCategory.id,
      },
    });

    await this.#prisma.serviceImage.create({
      data: { serviceId: expertService.id, imgUrl: pickImage(), isMain: true },
    });

    // 4) 상태별 주문 묶음 (client ↔ expert)
    const platformFee = Math.floor(expertService.servicePrice * 0.1);
    const totalAmount = expertService.servicePrice + platformFee;

    const futureDate = (days: number): Date =>
      new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    const pastDate = (days: number): Date =>
      new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // 시안 흐름: Order.status는 "진행 상태"만 표현, 취소·환불은 Refund 모델로 별도 트래킹
    const orderPlan: {
      status: OrderStatus;
      endDate: Date | null;
      paymentStatus: PaymentStatus;
      confirmedAt: Date | null;
      refund: { type: RefundType; status: RefundStatus } | null;
    }[] = [
      // NEGOTIATING × 1 — 일반 논의중 (취소·환불 없음)
      {
        status: OrderStatus.NEGOTIATING,
        endDate: null,
        paymentStatus: PaymentStatus.PAID,
        confirmedAt: null,
        refund: null,
      },
      // 디자인 03번: 논의중 + 취소요청
      {
        status: OrderStatus.NEGOTIATING,
        endDate: null,
        paymentStatus: PaymentStatus.PAID,
        confirmedAt: null,
        refund: { type: RefundType.CANCEL, status: RefundStatus.REQUESTED },
      },
      // IN_PROGRESS × 2
      {
        status: OrderStatus.IN_PROGRESS,
        endDate: futureDate(30),
        paymentStatus: PaymentStatus.PAID,
        confirmedAt: null,
        refund: null,
      },
      {
        status: OrderStatus.IN_PROGRESS,
        endDate: futureDate(30),
        paymentStatus: PaymentStatus.PAID,
        confirmedAt: null,
        refund: null,
      },
      // DEADLINE_IMMINENT × 1
      {
        status: OrderStatus.DEADLINE_IMMINENT,
        endDate: futureDate(2),
        paymentStatus: PaymentStatus.PAID,
        confirmedAt: null,
        refund: null,
      },
      // 디자인 05번: 기간만료 + 환불요청
      {
        status: OrderStatus.EXPIRED,
        endDate: pastDate(5),
        paymentStatus: PaymentStatus.PAID,
        confirmedAt: null,
        refund: { type: RefundType.REFUND, status: RefundStatus.REQUESTED },
      },
      // WORK_COMPLETED × 1
      {
        status: OrderStatus.WORK_COMPLETED,
        endDate: futureDate(15),
        paymentStatus: PaymentStatus.PAID,
        confirmedAt: null,
        refund: null,
      },
      // PURCHASE_CONFIRMED × 1
      {
        status: OrderStatus.PURCHASE_CONFIRMED,
        endDate: futureDate(10),
        paymentStatus: PaymentStatus.PAID,
        confirmedAt: new Date(),
        refund: null,
      },
      // SETTLEMENT_REQUESTED × 1
      {
        status: OrderStatus.SETTLEMENT_REQUESTED,
        endDate: futureDate(5),
        paymentStatus: PaymentStatus.PAID,
        confirmedAt: new Date(),
        refund: null,
      },
      // 디자인 06번: 취소 + 취소완료
      {
        status: OrderStatus.PAYMENT_CANCELLED,
        endDate: null,
        paymentStatus: PaymentStatus.CANCELLED,
        confirmedAt: null,
        refund: { type: RefundType.CANCEL, status: RefundStatus.COMPLETED },
      },
      // 디자인 07번: 환불 + 환불완료
      {
        status: OrderStatus.REFUND_COMPLETED,
        endDate: pastDate(10),
        paymentStatus: PaymentStatus.REFUNDED,
        confirmedAt: null,
        refund: { type: RefundType.REFUND, status: RefundStatus.COMPLETED },
      },
    ];

    for (const [i, plan] of orderPlan.entries()) {
      // 채팅방은 (유저 1 + 서비스 1) 단위 → 주문마다 별도 서비스 생성
      const planService = await this.#prisma.service.create({
        data: {
          expertUserId: expert.id,
          title: `[테스트] Orders API용 서비스 ${(i + 1).toString()}`,
          workDuration: 30,
          revisionCount: 3,
          serviceScope: 'Orders API 테스트 전용',
          servicePrice: 1_000_000,
          description: 'Orders API 테스트용 서비스입니다',
          preparationNotes: '준비 사항 안내',
          refundPolicy: '환불 정책 안내',
          status: ServiceStatus.ACTIVE,
          serviceGroupId: serviceGroup.id,
          serviceCategoryId: serviceCategory.id,
        },
      });
      await this.#prisma.serviceImage.create({
        data: { serviceId: planService.id, imgUrl: pickImage(), isMain: true },
      });

      const order = await this.#prisma.order.create({
        data: {
          clientUserId: client.id,
          expertUserId: expert.id,
          serviceId: planService.id,
          agreedServicePrice: planService.servicePrice,
          platformFee,
          totalAmount,
          status: plan.status,
          startDate: pastDate(rand(1, 14)),
          endDate: plan.endDate,
          confirmedAt: plan.confirmedAt,
        },
      });

      const payment = await this.#prisma.payment.create({
        data: {
          orderId: order.id,
          clientUserId: client.id,
          paidAmount: order.totalAmount,
          status: plan.paymentStatus,
          method: pick([
            '신용카드 롯데',
            '신용카드 신한',
            '신용카드 KB국민',
            '신용카드 삼성',
            '신용카드 현대',
            '신용카드 하나',
          ]),
          installmentMonths: pick([1, 1, 1, 1, 2, 3, 6, 12]),
          approvedAt: new Date(),
        },
      });

      if (plan.refund) {
        const isCompleted = plan.refund.status === RefundStatus.COMPLETED;
        await this.#prisma.refund.create({
          data: {
            paymentId: payment.id,
            clientUserId: client.id,
            expertUserId: expert.id,
            refundAmount: order.totalAmount,
            type: plan.refund.type,
            status: plan.refund.status,
            requestedAt: new Date(),
            approvedAt: isCompleted ? new Date() : null,
            refundedAt: isCompleted ? new Date() : null,
          },
        });
      }

      const roomId = await this.#getOrCreateOrderRoom(
        client.id,
        expert.id,
        planService.id,
        order.id,
      );
      await this.#prisma.order.update({
        where: { id: order.id },
        data: { chatRoomId: roomId },
      });
    }

    // 5) 타인 소유 IN_PROGRESS 주문 1건 (other ↔ 임의의 ACTIVE 서비스 보유 expert)
    // ACTIVE 서비스부터 찾고 거기서 expertUserId를 도출 (미승인 expert 회피)
    const otherExpertService = await this.#prisma.service.findFirst({
      where: {
        status: ServiceStatus.ACTIVE,
        expertUserId: { not: expert.id },
      },
    });
    if (!otherExpertService) {
      throw new Error('타인용 ACTIVE 서비스가 없음');
    }

    const otherPlatformFee = Math.floor(otherExpertService.servicePrice * 0.1);
    const otherOrder = await this.#prisma.order.create({
      data: {
        clientUserId: other.id,
        expertUserId: otherExpertService.expertUserId,
        serviceId: otherExpertService.id,
        agreedServicePrice: otherExpertService.servicePrice,
        platformFee: otherPlatformFee,
        totalAmount: otherExpertService.servicePrice + otherPlatformFee,
        status: OrderStatus.IN_PROGRESS,
        startDate: pastDate(7),
        endDate: futureDate(30),
      },
    });
    await this.#prisma.payment.create({
      data: {
        orderId: otherOrder.id,
        clientUserId: other.id,
        paidAmount: otherOrder.totalAmount,
        status: PaymentStatus.PAID,
        method: pick([
          '신용카드 롯데',
          '신용카드 신한',
          '신용카드 KB국민',
          '신용카드 삼성',
          '신용카드 현대',
          '신용카드 하나',
        ]),
        installmentMonths: pick([1, 1, 1, 1, 2, 3, 6, 12]),
        approvedAt: new Date(),
      },
    });
    const otherRoomId = await this.#getOrCreateOrderRoom(
      other.id,
      otherExpertService.expertUserId,
      otherExpertService.id,
      otherOrder.id,
    );
    await this.#prisma.order.update({
      where: { id: otherOrder.id },
      data: { chatRoomId: otherRoomId },
    });

    return expertService.id;
  }

  // ─── 23. Admin user 상세 하위 리스트 테스트 시드 ────────────────────
  // client@test.com / expert@test.com 각자에게:
  // - reports received 30건, reports sent 30건
  // - posts 30건 (관리자 삭제 5 + 본인 삭제 5 + 노출중 20)
  // - comments 30건 (관리자 삭제 5 + 본인 삭제 5 + 노출중 20)
  async #seedAdminUserSubListTestData(): Promise<void> {
    const ADMIN_DELETE_REASONS = [
      '욕설/비방',
      '외부 연락처 유도',
      '스팸/광고',
      '허위·과장 정보',
      '운영 정책 위반',
    ];
    const categories = Object.values(CommunityCategory);

    const [client, expert] = await Promise.all([
      this.#prisma.user.findUnique({ where: { email: 'client@test.com' } }),
      this.#prisma.user.findUnique({ where: { email: 'expert@test.com' } }),
    ]);
    if (!client || !expert) {
      throw new Error('test 계정 누락 (client@test.com / expert@test.com)');
    }

    const admin = await this.#prisma.admin.findFirst();
    if (!admin) throw new Error('Admin 없음');

    // 신고는 CLIENT ↔ EXPERT 양방향만 가능 → role 별로 풀 분리
    const [clientUsers, expertUsers] = await Promise.all([
      this.#prisma.user.findMany({
        where: {
          role: Role.CLIENT,
          email: { notIn: ['client@test.com', 'other@test.com'] },
          isDeleted: false,
        },
        take: 30,
      }),
      this.#prisma.user.findMany({
        where: {
          role: Role.EXPERT,
          email: { notIn: ['expert@test.com'] },
          isDeleted: false,
        },
        take: 30,
      }),
    ]);

    for (const target of [client, expert]) {
      // target의 반대 role 풀 — 신고 상대 user
      const counterparts =
        target.role === Role.CLIENT ? expertUsers : clientUsers;

      // 1. reports received — counterparts가 target을 신고
      for (let i = 0; i < 30; i++) {
        await this.#prisma.report.create({
          data: {
            reporterId: pick(counterparts).id,
            reportedId: target.id,
            reason: pick(REPORT_REASONS),
            status: i < 15 ? ReportStatus.PENDING : ReportStatus.COMPLETED,
            detail: faker.lorem.paragraph(),
          },
        });
      }

      // 2. reports sent — target이 counterparts를 신고
      for (let i = 0; i < 30; i++) {
        await this.#prisma.report.create({
          data: {
            reporterId: target.id,
            reportedId: pick(counterparts).id,
            reason: pick(REPORT_REASONS),
            status: i < 15 ? ReportStatus.PENDING : ReportStatus.COMPLETED,
            detail: faker.lorem.paragraph(),
          },
        });
      }

      // 3. posts — target 작성 30건 (관리자 삭제 5 + 본인 삭제 5 + 노출중 20)
      for (let i = 0; i < 30; i++) {
        const isAdminDeleted = i < 5;
        const isUserDeleted = i >= 5 && i < 10;
        await this.#prisma.communityPost.create({
          data: {
            userId: target.id,
            category: pick(categories),
            title: faker.lorem.sentence({ min: 3, max: 8 }),
            content: faker.lorem.paragraphs(rand(2, 5)),
            deletedAt: isAdminDeleted || isUserDeleted ? new Date() : null,
            deleteReason: isAdminDeleted ? pick(ADMIN_DELETE_REASONS) : null,
            deletedByAdminId: isAdminDeleted ? admin.id : null,
          },
        });
      }

      // 4. comments — target 작성 30건 (관리자 5 + 본인 5 + 노출중 20)
      // 댓글은 검증이 user 기준이라 게시글 분포 무관 → 첫 게시글에 다 박음
      const anyPost = await this.#prisma.communityPost.findFirst();
      if (!anyPost) throw new Error('post 없음');

      for (let i = 0; i < 30; i++) {
        const isAdminDeleted = i < 5;
        const isUserDeleted = i >= 5 && i < 10;
        await this.#prisma.comment.create({
          data: {
            postId: anyPost.id,
            userId: target.id,
            content: pick(COMMENT_TEMPLATES),
            deletedAt: isAdminDeleted || isUserDeleted ? new Date() : null,
            deleteReason: isAdminDeleted ? pick(ADMIN_DELETE_REASONS) : null,
            deletedByAdminId: isAdminDeleted ? admin.id : null,
          },
        });
      }
    }
  }
}

// ─── Bootstrap ──────────────────────────────────────────────────────────
// 공유 RDS 커넥션 슬롯 고갈 방지 — 시드는 적은 풀로 충분
const databaseUrl = process.env.DATABASE_URL;
const prisma = new PrismaClient(
  databaseUrl
    ? {
        datasourceUrl: `${databaseUrl}${databaseUrl.includes('?') ? '&' : '?'}connection_limit=3`,
      }
    : undefined,
);
const seeder = new Seeder(prisma);

seeder
  .run()
  .catch((error: unknown) => {
    console.error('❌ 시딩 에러:', error);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
