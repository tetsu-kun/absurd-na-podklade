import { PrismaClient } from '@prisma/client'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const prisma = new PrismaClient()

export default async function DropPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Получаем дроп и все вещи в нем
  const drop = await prisma.drop.findUnique({
    where: { id },
    include: {
      items: {
        orderBy: { createdAt: 'asc' }
      }
    }
  })

  if (!drop) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-white text-black p-4 md:p-12 font-mono">
      <div className="max-w-6xl mx-auto">
        <Link href="/drops" className="inline-block mb-8 text-sm font-bold uppercase hover:underline">
          ← Назад к списку дропов
        </Link>

        {/* Шапка дропа */}
        <header className="mb-12 border-b-4 border-black pb-6">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-4">
            {drop.title}
          </h1>
          {drop.description && (
            <p className="text-lg md:text-xl text-gray-700 max-w-2xl mb-6">
              {drop.description}
            </p>
          )}
          <div className="inline-block bg-black text-white px-4 py-2 text-sm font-bold uppercase tracking-widest">
            Статус: {drop.status === 'LIVE' ? 'АКТИВЕН' : drop.status === 'ARCHIVED' ? 'АРХИВ' : 'ЧЕРНОВИК'}
          </div>
        </header>

        {/* Сетка вещей в дропе */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {drop.items.length === 0 ? (
            <div className="col-span-2 border-2 border-black p-12 text-center">
              <p className="text-xl font-bold uppercase">В этом дропе пока нет вещей</p>
            </div>
          ) : (
            drop.items.map((item) => (
              // 🟢 ИЗМЕНЕНИЕ 1: Добавили 'relative' в className, чтобы бейдж позиционировался относительно карточки
              <article key={item.id} className="border-2 border-black p-4 flex flex-col relative">
                
                {/*  ИЗМЕНЕНИЕ 2: Добавлен бейдж категории в левом верхнем углу */}
                <div className="absolute top-2 left-2 z-10">
                  <span className={`text-[10px] md:text-xs font-black uppercase px-2 py-1 border-2 border-black ${
                    item.category === 'ART' ? 'bg-purple-200' : 
                    item.category === 'ACCESSORY' ? 'bg-yellow-200' : 'bg-white'
                  }`}>
                    {item.category === 'ART' ? 'Картина' : 
                     item.category === 'ACCESSORY' ? 'АКСЕССУАР' : 'ОДЕЖДА'}
                  </span>
                </div>

                <div className="aspect-[3/4] bg-gray-200 mb-4 border-2 border-black overflow-hidden relative">
                  <img 
                    src={item.images[0]} 
                    alt={item.name} 
                    className={`w-full h-full object-cover transition-all ${item.stock <= 0 ? 'grayscale' : ''}`}
                  />
                  {item.stock <= 0 && (
                    <div className="absolute top-2 right-2 bg-black text-white text-xs font-bold px-2 py-1 uppercase">
                      Sold Out
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-bold uppercase mb-2">{item.name}</h3>
                <p className="text-sm text-gray-700 mb-4 flex-1 line-clamp-3">{item.description}</p>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold">{item.price.toLocaleString()} ₽</span>
                  <span className="text-sm font-bold">
                    {item.stock > 0 ? `В наличии: ${item.stock}` : 'Нет в наличии'}
                  </span>
                </div>
                
                <Link 
                  href={`/drops/${item.id}`} 
                  className={`block w-full py-3 font-bold uppercase text-center border-2 border-black transition-colors ${
                    item.stock > 0 
                      ? 'bg-black text-white hover:bg-gray-800' 
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300'
                  }`}
                >
                  {item.stock > 0 ? 'Смотреть вещь' : 'Распродано'}
                </Link>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  )
}