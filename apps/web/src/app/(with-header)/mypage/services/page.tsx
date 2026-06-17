import type { Metadata } from 'next';

import { MyServicesView } from '@/feature/user/components/MyServicesView';

export const metadata: Metadata = {
  title: '서비스관리 | moveit',
};

export default function MyServicesPage() {
  return <MyServicesView />;
}
