import { NextResponse, type NextRequest } from 'next/server';

const ACCESS_COOKIE = 'moveit_access_token';
const REFRESH_COOKIE = 'moveit_refresh_token';

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
).replace(/\/$/, '');

interface RefreshResult {
  accessToken: string;
  setCookies: string[];
}

// refresh 쿠키로 백엔드에서 새 access 토큰을 재발급받는다.
async function tryRefresh(refreshToken: string): Promise<RefreshResult | null> {
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { cookie: `${REFRESH_COOKIE}=${refreshToken}` },
    });
    if (!res.ok) {
      return null;
    }

    const setCookies = res.headers.getSetCookie();
    const accessCookie = setCookies.find((cookie) =>
      cookie.startsWith(`${ACCESS_COOKIE}=`),
    );
    if (accessCookie === undefined) {
      return null;
    }

    const accessToken = /^[^=]+=([^;]+)/.exec(accessCookie)?.[1];
    if (accessToken === undefined) {
      return null;
    }

    return { accessToken, setCookies };
  } catch {
    return null;
  }
}

function withAccessCookie(
  cookieHeader: string | null,
  accessToken: string,
): string {
  const access = `${ACCESS_COOKIE}=${accessToken}`;
  return cookieHeader ? `${cookieHeader}; ${access}` : access;
}

export async function middleware(req: NextRequest) {
  const access = req.cookies.get(ACCESS_COOKIE)?.value;
  const refresh = req.cookies.get(REFRESH_COOKIE)?.value;
  const isLoginPage = req.nextUrl.pathname === '/login';

  // 이미 로그인 상태(access 보유)
  if (access !== undefined) {
    return isLoginPage
      ? NextResponse.redirect(new URL('/', req.url))
      : NextResponse.next();
  }

  // access 만료(쿠키 삭제됨) + refresh 보유 → 서버 렌더 전에 재발급해 주입한다.
  if (refresh !== undefined) {
    const refreshed = await tryRefresh(refresh);

    if (refreshed !== null) {
      // /login에서 재발급되면 곧장 홈으로
      if (isLoginPage) {
        const response = NextResponse.redirect(new URL('/', req.url));
        for (const cookie of refreshed.setCookies) {
          response.headers.append('set-cookie', cookie);
        }
        return response;
      }

      // 이번 요청(request)에 새 access 쿠키를 주입해 서버 컴포넌트가 로그인 상태로 렌더되게 한다.
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set(
        'cookie',
        withAccessCookie(req.headers.get('cookie'), refreshed.accessToken),
      );
      const response = NextResponse.next({
        request: { headers: requestHeaders },
      });
      // 브라우저에도 새 access 쿠키를 저장한다(백엔드 Set-Cookie 그대로 전달).
      for (const cookie of refreshed.setCookies) {
        response.headers.append('set-cookie', cookie);
      }
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  // 정적 자산·_next·확장자 파일을 제외한 모든 경로에서 동작
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*[.].*).*)'],
};
