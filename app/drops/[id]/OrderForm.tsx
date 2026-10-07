'use client'

import { useState } from 'react'
import { createOrder } from '@/actions'

interface OrderFormProps {
  itemId: string
  stock: number
}

export default function OrderForm({ itemId, stock }: OrderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setMessage(null)

    const result = await createOrder(formData)

    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else if (result.success) {
      setMessage({ type: 'success', text: result.success })
    }

    setIsSubmitting(false)
  }

  if (stock <= 0) {
    return (
      <div className="text-xl font-bold uppercase bg-gray-200 text-gray-500 px-6 py-3 text-center border-2 border-gray-300">
        Sold Out
      </div>
    )
  }

  return (
    <div className="mt-8">
      {message && (
        <div className={`mb-4 p-4 border-2 ${
          message.type === 'success' 
            ? 'bg-green-100 border-green-600 text-green-800' 
            : 'bg-red-100 border-red-600 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <form action={handleSubmit} className="space-y-4">
        <input type="hidden" name="itemId" value={itemId} />
        
        <div>
          <label htmlFor="customerName" className="block text-sm font-bold uppercase mb-2">
            Ваше имя
          </label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            required
            className="w-full border-2 border-black p-3 font-mono focus:outline-none focus:border-gray-600"
            placeholder="Иван Иванов"
          />
        </div>

        <div>
          <label htmlFor="telegramUsername" className="block text-sm font-bold uppercase mb-2">
            Telegram для связи
          </label>
          <input
            type="text"
            id="telegramUsername"
            name="telegramUsername"
            required
            className="w-full border-2 border-black p-3 font-mono focus:outline-none focus:border-gray-600"
            placeholder="@username"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white border-2 border-black px-6 py-4 font-black uppercase hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Оформляем...' : 'Оформить заказ'}
        </button>
      </form>
    </div>
  )
}