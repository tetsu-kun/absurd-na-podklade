import { PrismaClient } from '@prisma/client'
import { notFound } from 'next/navigation'
import Link from 'next/link'

const prisma = new PrismaClient()

// В Next.js 15 params — это Promise, поэтому используем await
export default async function ItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // 1. Ищем вещь по ID и подтягиваем данные её Дропа (для хлебных крошек)
  const item = await prisma.item.findUnique({
    where: { id },
    include: { drop: true },
  })

  // Если вещь не найдена (например, неверный ID в URL), показываем 404
  if (!item) {
    notFound()
  }

  // Парсим мерки из JSON
  const measurements = item.measurements as Record<string, string> | null

  return (
    <main className="min-h-screen bg-white text-black p-4 md:p-12 font-mono">
      <div className="max-w-6xl mx-auto">
        
        {/* Навигация назад */}
        <Link href="/drops" className="inline-block mb-8 text-sm font-bold uppercase hover:underline">
          ← Назад к дропам
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          
          {/* ЛЕВАЯ КОЛОНКА: ГАЛЕРЕЯ */}
          <div className="space-y-4">
            {/* Главное фото */}
            <div className="aspect-[3/4] bg-gray-200 border-4 border-black overflow-hidden">
              <img 
                src={item.images[0]} 
                alt={item.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Миниатюры (если есть больше 1 фото) */}
            {item.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {item.images.map((img, index) => (
                  <div key={index} className="aspect-square bg-gray-200 border-2 border-black overflow-hidden">
                    <img src={img} alt={`${item.name} view ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ПРАВАЯ КОЛОНКА: ИНФОРМАЦИЯ */}
          <div className="flex flex-col">
            {/* Хлебные крошки */}
            <p className="text-sm text-gray-500 uppercase mb-2">
              {item.drop.title} / {item.name}
            </p>

            <h1 className="text-4xl md:text-5xl font-black uppercase leading-tight mb-4">
              {item.name}
            </h1>

            <p className="text-3xl font-bold mb-8">{item.price.toLocaleString()} ₽</p>

            <div className="text-lg leading-relaxed mb-8 border-t-2 border-b-2 border-black py-6">
              {item.description}
            </div>

            {/* Блок мерок */}
            {measurements && Object.keys(measurements).length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold uppercase mb-4">Мерки изделия:</h3>
                <div className="bg-gray-100 p-6 border-2 border-black">
                  <ul className="space-y-3">
                    {Object.entries(measurements).map(([key, value]) => (
                      <li key={key} className="flex justify-between border-b border-gray-300 pb-2 last:border-0">
                        <span className="text-gray-600 uppercase text-sm">{key}:</span>
                        <span className="font-bold">{value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Статус и кнопка */}
            <div className="mt-auto pt-6">
              {item.stock > 0 && !item.isSold ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold uppercase bg-black text-white px-4 py-3">
                    В наличии: {item.stock} шт.
                  </span>
                  {/* Пока просто ссылка на ТГ, позже сделаем форму заказа */}
                  <a 
                    href="https://t.me/your_username" 
                    target="_blank"
                    className="flex-1 bg-white text-black border-2 border-black px-6 py-3 font-black uppercase text-center hover:bg-black hover:text-white transition-colors"
                  >
                    Забрать в ТГ
                  </a>
                </div>
              ) : (
                <div className="text-xl font-bold uppercase bg-gray-200 text-gray-500 px-6 py-3 text-center border-2 border-gray-300">
                  Sold Out
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}