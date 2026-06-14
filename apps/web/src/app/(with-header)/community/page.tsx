import type { Metadata } from 'next';

import { getPagedCommunityPosts } from '@/feature/community/api';
import { CommunityBoard } from '@/feature/community/components/CommunityBoard';
import { COMMUNITY_PAGE_SIZE } from '@/feature/community/constants';
import { parseCommunityCategory, parsePage } from '@/feature/community/utils';
import { getMockAuthUser } from '@/mocks/user';
import { calcTotalPages } from '@/utils/paging';

export const metadata: Metadata = {
  title: '자유게시판 | moveit',
};

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CommunityPage({ searchParams }: Props) {
  const rawParams = await searchParams;
  const category = parseCommunityCategory(rawParams.category);
  const page = parsePage(rawParams.page);

  let pagedResult = await getPagedCommunityPosts({
    category,
    page,
    pageSize: COMMUNITY_PAGE_SIZE,
  });

  const totalPages = calcTotalPages(
    pagedResult.data.pagination.totalCount,
    COMMUNITY_PAGE_SIZE,
  );
  const currentPage = Math.min(page, totalPages);

  if (currentPage !== page) {
    pagedResult = await getPagedCommunityPosts({
      category,
      page: currentPage,
      pageSize: COMMUNITY_PAGE_SIZE,
    });
  }

  const { items } = pagedResult.data;
  const canWritePost = getMockAuthUser() !== null;

  return (
    <CommunityBoard
      items={items}
      category={category}
      page={currentPage}
      totalPages={totalPages}
      canWritePost={canWritePost}
    />
  );
}
