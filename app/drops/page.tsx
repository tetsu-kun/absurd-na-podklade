import Link from 'next/link'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function DropsPage() {
  // Получаем все активные дропы
  const drops = await prisma.drop.findMany({
    where: { status: 'LIVE' },
    include: { items: true },
    orderBy: { startDate: 'desc' },
  })

  return (
    <main className="min-h-screen bg-white text-black p-4 md:p-12 font-mono">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-black uppercase mb-8 border-b-4 border-black pb-4">
          Активные дропы
        </h1>

        {drops.length === 0 ? (
          <p className="text-xl">Пока нет активных дропов. Загляни в архив или подпишись на обновления.</p>
        ) : (
          drops.map((drop) => (
            <section key={drop.id} className="mb-16">
              <h2 className="text-3xl font-bold uppercase mb-2">{drop.title}</h2>
              <p className="text-gray-700 mb-6">{drop.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {drop.items.map((item) => (
                  <article key={item.id} className="border-2 border-black p-4">
                    <div className="aspect-[3/4] bg-gray-200 mb-4 border-2 border-black">
                      <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-xl font-bold uppercase mb-2">{item.name}</h3>
                    <p className="text-sm text-gray-700 mb-3">{item.description}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold">{item.price.toLocaleString()} ₽</span>
                      <span className="text-sm font-bold">
                        {item.stock > 0 ? `В наличии: ${item.stock}` : 'SOLD OUT'}
                      </span>
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
  );
}