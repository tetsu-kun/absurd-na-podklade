import { PrismaClient } from '@prisma/client'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ItemCard from '@/components/ItemCard'
import Breadcrumbs from '@/components/Breadcrumbs'
import Marquee from '@/components/Marquee'

const prisma = new PrismaClient()

export default async function DropPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

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

  const heroColor = 'bg-brand-red'
  const firstItemImage = drop.items[0]?.images[0]

  return (
    <>
      {/* Хлебные крошки */}
      <Breadcrumbs 
        items={[
          { label: 'Дропы', href: '/drops' },
          { label: drop.title }
        ]} 
      />

      {/* HERO ДРОПА - КОМПАКТНЫЙ */}
      <section className={`mx-4 mt-6 mb-8 overflow-hidden rounded-soft border-2 border-brand-black shadow-card lg:mx-6 ${heroColor} text-white`}>
        <div className="flex flex-col md:flex-row">
          {/* Левая часть: Текст */}
          <div className="flex min-h-[200px] flex-col justify-between border-b-2 border-brand-black p-5 md:min-h-[240px] md:border-b-0 md:border-r-2 md:p-8 md:w-1/2">
            <div className="flex justify-between font-mono text-xs font-bold">
              <span>ДРОП 01</span>
              <span>{new Date(drop.startDate).getFullYear()}</span>
            </div>
            
            <div className="py-6">
              <h1 className="font-display text-2xl font-black leading-none md:text-4xl">
                {drop.title}
              </h1>
              {drop.description && (
                <p className="mt-3 text-xs opacity-90 md:text-sm">
                  {drop.description}
                </p>
              )}
            </div>

            <p className="font-mono text-xs font-bold uppercase tracking-wider">
              {drop.items.length} {drop.items.length === 1 ? 'ВЕЩЬ' : 'ВЕЩЕЙ'}
            </p>
          </div>

          {/* Правая часть: Фото с оверлеем */}
          {firstItemImage && (
            <div className="relative min-h-[200px] md:min-h-[240px] md:w-1/2 overflow-hidden bg-brand-black">
              <img 
                src={firstItemImage} 
                alt={drop.title} 
                className="absolute inset-0 h-full w-full object-cover grayscale mix-blend-luminosity"
              />
              <div className="stripe-overlay absolute inset-0" />
              <span className="absolute bottom-3 right-3 font-display text-5xl font-black leading-none text-white/30 md:text-7xl">
                01
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ЗАГОЛОВОК СЕКЦИИ ТОВАРОВ */}
      <section className="border-b-2 border-brand-black px-4 py-4 md:px-6 md:py-6">
        <p className="font-mono text-xs font-bold uppercase tracking-wider text-brand-red">
          СОСТАВ ДРОПА
        </p>
        <h2 className="mt-1 font-display text-2xl font-black md:text-3xl">
          ВСЕ ВЕЩИ
        </h2>
      </section>

      {/* СЕТКА ТОВАРОВ - ВСЕГДА 3 В РЯД */}
      <section className="p-4 md:p-6">
        {drop.items.length === 0 ? (
          <div className="border-2 border-brand-black p-12 text-center font-display text-xl font-black uppercase">
            В этом дропе пока нет вещей
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {drop.items.map((item, idx) => (
              <ItemCard key={item.id} item={item} index={idx} />
            ))}
          </div>
        )}
      </section>

      <Marquee />
    </>
  )
}