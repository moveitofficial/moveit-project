export type UserReportTableVariant = 'reportsReceived' | 'reportsSent';

export const REPORT_DETAIL_MODAL_TITLE: Record<UserReportTableVariant, string> =
  {
    reportsReceived: '신고 받은 내용',
    reportsSent: '신고한 내용',
  };
