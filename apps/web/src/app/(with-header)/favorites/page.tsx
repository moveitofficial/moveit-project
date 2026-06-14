import type { Metadata } from 'next';

import { FavoritesView } from '@/feature/favorites/components/FavoritesView';

export const metadata: Metadata = {
  title: '나의 찜목록 | moveit',
};

export default function FavoritesPage() {
  return <FavoritesView />;
}
