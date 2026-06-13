'use client';

import { useRouter } from 'next/navigation';

import * as styles from './MainSettingContent.css';

import type { MainSettingsResponse } from '@/features/main-setting/types';

import { ItemPickerModal } from '@/components/common/modal/ItemPickerModal';
import { SettingSection } from '@/components/common/SettingSection';
import {
  deleteBanners,
  deleteMainSetting,
  getExpertCandidatesForPicker,
  getServiceCandidatesForPicker,
  registerMainSetting,
} from '@/features/main-setting/api';
import { BannerRegisterForm } from '@/features/main-setting/BannerRegisterForm';
import {
  BANNER_COLS,
  EXPERT_CANDIDATE_COLS,
  EXPERT_COLS,
  SECTION_DELETE_CONFIRM,
  SERVICE_CANDIDATE_COLS,
  makeServiceCols,
} from '@/features/main-setting/constants';

interface Props {
  data: MainSettingsResponse;
}

export default function MainSettingContent({ data }: Props) {
  const router = useRouter();

  const popularServiceCols = makeServiceCols('회사명');
  const recommendedServiceCols = makeServiceCols('전문가');

  const expertSections = [
    {
      sectionType: 'MOVEIT_POPULAR_PROJECT_EXPERT' as const,
      title: 'moveit 인기 프로젝트 의뢰 전문가',
      items: data.moveitPopularProjectExpert,
      emptyMessage: '등록된 전문가가 없습니다.',
    },
    {
      sectionType: 'MOVEIT_POPULAR_COACHING' as const,
      title: 'moveit 인기 코칭',
      items: data.moveitPopularCoaching,
      emptyMessage: '등록된 전문가가 없습니다.',
    },
  ];

  const recommendedSections = [
    {
      sectionType: 'RECOMMENDED_IT_COACHING' as const,
      title: '유저에게 추천하는 IT 코칭',
      items: data.recommendedItCoaching,
      emptyMessage: '등록된 IT 코칭이 없습니다.',
    },
    {
      sectionType: 'RECOMMENDED_PROJECT_REQUEST' as const,
      title: '유저에게 추천하는 프로젝트 의뢰',
      items: data.recommendedProjectRequest,
      emptyMessage: '등록된 프로젝트 의뢰가 없습니다.',
    },
  ];

  return (
    <div className={styles.page}>
      <SettingSection
        title="가장 많이 찾는 IT 코칭"
        items={data.popularItCoaching}
        cols={popularServiceCols}
        getKey={(item) => item.mainSettingId}
        emptyMessage="등록된 IT 코칭이 없습니다."
        deleteConfirm={SECTION_DELETE_CONFIRM.POPULAR_IT_COACHING}
        onDelete={async (ids) => {
          await deleteMainSetting({ sectionType: 'POPULAR_IT_COACHING', mainSettingIds: ids });
          router.refresh();
        }}
        renderRegisterModal={(onClose) => (
          <ItemPickerModal
            title="가장 많이 찾는 IT 코칭 등록"
            confirmLabel="가장 많이 찾는 IT 코칭 등록"
            searchPlaceholder="서비스명으로 검색해주세요"
            summaryPrefix="선택된 서비스"
            onClose={onClose}
            fetchCandidates={(params) =>
              getServiceCandidatesForPicker({ ...params, sectionType: 'POPULAR_IT_COACHING' })
            }
            getKey={(item) => item.serviceId}
            getSummaryLabel={(item) => item.title}
            cols={SERVICE_CANDIDATE_COLS}
            onConfirm={async (ids) => {
              await registerMainSetting({ sectionType: 'POPULAR_IT_COACHING', targetIds: ids });
              router.refresh();
            }}
          />
        )}
      />

      <SettingSection
        title="띠배너"
        items={data.banners}
        cols={BANNER_COLS}
        getKey={(item) => item.id}
        emptyMessage="등록된 배너가 없습니다."
        deleteConfirm={SECTION_DELETE_CONFIRM.BANNERS}
        onDelete={async (ids) => {
          await deleteBanners({ bannerIds: ids });
          router.refresh();
        }}
        renderRegisterModal={(onClose) => <BannerRegisterForm onClose={onClose} />}
      />

      <SettingSection
        title="가장 많이 찾는 프로젝트 의뢰"
        items={data.popularProjectRequest}
        cols={popularServiceCols}
        getKey={(item) => item.mainSettingId}
        emptyMessage="등록된 프로젝트 의뢰가 없습니다."
        deleteConfirm={SECTION_DELETE_CONFIRM.POPULAR_PROJECT_REQUEST}
        onDelete={async (ids) => {
          await deleteMainSetting({ sectionType: 'POPULAR_PROJECT_REQUEST', mainSettingIds: ids });
          router.refresh();
        }}
        renderRegisterModal={(onClose) => (
          <ItemPickerModal
            title="가장 많이 찾는 프로젝트 의뢰 등록"
            confirmLabel="가장 많이 찾는 프로젝트 의뢰 등록"
            searchPlaceholder="서비스명으로 검색해주세요"
            summaryPrefix="선택된 서비스"
            onClose={onClose}
            fetchCandidates={(params) =>
              getServiceCandidatesForPicker({ ...params, sectionType: 'POPULAR_PROJECT_REQUEST' })
            }
            getKey={(item) => item.serviceId}
            getSummaryLabel={(item) => item.title}
            cols={SERVICE_CANDIDATE_COLS}
            onConfirm={async (ids) => {
              await registerMainSetting({ sectionType: 'POPULAR_PROJECT_REQUEST', targetIds: ids });
              router.refresh();
            }}
          />
        )}
      />

      {expertSections.map(({ sectionType, title, items, emptyMessage }) => (
        <SettingSection
          key={sectionType}
          title={title}
          items={items}
          cols={EXPERT_COLS}
          getKey={(item) => item.mainSettingId}
          emptyMessage={emptyMessage}
          deleteConfirm={SECTION_DELETE_CONFIRM[sectionType]}
          onDelete={async (ids) => {
            await deleteMainSetting({ sectionType, mainSettingIds: ids });
            router.refresh();
          }}
          renderRegisterModal={(onClose) => (
            <ItemPickerModal
              title={`${title} 등록`}
              confirmLabel={`${title} 등록`}
              searchPlaceholder="회사명으로 검색해주세요"
              summaryPrefix="선택된 전문가"
              createdSortLabel="가입일 순"
              onClose={onClose}
              fetchCandidates={(params) =>
                getExpertCandidatesForPicker({ ...params, sectionType })
              }
              getKey={(item) => item.userId}
              getSummaryLabel={(item) => item.businessName ?? '-'}
              cols={EXPERT_CANDIDATE_COLS}
              onConfirm={async (ids) => {
                await registerMainSetting({ sectionType, targetIds: ids });
                router.refresh();
              }}
            />
          )}
        />
      ))}

      {recommendedSections.map(({ sectionType, title, items, emptyMessage }) => (
        <SettingSection
          key={sectionType}
          title={title}
          items={items}
          cols={recommendedServiceCols}
          getKey={(item) => item.mainSettingId}
          emptyMessage={emptyMessage}
          deleteConfirm={SECTION_DELETE_CONFIRM[sectionType]}
          onDelete={async (ids) => {
            await deleteMainSetting({ sectionType, mainSettingIds: ids });
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
                getServiceCandidatesForPicker({ ...params, sectionType })
              }
              getKey={(item) => item.serviceId}
              getSummaryLabel={(item) => item.title}
              cols={SERVICE_CANDIDATE_COLS}
              onConfirm={async (ids) => {
                await registerMainSetting({ sectionType, targetIds: ids });
                router.refresh();
              }}
            />
          )}
        />
      ))}
    </div>
  );
}
