interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminDetailPage({ params }: Props) {
  const { id } = await params;

  return <div>{id} 관리자 상세 페이지</div>;
}
