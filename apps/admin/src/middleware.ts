import { NextResponse, type NextRequest } from 'next/server';

const ADMIN_ACCESS_COOKIE = 'admin_moveit_access_token';

const PUBLIC_ROUTES = ['/login'];
const PASSWORD_RESET_ROUTE = '/password/reset';

interface JwtPayload {
  mustChangePassword?: boolean;
}

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const decoded = atob(payload.replaceAll('-', '+').replaceAll('_', '/'));
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get(ADMIN_ACCESS_COOKIE)?.value;
  const { pathname } = req.nextUrl;

  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
  const isPasswordReset = pathname.startsWith(PASSWORD_RESET_ROUTE);

  if (!accessToken) {
    if (!isPublic) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next();
  }

  const payload = decodeJwtPayload(accessToken);
  const mustChangePassword = payload?.mustChangePassword === true;

  if (mustChangePassword) {
    if (!isPasswordReset) {
      return NextResponse.redirect(new URL('/password/reset', req.url));
    }
    return NextResponse.next();
  }

  if (isPasswordReset || isPublic) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
