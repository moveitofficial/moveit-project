interface Props {
  params: Promise<{ id: string }>;
}

export default async function UserDetailPage({ params }: Props) {
  const { id } = await params;

  return <div>{id} 유저 상세 페이지</div>;
}