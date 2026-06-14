import { NextResponse, type NextRequest } from 'next/server';

const ACCESS_COOKIE = 'moveit_access_token';

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get(ACCESS_COOKIE)?.value;

  if (accessToken) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login'],
};
