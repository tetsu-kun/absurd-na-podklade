'use server'

import { generateAccessToken, generateRefreshToken, setAuthCookies } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function loginAction(prevState: any, formData: FormData) {
  const rawPassword = formData.get('password')
  const password = typeof rawPassword === 'string' ? rawPassword.trim() : ''
  
  const envPassword = (process.env.MASTER_PASSWORD || '').trim()

  if (!password) {
    return { error: 'Введите пароль' }
  }

  if (password !== envPassword) {
    return { error: 'Неверный пароль. Проверьте .env файл.' }
  }

  // Генерация токенов и установка кук — здесь может быть ошибка
  try {
    const accessToken = generateAccessToken()
    const refreshToken = generateRefreshToken()
    await setAuthCookies(accessToken, refreshToken)
    revalidatePath('/admin')
  } catch (error) {
    console.error('Ошибка при генерации токенов:', error)
    return { error: 'Ошибка при авторизации. Попробуйте ещё раз.' }
  }

  // Редирект ВЫНЕСЕН за пределы try/catch
  // NEXT_REDIRECT не будет перехвачен
  redirect('/admin/orders')
}

export async function logoutAction() {
  const { clearAuthCookies } = await import('@/lib/auth')
  await clearAuthCookies()
  redirect('/admin/login')
}