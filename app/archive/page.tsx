import { PrismaClient } from '@prisma/client'
import ItemCard from '@/components/ItemCard'
import Marquee from '@/components/Marquee'
export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

export default async function ArchivePage() {
  const allDrops = await prisma.drop.findMany({
    include: {
      items: {
        orderBy: { createdAt: 'asc' }
      }
    },
    orderBy: { startDate: 'desc' },
  })

  const archiveDrops = allDrops
    .map(drop => {
      const soldItems = drop.items.filter(item => item.stock <= 0)
      
      const itemsToShow = drop.status === 'ARCHIVED' 
        ? drop.items 
        : soldItems

      return {
        ...drop,
        itemsToShow,
        isArchiveByStatus: drop.status === 'ARCHIVED'
      }
    })
    .filter(drop => drop.itemsToShow.length > 0)

  return (
    <>
      {/* HERO АРХИВА */}
      <section className="border-b-2 border-brand-black bg-brand-black px-4 py-12 text-white md:px-8 md:py-20">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-brand-blue-bright">
            ТО, ЧЕГО УЖЕ НЕТ
          </p>
          <div className="mt-5 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <h1 className="font-display text-[60px] font-black tracking-tight md:text-[96px]">
              АРХИВ
            </h1>
            <p className="max-w-md border-l-4 border-brand-blue-bright pl-4 text-sm leading-relaxed text-white/80">
              Здесь живут распроданные вещи. Смотреть можно, купить — уже нет. 
              Иногда прошлое должно оставаться прошлым.
            </p>
          </div>
        </div>
      </section>

      {/* СПИСОК АРХИВНЫХ ДРОПОВ */}
      {archiveDrops.length === 0 ? (
        <div className="border-b-2 border-brand-black p-12 text-center">
          <p className="font-display text-xl font-black uppercase">
            Архив пока пуст
          </p>
          <p className="mt-2 text-sm text-brand-ink-muted">
            Здесь будут появляться завершенные дропы
          </p>
        </div>
      ) : (
        <div className="space-y-0">
          {archiveDrops.map((drop, dropIndex) => {
            const colsClass = 
              drop.itemsToShow.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
              drop.itemsToShow.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
              drop.itemsToShow.length === 3 ? 'grid-cols-1 md:grid-cols-3' :
              'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'

            return (
              <section key={drop.id} className="border-b-2 border-brand-black p-4 md:p-6">
                
                {/* Баннер дропа — серый, без ярких цветов */}
                <div className="mb-6 grid w-full overflow-hidden rounded-soft border-2 border-brand-black bg-brand-gray text-left shadow-card">
                  <div className="p-5 md:p-8">
                    <p className="font-mono text-xs font-bold text-brand-ink-muted">
                      {dropIndex + 1} / {new Date(drop.startDate).getFullYear()}
                    </p>
                    <h2 className="mt-3 font-display text-3xl font-black md:text-5xl">
                      {drop.title}
                    </h2>
                    {drop.description && (
                      <p className="mt-3 text-sm text-brand-ink-muted">
                        {drop.description}
                      </p>
                    )}
                    {drop.isArchiveByStatus && (
                      <span className="mt-4 inline-block rounded-full border-2 border-brand-black bg-brand-black px-3 py-1 font-mono text-xs font-bold text-white">
                        ЗАВЕРШЕН
                      </span>
                    )}
                  </div>
                </div>

                {/* Сетка товаров */}
                {/* Сетка товаров - ВСЕГДА 3 В РЯД */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {drop.itemsToShow.map((item, idx) => (
                    <ItemCard key={item.id} item={item} index={idx} />
                  ))}
                </div>

                {/* Статистика дропа */}
                <div className="mt-6 flex justify-between border-t-2 border-brand-black pt-4 font-mono text-xs font-bold uppercase text-brand-ink-muted">
                  <span>Всего вещей: {drop.itemsToShow.length}</span>
                  <span>Продано: {drop.itemsToShow.filter(i => i.stock <= 0).length}</span>
                </div>
              </section>
            )
          })}
        </div>
      )}

      <Marquee />
    </>
  )
}