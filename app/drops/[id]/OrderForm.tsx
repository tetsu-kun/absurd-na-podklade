'use client'

import { useActionState } from 'react'
import { createOrder } from '@/actions'

export default function OrderForm({ itemId }: { itemId: string }) {
  const [state, formAction, isPending] = useActionState(createOrder, null)
  const isSuccess = !!state?.success

  return (
    <div className="bg-brand-black p-6 text-white md:p-10">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-2xl font-black">ХОЧУ ЭТО</h2>
        <span className="font-mono text-xs text-white/50">ФОРМА ЗАКАЗА</span>
      </div>
      
      <p className="mt-2 text-sm text-white/60">
        Оставь контакты — напишем в Telegram и уточним детали.
      </p>

      {/* Сообщения */}
      {state?.error && (
        <div className="mt-4 rounded-soft border-2 border-brand-red bg-brand-red/20 p-3 font-mono text-xs text-brand-red-light">
          ⚠️ {state.error}
        </div>
      )}
      
      {state?.success && (
        <div className="mt-4 rounded-soft border-2 border-brand-blue-bright bg-brand-blue/20 p-3 font-mono text-xs text-brand-blue-light">
          ✅ {state.success}
        </div>
      )}

      <form action={formAction} className="mt-6 grid gap-3">
        <input type="hidden" name="itemId" value={itemId} />
        
        <label className="grid gap-2 font-mono text-xs font-bold">
          НИК В TELEGRAM *
          <input
            type="text"
            name="telegramUsername"
            required
            disabled={isPending || isSuccess}
            placeholder="@username"
            className="rounded-soft border-2 border-white/40 bg-transparent px-4 py-3 font-sans text-base text-white outline-none transition-colors placeholder:text-white/25 focus:border-brand-blue-bright disabled:opacity-50"
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-2 font-mono text-xs font-bold">
            ИМЯ *
            <input
              type="text"
              name="customerName"
              required
              disabled={isPending || isSuccess}
              placeholder="Как к тебе обращаться"
              className="rounded-soft border-2 border-white/40 bg-transparent px-4 py-3 font-sans text-base text-white outline-none transition-colors placeholder:text-white/25 focus:border-brand-blue-bright disabled:opacity-50"
            />
          </label>

          <label className="grid gap-2 font-mono text-xs font-bold">
            ТЕЛЕФОН *
            <input
              type="tel"
              name="phone"
              required
              placeholder="+7 999 000-00-00"
              disabled={isPending || isSuccess}
              className="rounded-soft border-2 border-white/40 bg-transparent px-4 py-3 font-sans text-base text-white outline-none transition-colors placeholder:text-white/25 focus:border-brand-blue-bright disabled:opacity-50"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={isPending || isSuccess}
          className="mt-5 flex w-full items-center justify-between rounded-soft border-none bg-brand-red px-6 py-4 font-display text-sm font-black text-white shadow-button transition-colors hover:bg-brand-blue disabled:opacity-50"
        >
          {isPending ? 'ОТПРАВКА...' : isSuccess ? 'ЗАЯВКА ОТПРАВЛЕНА' : 'ОТПРАВИТЬ ЗАЯВКУ'}
          <span className="font-mono text-xl">→</span>
        </button>
      </form>
    </div>
  )
}