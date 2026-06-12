import { formatDate, formatPrice } from '@repo/utils';

import * as colStyles from './constants.css';

import type { CategoryFeaturedItem, ServiceCandidateItem } from './types';
import type { ColDef } from '@/components/common/AdminTable';
import type { DeleteConfirm } from '@/components/common/SettingSection';
import type { ServiceType } from '@/types/enums';

import { SERVICE_STATUS_LABEL, SERVICE_TYPE_LABEL } from '@/utils/constants';

export const SECTION_DELETE_CONFIRM: Record<ServiceType, DeleteConfirm> = {
  IT_COACHING: {
    message:
      "선택하신 서비스를 'IT 코칭 대표서비스' 영역에서 노출 제외하시겠습니까?",
  },
  PROJECT_REQUEST: {
    message:
      "선택하신 서비스를 '프로젝트 의뢰 대표서비스' 영역에서 노출 제외하시겠습니까?",
  },
};

type ServiceColBase = Pick<
  CategoryFeaturedItem,
  | 'title'
  | 'category'
  | 'businessName'
  | 'status'
  | 'servicePrice'
  | 'createdAt'
  | 'orderCount'
>;

function makeCategoryServiceCols<T extends ServiceColBase>(): ColDef<T>[] {
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
      render: (item) => {
        const label = SERVICE_STATUS_LABEL[item.status];
        if (item.status === 'ACTIVE') {
          return <span className={colStyles.statusActive}>{label}</span>;
        }
        if (item.status === 'PAUSED') {
          return <span className={colStyles.statusPaused}>{label}</span>;
        }
        return <span className={colStyles.statusClosed}>{label}</span>;
      },
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

export const CATEGORY_CANDIDATE_COLS: ColDef<ServiceCandidateItem>[] =
  makeCategoryServiceCols<ServiceCandidateItem>();
export const CATEGORY_SERVICE_COLS: ColDef<CategoryFeaturedItem>[] =
  makeCategoryServiceCols<CategoryFeaturedItem>();
