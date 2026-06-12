'use client';

import { useRouter } from 'next/navigation';

import * as styles from './CategoryServicesContent.css';

import type { CategoryFeaturedPageResponse } from '@/features/category-services/types';

import { ItemPickerModal } from '@/components/common/modal/ItemPickerModal';
import { SettingSection } from '@/components/common/SettingSection';
import {
  deleteCategoryFeatured,
  getCategoryFeaturedCandidatesForPicker,
  registerCategoryFeatured,
} from '@/features/category-services/api';
import {
  CATEGORY_CANDIDATE_COLS,
  CATEGORY_SERVICE_COLS,
  SECTION_DELETE_CONFIRM,
} from '@/features/category-services/constants';

interface Props {
  data: CategoryFeaturedPageResponse;
}

export default function CategoryServicesContent({ data }: Props) {
  const router = useRouter();

  const sections = [
    {
      serviceGroup: 'IT_COACHING' as const,
      title: 'IT 코칭 대표서비스',
      items: data.itCoaching,
      emptyMessage: '등록된 IT 코칭이 없습니다.',
    },
    {
      serviceGroup: 'PROJECT_REQUEST' as const,
      title: '프로젝트 의뢰 대표서비스',
      items: data.projectRequest,
      emptyMessage: '등록된 프로젝트 의뢰가 없습니다.',
    },
  ];

  return (
    <div className={styles.page}>
      {sections.map(({ serviceGroup, title, items, emptyMessage }) => (
        <SettingSection
          key={serviceGroup}
          title={title}
          items={items}
          cols={CATEGORY_SERVICE_COLS}
          getKey={(item) => item.categoryFeaturedId}
          emptyMessage={emptyMessage}
          deleteConfirm={SECTION_DELETE_CONFIRM[serviceGroup]}
          onDelete={async (ids) => {
            await deleteCategoryFeatured({
              serviceGroup,
              categoryFeaturedIds: ids,
            });
            router.refresh();
          }}
          renderRegisterModal={(onClose) => (
            <ItemPickerModal
              title={`${title} 등록`}
              confirmLabel={`${title} 등록`}
              searchPlaceholder="서비스명으로 검색해주세요"
              summaryPrefix="선택된 서비스"
              onClose={onClose}
              fetchCandidates={(params) =>
                getCategoryFeaturedCandidatesForPicker({
                  ...params,
                  serviceGroup,
                })
              }
              getKey={(item) => item.serviceId}
              getSummaryLabel={(item) => item.title}
              cols={CATEGORY_CANDIDATE_COLS}
              onConfirm={async (ids) => {
                await registerCategoryFeatured({
                  serviceGroup,
                  serviceIds: ids,
                });
                router.refresh();
              }}
            />
          )}
        />
      ))}
    </div>
  );
}
