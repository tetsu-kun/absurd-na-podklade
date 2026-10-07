import { PrismaClient } from '@prisma/client'
import Link from 'next/link'

const prisma = new PrismaClient()

export default async function DropsPage() {
  const drops = await prisma.drop.findMany({
    where: {
      status: { not: 'ARCHIVED' },
      items: {
        some: {
          stock: { gt: 0 }
        }
      }
    },
    include: {
      items: {
        where: {
          stock: { gt: 0 }
        },
        orderBy: { createdAt: 'asc' }
      }
    },
    orderBy: { startDate: 'desc' },
  })

  return (
    <main className="min-h-screen bg-white text-black p-4 md:p-12 font-mono">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-black uppercase mb-8 border-b-4 border-black pb-4">
          Активные дропы
        </h1>

        {drops.length === 0 ? (
          <div className="border-2 border-black p-8 text-center">
            <p className="text-xl font-bold uppercase">Пока нет активных дропов</p>
            <p className="text-gray-600 mt-2">Здесь будут появляться новые коллекции</p>
          </div>
        ) : (
          drops.map((drop) => (
            <section key={drop.id} className="mb-16">
              <Link href={`/drop/${drop.id}`} className="group inline-block">
                <h2 className="text-3xl font-bold uppercase mb-2 group-hover:underline decoration-4 underline-offset-4">
                  {drop.title} ↗
                </h2>
              </Link>
              <p className="text-gray-700 mb-6">{drop.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {drop.items.map((item) => (
                  // 🟢 ИЗМЕНЕНИЕ 1: Добавили 'relative' в конец className
                  <article key={item.id} className="border-2 border-black p-4 relative">
                    
                    {/* 🟢 ИЗМЕНЕНИЕ 2: Добавили блок с бейджем категории */}
                    <div className="absolute top-2 left-2 z-10">
                      <span className={`text-[10px] md:text-xs font-black uppercase px-2 py-1 border-2 border-black ${
                        item.category === 'ART' ? 'bg-purple-200' : 
                        item.category === 'ACCESSORY' ? 'bg-yellow-200' : 'bg-white'
                      }`}>
                        {item.category === 'ART' ? 'Картина' : 
                         item.category === 'ACCESSORY' ? 'АКСЕССУАР' : 'ОДЕЖДА'}
                      </span>
                    </div>

                    <div className="aspect-[3/4] bg-gray-200 mb-4 border-2 border-black">
                      <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-xl font-bold uppercase mb-2">{item.name}</h3>
                    <p className="text-sm text-gray-700 mb-3">{item.description}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold">{item.price.toLocaleString()} ₽</span>
                      <span className="text-sm font-bold">В наличии: {item.stock}</span>
                    </div>
                    <Link 
                      href={`/drops/${item.id}`} 
                      className="block w-full bg-black text-white py-3 font-bold uppercase text-center hover:bg-gray-800"
                    >
                      Смотреть вещь
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </main>
  )
}