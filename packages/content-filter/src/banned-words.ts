const BANNED_WORDS_PROFANITY = [
  '시발',
  '씨발',
  '병신',
  '좆',
  '좆같',
  '개새끼',
  '지랄',
  '염병',
  '미친놈',
  '미친년',
  'ㅅㅂ',
  'ㅂㅅ',
];

const BANNED_WORDS_ADULT = ['섹스', '자위', '성관계', '야동'];

export const BANNED_WORDS_CONTACT = [
  '카톡',
  '카카오톡',
  '오픈채팅',
  '오픈채팅방',
  '텔레그램',
  '텔레',
  '라인',
  '디엠',
  'dm',
  '카카오톡아이디',
  '연락주세요',
];

const BANNED_WORDS_GAMBLING = ['바카라', '카지노', '토토', '스포츠토토'];

const BANNED_WORDS_PERSONAL_INFO = ['주민등록번호', '계좌번호'];

export const POST_BANNED_WORDS = [
  ...BANNED_WORDS_PROFANITY,
  ...BANNED_WORDS_ADULT,
  ...BANNED_WORDS_GAMBLING,
  ...BANNED_WORDS_PERSONAL_INFO,
];
