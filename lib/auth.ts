import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!
const MASTER_PASSWORD = process.env.MASTER_PASSWORD!

// Хешируем пароль при первом запуске (можно захешировать заранее)
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Генерация токенов
export function generateAccessToken(): string {
  return jwt.sign({ type: 'access' }, ACCESS_SECRET, { expiresIn: '15m' })
}

export function generateRefreshToken(): string {
  return jwt.sign({ type: 'refresh' }, REFRESH_SECRET, { expiresIn: '7d' })
}

// Проверка токенов
export function verifyAccessToken(token: string): { valid: boolean } {
  try {
    jwt.verify(token, ACCESS_SECRET)
    return { valid: true }
  } catch {
    return { valid: false }
  }
}

export function verifyRefreshToken(token: string): { valid: boolean } {
  try {
    jwt.verify(token, REFRESH_SECRET)
    return { valid: true }
  } catch {
    return { valid: false }
  }
}

// Установка cookies
export async function setAuthCookies(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies()
  
  cookieStore.set('access_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60, // 15 минут
    path: '/',
  })

  cookieStore.set('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60, // 7 дней
    path: '/',
  })
}

// Очистка cookies
export async function clearAuthCookies() {
  const cookieStore = await cookies()
  cookieStore.delete('access_token')
  cookieStore.delete('refresh_token')
}

// Получение токенов из cookies
export async function getTokens() {
  const cookieStore = await cookies()
  return {
    accessToken: cookieStore.get('access_token')?.value,
    refreshToken: cookieStore.get('refresh_token')?.value,
  }
}