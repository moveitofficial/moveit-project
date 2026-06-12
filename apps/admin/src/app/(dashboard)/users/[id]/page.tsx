import { Suspense } from 'react';

import * as styles from './page.css';

import {
  getUserComments,
  getUserDetail,
  getUserOrders,
  getUserPosts,
  getUserReportsReceived,
  getUserReportsSent,
  getUserServices,
} from '@/features/users/api';
import { UserDetail } from '@/features/users/UserDetail';
import { UserSectionTable } from '@/features/users/UserSectionTable';

interface Props {
  params: Promise<{ id: string }>;
}

async function OrdersSection({ userId }: { userId: string }) {
  const { data } = await getUserOrders(userId, 1);
  return (
    <UserSectionTable
      variant="orders"
      title="구매 내역"
      emptyMessage="구매 내역이 없습니다."
      items={data.items}
    />
  );
}

async function ServicesSection({ userId }: { userId: string }) {
  const { data } = await getUserServices(userId, 1);
  return (
    <UserSectionTable
      variant="services"
      title="등록된 서비스"
      emptyMessage="등록된 서비스가 없습니다."
      items={data.items}
    />
  );
}

async function ReportsReceivedSection({ userId }: { userId: string }) {
  const { data } = await getUserReportsReceived(userId, 1);
  return (
    <UserSectionTable
      variant="reportsReceived"
      title="신고 받은 내역"
      emptyMessage="신고 받은 내역이 없습니다."
      items={data.items}
    />
  );
}

async function ReportsSentSection({ userId }: { userId: string }) {
  const { data } = await getUserReportsSent(userId, 1);
  return (
    <UserSectionTable
      variant="reportsSent"
      title="신고한 내역"
      emptyMessage="신고한 내역이 없습니다."
      items={data.items}
    />
  );
}

async function PostsSection({ userId }: { userId: string }) {
  const { data } = await getUserPosts(userId, 1);
  return (
    <UserSectionTable
      variant="posts"
      userId={userId}
      title="작성한 게시글"
      emptyMessage="작성한 게시글이 없습니다."
      items={data.items}
    />
  );
}

async function CommentsSection({ userId }: { userId: string }) {
  const { data } = await getUserComments(userId, 1);
  return (
    <UserSectionTable
      variant="comments"
      userId={userId}
      title="작성한 댓글"
      emptyMessage="작성한 댓글이 없습니다."
      items={data.items}
    />
  );
}

export default async function UserDetailPage({ params }: Props) {
  const { id } = await params;

  const { data: user } = await getUserDetail(id);

  return (
    <div className={styles.page}>
      <UserDetail user={user} />

      <div className={styles.tableSections}>
        <Suspense fallback={<div className={styles.sectionSkeleton} />}>
          {user.role === 'CLIENT' ? (
            <OrdersSection userId={id} />
          ) : (
            <ServicesSection userId={id} />
          )}
        </Suspense>

        <Suspense fallback={<div className={styles.sectionSkeleton} />}>
          <ReportsReceivedSection userId={id} />
        </Suspense>

        <Suspense fallback={<div className={styles.sectionSkeleton} />}>
          <ReportsSentSection userId={id} />
        </Suspense>

        <Suspense fallback={<div className={styles.sectionSkeleton} />}>
          <PostsSection userId={id} />
        </Suspense>

        <Suspense fallback={<div className={styles.sectionSkeleton} />}>
          <CommentsSection userId={id} />
        </Suspense>
      </div>
    </div>
  );
}
