import { CreateContainer } from '@/components/layout/CreateContainer';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CreateContainer>{children}</CreateContainer>;
}
