'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export async function registerBanner(formData: FormData): Promise<void> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  const response = await fetch(`${BASE_URL}/admin/main-settings/banners`, {
    method: 'POST',
    headers: { Cookie: cookieHeader },
    body: formData,
  });

  if (!response.ok) {
    const json = (await response.json().catch(() => ({}))) as {
      message?: string;
    };
    throw new Error(json.message ?? '배너 등록에 실패했습니다.');
  }

  revalidatePath('/main-setting');
}
