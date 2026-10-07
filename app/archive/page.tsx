import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function ArchivePage() {
  // Получаем все дропы
  const allDrops = await prisma.drop.findMany({
    include: {
      items: {
        orderBy: { createdAt: 'asc' }
      }
    },
    orderBy: { startDate: 'desc' },
  })

  // Фильтруем: показываем только те, что в архиве ИЛИ имеют распроданные вещи
  const archiveDrops = allDrops
    .map(drop => {
      const soldItems = drop.items.filter(item => item.isSold || item.stock <= 0)
      
      // Если статус ARCHIVED — берем все вещи
      // Иначе — только распроданные
      const itemsToShow = drop.status === 'ARCHIVED' 
        ? drop.items 
        : soldItems

      return {
        ...drop,
        itemsToShow,
        isArchiveByStatus: drop.status === 'ARCHIVED'
      }
    })
    .filter(drop => 
      drop.isArchiveByStatus || drop.itemsToShow.length > 0
    )

  return (
    <main className="min-h-screen bg-white text-black p-4 md:p-12 font-mono">
      <div className="max-w-6xl mx-auto">
        
        <h1 className="text-4xl md:text-6xl font-black uppercase mb-4 border-b-4 border-black pb-4">
          Архив
        </h1>
        <p className="text-lg text-gray-700 mb-12 max-w-2xl">
          Завершенные дропы и распроданные вещи.
        </p>

        {archiveDrops.length === 0 ? (
          <div className="border-2 border-black p-8 text-center">
            <p className="text-xl font-bold uppercase">Архив пока пуст</p>
            <p className="text-gray-600 mt-2">Здесь будут появляться завершенные дропы</p>
          </div>
        ) : (
          <div className="space-y-16">
            {archiveDrops.map((drop) => (
              <section key={drop.id} className="border-2 border-black">
                
                {/* Шапка дропа */}
                <div className="bg-black text-white p-6 border-b-2 border-black">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl md:text-3xl font-black uppercase">
                      {drop.title}
                    </h2>
                    {drop.isArchiveByStatus && (
                      <span className="text-xs bg-white text-black px-2 py-1 font-bold uppercase">
                        Завершен
                      </span>
                    )}
                  </div>
                  {drop.description && (
                    <p className="text-gray-300 text-sm">{drop.description}</p>
                  )}
                </div>

                {/* Сетка вещей */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {drop.itemsToShow.length === 0 ? (
                    <p className="text-gray-500 col-span-2 text-center py-8">
                      В этом дропе пока нет вещей
                    </p>
                  ) : (
                    drop.itemsToShow.map((item) => (
                      <article 
                        key={item.id} 
                        className={`border-2 border-gray-300 p-4 ${
                          item.isSold || item.stock <= 0 
                            ? 'grayscale opacity-70' 
                            : ''
                        }`}
                      >
                        <div className="aspect-[3/4] bg-gray-200 mb-4 border-2 border-gray-300 overflow-hidden relative">
                          <img 
                            src={item.images[0]} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                          />
                          {(item.isSold || item.stock <= 0) && (
                            <div className="absolute top-2 right-2 bg-black text-white text-xs font-bold px-2 py-1 uppercase">
                              Sold Out
                            </div>
                          )}
                        </div>

                        <h3 className="text-lg font-bold uppercase mb-2">{item.name}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {item.description}
                        </p>

                        <div className="flex justify-between items-center text-sm">
                          <span className="font-bold">{item.price.toLocaleString()} ₽</span>
                          {(item.isSold || item.stock <= 0) ? (
                            <span className="text-gray-500 text-xs">Продано</span>
                          ) : (
                            <span className="text-green-600 text-xs font-bold">В наличии: {item.stock}</span>
                          )}
                        </div>
                      </article>
                    ))
                  )}
                </div>

                {/* Статистика */}
                <div className="bg-gray-100 p-4 border-t-2 border-black text-sm font-bold uppercase flex justify-between">
                  <span>Всего вещей: {drop.itemsToShow.length}</span>
                  <span>Продано: {drop.itemsToShow.filter(i => i.isSold || i.stock <= 0).length}</span>
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}