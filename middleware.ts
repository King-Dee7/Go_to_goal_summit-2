import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protect /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const isAdmin = !!(user && (
      user.app_metadata?.role === 'admin' ||
      user.user_metadata?.role === 'admin' ||
      user.app_metadata?.is_admin === true ||
      user.user_metadata?.is_admin === true
    ));

    // Exclude the login page itself to avoid infinite redirect
    if (request.nextUrl.pathname === '/admin/login') {
      if (isAdmin) {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
      return response
    }

    if (!isAdmin) {
      return NextResponse.redirect(new URL('/admin/login?error=unauthorized', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
