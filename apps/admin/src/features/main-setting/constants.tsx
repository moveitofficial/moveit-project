import { formatDate, formatPrice } from '@repo/utils';
import Image from 'next/image';

import * as colStyles from './constants.css';

import type {
  BannerItem,
  ExpertCandidateItem,
  ExpertMainItem,
  MainSectionType,
  ServiceCandidateItem,
  ServiceMainItem,
} from './types';
import type { ColDef } from '@/components/common/AdminTable';
import type { DeleteConfirm } from '@/components/common/SettingSection';

import {
  PROVIDER_LABEL,
  REGION_LABEL,
  SERVICE_STATUS_LABEL,
  SERVICE_TYPE_LABEL,
} from '@/utils/constants';

export const SECTION_DELETE_CONFIRM: Record<
  MainSectionType | 'BANNERS',
  DeleteConfirm
> = {
  POPULAR_IT_COACHING: {
    message:
      "선택하신 서비스를 '가장 많이 찾는 IT 코칭' 영역에서 노출 제외하시겠습니까?",
  },
  POPULAR_PROJECT_REQUEST: {
    message:
      "선택하신 서비스를 '가장 많이 찾는 프로젝트 의뢰' 영역에서 노출 제외하시겠습니까?",
  },
  MOVEIT_POPULAR_PROJECT_EXPERT: {
    message:
      "선택하신 전문가를 'moveit 인기 프로젝트 의뢰 전문가' 영역에서 노출 제외하시겠습니까?",
  },
  MOVEIT_POPULAR_COACHING: {
    message:
      "선택하신 전문가를 'moveit 인기 IT코칭' 영역에서 노출 제외하시겠습니까?",
  },
  RECOMMENDED_IT_COACHING: {
    message:
      "선택하신 서비스를 '유저에게 추천하는 IT 코칭' 영역에서 노출 제외하시겠습니까?",
  },
  RECOMMENDED_PROJECT_REQUEST: {
    message:
      "선택하신 서비스를 '유저에게 추천하는 프로젝트의뢰' 영역에서 노출 제외하시겠습니까?",
  },
  BANNERS: {
    message:
      '띠배너를 삭제하시겠습니까? \n 삭제 시 메인 페이지에 더 이상 노출되지 않으며, \n 이 작업은 되돌릴 수 없습니다.',
  },
};

function renderServiceStatus(status: ServiceMainItem['status']) {
  const label = SERVICE_STATUS_LABEL[status];
  if (status === 'ACTIVE') {
    return <span className={colStyles.statusActive}>{label}</span>;
  }
  if (status === 'PAUSED') {
    return <span className={colStyles.statusPaused}>{label}</span>;
  }
  return <span className={colStyles.statusClosed}>{label}</span>;
}

export function makeServiceCols(
  companyLabel: '회사명' | '전문가',
): ColDef<ServiceMainItem>[] {
  return [
    {
      key: 'title',
      header: '서비스명',
      headerStyle: colStyles.svcColTitle,
      cellStyle: colStyles.svcColTitle,
      render: (item) => (
        <span className={colStyles.titleText}>{item.title}</span>
      ),
    },
    {
      key: 'category',
      header: '카테고리',
      headerStyle: colStyles.svcColCategory,
      cellStyle: colStyles.svcColCategory,
      render: (item) => SERVICE_TYPE_LABEL[item.category],
    },
    {
      key: 'businessName',
      header: companyLabel,
      headerStyle: colStyles.svcColCompany,
      cellStyle: colStyles.svcColCompany,
      render: (item) => item.businessName ?? '-',
    },
    {
      key: 'status',
      header: '상태',
      headerStyle: colStyles.svcColStatus,
      cellStyle: colStyles.svcColStatus,
      render: (item) => renderServiceStatus(item.status),
    },
    {
      key: 'servicePrice',
      header: '판매금액',
      headerStyle: colStyles.svcColPrice,
      cellStyle: colStyles.svcColPrice,
      render: (item) => formatPrice(item.servicePrice),
    },
    {
      key: 'createdAt',
      header: '등록일',
      headerStyle: colStyles.svcColDate,
      cellStyle: colStyles.svcColDate,
      render: (item) => formatDate(item.createdAt),
    },
    {
      key: 'orderCount',
      header: '판매 건수',
      headerStyle: colStyles.svcColSales,
      cellStyle: colStyles.svcColSales,
      render: (item) => `${item.orderCount}건`,
    },
  ];
}

type ExpertColBase = Pick<
  ExpertMainItem,
  | 'businessName'
  | 'email'
  | 'specialties'
  | 'provider'
  | 'isApproved'
  | 'region'
  | 'saleCount'
  | 'reportCount'
  | 'createdAt'
>;

function makeExpertCols<T extends ExpertColBase>(): ColDef<T>[] {
  return [
    {
      key: 'businessName',
      header: '회사명',
      headerStyle: colStyles.expertColCompany,
      cellStyle: colStyles.expertColCompany,
      render: (item) => item.businessName ?? '-',
    },
    {
      key: 'email',
      header: '이메일',
      headerStyle: colStyles.expertColEmail,
      cellStyle: colStyles.expertColEmail,
      render: (item) => (
        <span className={colStyles.titleText}>{item.email}</span>
      ),
    },
    {
      key: 'specialties',
      header: '전문분야',
      headerStyle: colStyles.expertColType,
      cellStyle: colStyles.expertColType,
      render: (item) =>
        item.specialties.map((s) => SERVICE_TYPE_LABEL[s]).join(', '),
    },
    {
      key: 'provider',
      header: '가입경로',
      headerStyle: colStyles.expertColProvider,
      cellStyle: colStyles.expertColProvider,
      render: (item) => PROVIDER_LABEL[item.provider],
    },
    {
      key: 'isApproved',
      header: '상태',
      headerStyle: colStyles.expertColStatus,
      cellStyle: colStyles.expertColStatus,
      render: () => <span className={colStyles.statusApproved}>승인</span>,
    },
    {
      key: 'region',
      header: '지역',
      headerStyle: colStyles.expertColRegion,
      cellStyle: colStyles.expertColRegion,
      render: (item) =>
        item.region === null ? '-' : (REGION_LABEL[item.region] ?? item.region),
    },
    {
      key: 'saleCount',
      header: '판매(건)',
      headerStyle: colStyles.expertColOrders,
      cellStyle: colStyles.expertColOrders,
      render: (item) => `${item.saleCount}건`,
    },
    {
      key: 'reportCount',
      header: '신고',
      headerStyle: colStyles.expertColReport,
      cellStyle: colStyles.expertColReport,
      render: (item) => String(item.reportCount),
    },
    {
      key: 'createdAt',
      header: '가입일',
      headerStyle: colStyles.expertColDate,
      cellStyle: colStyles.expertColDate,
      render: (item) => formatDate(item.createdAt),
    },
  ];
}

export const EXPERT_COLS: ColDef<ExpertMainItem>[] =
  makeExpertCols<ExpertMainItem>();

export const SERVICE_CANDIDATE_COLS: ColDef<ServiceCandidateItem>[] = [
  {
    key: 'title',
    header: '서비스명',
    headerStyle: colStyles.svcColTitle,
    cellStyle: colStyles.svcColTitle,
    render: (item) => <span className={colStyles.titleText}>{item.title}</span>,
  },
  {
    key: 'category',
    header: '카테고리',
    headerStyle: colStyles.svcColCategory,
    cellStyle: colStyles.svcColCategory,
    render: (item) => SERVICE_TYPE_LABEL[item.category],
  },
  {
    key: 'businessName',
    header: '회사명',
    headerStyle: colStyles.svcColCompany,
    cellStyle: colStyles.svcColCompany,
    render: (item) => item.businessName ?? '-',
  },
  {
    key: 'status',
    header: '상태',
    headerStyle: colStyles.svcColStatus,
    cellStyle: colStyles.svcColStatus,
    render: (item) => renderServiceStatus(item.status),
  },
  {
    key: 'servicePrice',
    header: '판매금액',
    headerStyle: colStyles.svcColPrice,
    cellStyle: colStyles.svcColPrice,
    render: (item) => formatPrice(item.servicePrice),
  },
  {
    key: 'createdAt',
    header: '등록일',
    headerStyle: colStyles.svcColDate,
    cellStyle: colStyles.svcColDate,
    render: (item) => formatDate(item.createdAt),
  },
  {
    key: 'orderCount',
    header: '판매 건수',
    headerStyle: colStyles.svcColSales,
    cellStyle: colStyles.svcColSales,
    render: (item) => `${item.orderCount}건`,
  },
];

export const EXPERT_CANDIDATE_COLS: ColDef<ExpertCandidateItem>[] =
  makeExpertCols<ExpertCandidateItem>();

export const BANNER_COLS: ColDef<BannerItem>[] = [
  {
    key: 'imageUrl',
    header: '이미지',
    headerStyle: colStyles.bannerColImage,
    cellStyle: colStyles.bannerColImage,
    render: (item) => (
      <Image
        src={item.imageUrl}
        alt="배너"
        width={151}
        height={23}
        className={colStyles.thumbnailImg}
      />
    ),
  },
  {
    key: 'actionUrl',
    header: 'URL',
    headerStyle: colStyles.bannerColUrl,
    cellStyle: colStyles.bannerColUrl,
    render: (item) => (
      <span className={colStyles.titleText}>{item.actionUrl}</span>
    ),
  },
  {
    key: 'createdAt',
    header: '등록일',
    headerStyle: colStyles.bannerColDate,
    cellStyle: colStyles.bannerColDate,
    render: (item) => formatDate(item.createdAt),
  },
];
