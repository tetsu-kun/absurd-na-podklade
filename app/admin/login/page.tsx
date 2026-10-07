'use client'

import { useActionState } from 'react'
import { loginAction } from './actions'

export default function LoginPage() {
  // useActionState обрабатывает возврат { error: '...' } из Server Action
  const [state, formAction, isPending] = useActionState(loginAction, null)

  return (
    <main className="min-h-screen bg-white text-black flex items-center justify-center p-4 font-mono">
      <div className="w-full max-w-md border-4 border-black p-8">
        <h1 className="text-3xl font-black uppercase mb-2 border-b-4 border-black pb-4">
          Вход в админку
        </h1>
        <p className="text-sm text-gray-600 mb-8">
          Введите мастер-пароль для доступа к панели управления
        </p>

        {/* 🔴 Блок отображения ошибки */}
        {state?.error && (
          <div className="mb-6 p-4 bg-red-100 border-2 border-red-600 text-red-800 font-bold text-sm uppercase">
            ⚠️ {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-bold uppercase mb-2">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              autoFocus
              disabled={isPending}
              className="w-full border-2 border-black p-3 font-mono focus:outline-none focus:border-gray-600 disabled:bg-gray-100"
              placeholder="•••••"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-black text-white border-2 border-black px-6 py-3 font-black uppercase hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isPending ? 'Проверка...' : 'Войти'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t-2 border-gray-200">
          <a href="/" className="text-sm text-gray-600 hover:text-black underline">
            ← Вернуться на сайт
          </a>
        </div>
      </div>
    </main>
  )
}