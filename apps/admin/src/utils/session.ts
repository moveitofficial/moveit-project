import { cookies } from 'next/headers';

interface AdminSession {
  adminId: string;
  isSuper: boolean;
}

interface JwtPayload {
  sub?: unknown;
  isSuper?: unknown;
}

export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_moveit_access_token')?.value;
    if (!token) return null;

    const [, payloadPart] = token.split('.');
    if (!payloadPart) return null;

    const rawPayload = Buffer.from(payloadPart, 'base64url').toString('utf8');

    const payload = JSON.parse(rawPayload) as unknown as JwtPayload;

    const hasValidSub = typeof payload.sub === 'string';
    const hasValidIsSuper = typeof payload.isSuper === 'boolean';

    if (!hasValidSub || !hasValidIsSuper) {
      return null;
    }

    return {
      adminId: payload.sub as string,
      isSuper: payload.isSuper as boolean,
    };
  } catch {
    return null;
  }
}
