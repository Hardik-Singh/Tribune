import { NextRequest, NextResponse } from 'next/server';

const MODE_COOKIE = 'tribune-mode';
const VALID_MODES = ['ai', 'human'] as const;
type Mode = (typeof VALID_MODES)[number];

function isValidMode(value: string): value is Mode {
  return (VALID_MODES as readonly string[]).includes(value);
}

export function middleware(request: NextRequest): NextResponse {
  const response = NextResponse.next();

  // Check query param first, then header
  const queryMode = request.nextUrl.searchParams.get('mode');
  const headerMode = request.headers.get('X-Tribune-Mode');

  let detectedMode: Mode | null = null;

  if (queryMode && isValidMode(queryMode)) {
    detectedMode = queryMode;
  } else if (headerMode && isValidMode(headerMode)) {
    detectedMode = headerMode;
  }

  if (detectedMode) {
    response.cookies.set(MODE_COOKIE, detectedMode, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  } else {
    // Keep existing cookie; default to human if none exists
    const existing = request.cookies.get(MODE_COOKIE)?.value;
    if (!existing || !isValidMode(existing)) {
      response.cookies.set(MODE_COOKIE, 'human', {
        path: '/',
        httpOnly: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
      });
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - /api (API routes)
     * - /_next (Next.js internals)
     * - /favicon.ico, /robots.txt, etc. (static files)
     */
    '/((?!api|_next|favicon\\.ico|robots\\.txt|.*\\..*).*)',
  ],
};
