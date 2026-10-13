import { PrismaClient } from '@prisma/client'
import Link from 'next/link'
import ItemCard from '@/components/ItemCard'
import Marquee from '@/components/Marquee'

const prisma = new PrismaClient()

export default async function DropsPage() {
  const drops = await prisma.drop.findMany({
    where: {
      status: { not: 'ARCHIVED' },
      items: { some: { stock: { gt: 0 } } }
    },
    include: {
      items: {
        where: { stock: { gt: 0 } },
        orderBy: { createdAt: 'asc' }
      }
    },
    orderBy: { startDate: 'desc' },
  })

  return (
    <>
      {/* HERO ДРОПОВ */}
      <section className="border-b-2 border-brand-black px-4 py-12 md:px-8 md:py-20">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-brand-red">
            АКТУАЛЬНЫЕ КОЛЛЕКЦИИ
          </p>
          <div className="mt-5 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <h1 className="font-display text-[60px] font-black tracking-tight md:text-[96px]">
              ДРОПЫ
            </h1>
            <p className="max-w-md border-l-4 border-brand-blue pl-4 text-sm leading-relaxed">
              Каждый дроп — законченная история из одежды, аксессуаров и объектов. 
              Вещи не повторяются после окончания тиража.
            </p>
          </div>
        </div>
      </section>

      {/* СПИСОК ДРОПОВ */}
      {drops.length === 0 ? (
        <div className="border-b-2 border-brand-black p-12 text-center">
          <p className="font-display text-xl font-black uppercase">
            Пока нет активных дропов
          </p>
        </div>
      ) : (
        drops.map((drop, dropIndex) => {
          // Определяем количество колонок
          const colsClass = 
            drop.items.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
            drop.items.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
            drop.items.length === 3 ? 'grid-cols-1 md:grid-cols-3' :
            'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'

          // Цвет дропа чередуется
          const bannerColor = dropIndex % 2 === 0 ? 'hover:bg-brand-red' : 'hover:bg-brand-blue'

          return (
            <section key={drop.id} className="border-b-2 border-brand-black p-4 md:p-6">
              
              {/* Баннер дропа */}
              <Link 
                href={`/drop/${drop.id}`}
                className={`group mb-6 grid w-full overflow-hidden rounded-soft border-2 border-brand-black text-left shadow-card transition-all hover:-translate-y-0.5 ${bannerColor} hover:text-white`}
              >
                <div className="p-5 md:p-8">
                  <p className="font-mono text-xs font-bold">
                    {dropIndex + 1} / {new Date(drop.startDate).getFullYear()}
                  </p>
                  <h2 className="mt-3 font-display text-3xl font-black md:text-5xl">
                    {drop.title}
                  </h2>
                  {drop.description && (
                    <p className="mt-3 text-sm opacity-80">
                      {drop.description}
                    </p>
                  )}
                </div>
                <div className="hidden md:grid w-28 place-items-center border-l-2 border-current font-mono text-2xl">
                  →
                </div>
              </Link>

              {/* Сетка товаров - ВСЕГДА 3 В РЯД */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {drop.items.map((item, idx) => (
                  <ItemCard key={item.id} item={item} index={idx} />
                ))}
              </div>
            </section>
          )
        })
      )}

      <Marquee />
    </>
  )
}