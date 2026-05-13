import type { ApiSuccess, SalesStatistics } from './types';

export const mockSalesStatistics: SalesStatistics = {
  summary: {
    totalTransactionAmount: 385_780_000,
    totalTransactionCount: 280,
    averageTransactionAmount: 352_000,
    maxTransactionAmount: 3_200_000,
  },
  dailySales: [
    { date: '2026-04-01', amount: 12_300_000, count: 15 },
    { date: '2026-04-02', amount: 8_900_000, count: 10 },
    { date: '2026-04-03', amount: 15_600_000, count: 18 },
    { date: '2026-04-04', amount: 11_200_000, count: 13 },
    { date: '2026-04-05', amount: 9_800_000, count: 11 },
    { date: '2026-04-06', amount: 14_500_000, count: 16 },
    { date: '2026-04-07', amount: 13_800_000, count: 17 },
    { date: '2026-04-08', amount: 16_700_000, count: 20 },
    { date: '2026-04-09', amount: 12_900_000, count: 14 },
    { date: '2026-04-10', amount: 17_800_000, count: 22 },
  ],
  categorySales: [
    { category: 'IT 코칭 - 프론트엔드', amount: 89_500_000, ratio: 23.2 },
    { category: 'IT 코칭 - 백엔드', amount: 76_200_000, ratio: 19.8 },
    { category: '프로젝트 의뢰 - 앱', amount: 95_600_000, ratio: 24.8 },
    { category: '프로젝트 의뢰 - 웹', amount: 65_400_000, ratio: 17 },
    { category: 'IT 코칭 - 디자인', amount: 32_100_000, ratio: 8.3 },
    { category: '기타', amount: 26_980_000, ratio: 7 },
  ],
  topSellers: [
    { expertId: 'expert-001', expertName: '코드잇 에이전시', amount: 42_500_000 },
    { expertId: 'expert-002', expertName: '웹스튜디오', amount: 28_900_000 },
    { expertId: 'expert-003', expertName: '백엔드 마스터', amount: 22_100_000 },
    { expertId: 'expert-005', expertName: 'AI 스튜디오', amount: 18_700_000 },
    { expertId: 'expert-004', expertName: '디자인 랩', amount: 15_200_000 },
  ],
};

export const mockSalesStatisticsResponse: ApiSuccess<SalesStatistics> = {
  success: true,
  message: '판매 통계를 조회했습니다.',
  data: mockSalesStatistics,
};
