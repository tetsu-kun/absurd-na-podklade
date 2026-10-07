import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken, verifyRefreshToken } from '@/lib/auth'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Защищаем все маршруты /admin/* кроме /admin/login
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const accessToken = request.cookies.get('access_token')?.value
    const refreshToken = request.cookies.get('refresh_token')?.value

    // Проверяем access token
    if (accessToken) {
      const { valid } = verifyAccessToken(accessToken)
      if (valid) {
        return NextResponse.next()
      }
    }

    // Access token истек, пробуем refresh
    if (refreshToken) {
      const { valid } = verifyRefreshToken(refreshToken)
      if (valid) {
        // Разрешаем доступ, но нужно обновить access token
        // Это сделает client-side компонент или server action
        const response = NextResponse.next()
        return response
      }
    }

    // Нет валидных токенов — редирект на логин
    const loginUrl = new URL('/admin/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}