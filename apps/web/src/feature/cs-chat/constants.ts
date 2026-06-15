import type { CsBotMenu } from './types';

/** 위젯 치수 (px) */
export const PANEL_WIDTH = 430;
export const PANEL_HEIGHT = 730;
export const LAUNCHER_SIZE = 60;
export const INPUT_MIN_HEIGHT = 86;
export const INPUT_MAX_HEIGHT = 160;

export const CS_BRAND = '무브잇 고객센터';

/** 상담사 운영시간 안내 */
export const OPERATING_HOURS_TITLE = '무브잇 고객센터 상담사 운영시간';
export const OPERATING_HOURS = '평일 10:00 ~ 18:00 (점심시간 13:00 ~ 14:00)';

/** 홈 인사 카드 본문 (line별 강조 여부) */
export const GREETING_BODY: { text: string; bold?: boolean }[] = [
  { text: '안녕하세요, 무브잇 입니다.' },
  { text: '궁금하신 내용을 아래에서 선택해주세요', bold: true },
  { text: '' },
  { text: '상담원 연결은 아래 시간에만 가능합니다.' },
  { text: '운영시간 외 문의는 남겨주시면, 운영시간에 순차 답변 드릴게요' },
  { text: '' },
  { text: OPERATING_HOURS_TITLE, bold: true },
];

/** 봇 플로우 첫 인사 (홈 인사 + 운영시간 라인 추가) */
export const MENU_GREETING_BODY: { text: string; bold?: boolean }[] = [
  ...GREETING_BODY,
  { text: OPERATING_HOURS },
];

/** 자동응답 메뉴 정의 (자동응답 4종) — 순서 = 칩 노출 순서 */
export const BOT_MENUS: { menu: CsBotMenu; label: string }[] = [
  { menu: 'SALES', label: '판매 활동 문의' },
  { menu: 'ORDER', label: '의뢰/구매 문의' },
  { menu: 'TAX', label: '세무 관련 상담 문의' },
  { menu: 'SETTLEMENT', label: '정산 문의' },
];

export const CONNECT_AGENT_LABEL = '상담원 연결';

/** 자동응답 본문 (프론트 고정 텍스트, 백엔드 미연동) */
export const AUTO_REPLIES: Record<CsBotMenu, string> = {
  SALES: [
    '판매 활동 문의는 다음과 같이 안내드립니다.',
    '',
    '1. 서비스 등록',
    '전문가 승인 후 코칭·프로젝트 서비스를 등록하실 수 있습니다.',
    '',
    '2. 거래 진행',
    '구매자의 거래 요청을 수락하고 결제가 완료되면 작업을 진행합니다.',
    '',
    '3. 정산',
    '거래가 확정되면 수수료를 제외한 금액이 정산 예정 금액으로 적립됩니다.',
    '',
    '판매 활동 중 궁금한 점이 있으시면 언제든지 문의해 주세요!',
  ].join('\n'),
  ORDER: [
    '의뢰 및 구매 문의는 다음과 같이 진행됩니다.',
    '',
    '1. 의뢰 및 구매 문의 접수',
    '문의 내용을 남겨주시면 확인 후 답변드립니다.',
    '',
    '2. 작업 내용 및 견적 안내',
    '요청하신 작업 내용을 기반으로 진행 가능 여부와 견적을 안내드립니다.',
    '',
    '3. 결제 및 작업 진행',
    '결제 완료 후 작업이 시작되며, 진행 상황은 채팅을 통해 안내드립니다.',
    '',
    '추가로 궁금한 점이 있으시면 언제든지 문의해 주세요!',
  ].join('\n'),
  TAX: [
    '세무 관련 문의는 다음과 같이 안내드립니다.',
    '',
    '무브잇은 거래 시 발생하는 플랫폼 수수료와 정산 내역을 제공합니다.',
    '세금 신고·원천징수 등 구체적인 세무 처리는 거래 내역을 바탕으로 진행해 주세요.',
    '',
    '세무 관련 추가 안내가 필요하시면 상담원 연결을 통해 문의해 주세요!',
  ].join('\n'),
  SETTLEMENT: [
    '정산 문의는 다음과 같이 안내드립니다.',
    '',
    '1. 정산 기준',
    '구매자가 거래를 확정하면 수수료를 제외한 금액이 정산됩니다.',
    '',
    '2. 정산 확인',
    '마이페이지의 정산 내역에서 진행 상태를 확인하실 수 있습니다.',
    '',
    '정산이 지연되거나 누락된 경우 상담원 연결을 통해 문의해 주세요!',
  ].join('\n'),
};

/** 상담원 연결 동의 안내 (화면 ⑤) */
export const CONSENT_TEXT = [
  '✅ 입력해 주신 정보는 문의 관련 상담 시에만 활용됩니다.',
  '✅ 만일, 상담을 원치 않으실 경우 나가기를 클릭해 주시기 바랍니다.',
  '',
  '해당 상담 진행시 아래 버튼을 눌러 상담 목적의 개인정보 수집 및 이용 동의 내용을 확인하시고, 동의 하신다면 아래 동의합니다 버튼을 눌러 상담을 진행해주세요.',
].join('\n');

export const CONSENT_LINK_LABEL = '상담 목적의 개인정보 수집 및 이용 동의 내용';

export const AGREE_LABEL = '동의합니다.';
export const DISAGREE_LABEL = '동의하지 않습니다.';

/** 비동의 안내 (화면 ⑤-a) */
export const DISAGREE_TEXT = [
  '죄송해도, 동의하지 않으시면 상담원 연결이 어렵습니다.',
  '하기 사항에 동의해주시면 상담원 연결 버튼을 눌러주시고, 동의하지 않으신다면 처음으로 돌아가주세요.',
].join('\n');

export const AGREE_AND_CONNECT_LABEL = '동의하고 상담사 연결';
export const BACK_TO_START_LABEL = '처음으로 돌아가기';
export const BACK_TO_MENU_LABEL = '이전으로 돌아가기';

/** 동의 후 입력 안내 (화면 ⑤-b) */
export const AWAIT_INPUT_TEXT = [
  '아래 문의 내용을 작성해주세요.',
  '문의 내용을 작성해주셔야 상담원 연결이 가능합니다.',
  '',
  '잠시만 기다려 주세요!',
].join('\n');

export const INPUT_PLACEHOLDER = '문의 내용을 작성해주세요';

/** 라이브 채팅 시스템 안내 (화면 ⑥) */
export const CONNECTING_TEXT = '상담원 연결중입니다. 잠시만 기다려주세요';
export const ADMIN_CONNECTED_TEXT = '무브잇 상담원이 연결되었습니다.';
