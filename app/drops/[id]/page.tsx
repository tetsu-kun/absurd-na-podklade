import { PrismaClient } from '@prisma/client'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import OrderForm from './OrderForm'
import ProductGallery from '@/components/ProductGallery'
export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

export default async function ItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const item = await prisma.item.findUnique({
    where: { id },
    include: { drop: true }
  })

  if (!item) {
    notFound()
  }

  const isSoldOut = item.stock <= 0
  const measurements = item.measurements as Record<string, string> | null

  const categoryLabel = 
    item.category === 'ART' ? 'АРТ-ОБЪЕКТ' : 
    item.category === 'ACCESSORY' ? 'АКСЕССУАР' : 'ОДЕЖДА'

  return (
    <>
      {/* Хлебные крошки */}
      <Breadcrumbs 
        items={[
          { label: 'Дропы', href: '/drops' },
          { label: item.drop.title, href: `/drop/${item.dropId}` },
          { label: item.name }
        ]} 
      />

      {/* Асимметричная двухколоночная сетка */}
      <section className="grid gap-4 border-b-2 border-brand-black p-4 lg:grid-cols-[0.45fr_0.55fr] lg:p-6">
        
        {/* ЛЕВАЯ КОЛОНКА: Галерея (45%) */}
        <ProductGallery 
          images={item.images}
          dropTitle={item.drop.title}
          itemName={item.name}
        />

        {/* ПРАВАЯ КОЛОНКА: Информация (55%) */}
        <div className="flex flex-col overflow-hidden rounded-soft border-2 border-brand-black bg-paper shadow-card">
          
          {/* Шапка с названием и ценой */}
          <div className="border-b-2 border-brand-black p-6 md:p-8">
            <p className="font-mono text-xs font-bold text-brand-blue">
              {categoryLabel}
            </p>
            
            <h1 className="mt-3 font-display text-3xl font-black leading-none tracking-tight md:text-5xl">
              {item.name}
            </h1>

            <p className={`mt-6 font-display text-2xl font-black md:text-3xl ${
              isSoldOut ? 'text-brand-ink-muted' : 'text-brand-red'
            }`}>
              {isSoldOut ? 'ПРОДАНО' : `${item.price.toLocaleString()} ₽`}
            </p>
          </div>

          {/* Описание */}
          <div className="border-b-2 border-brand-black p-6 md:p-8">
            <p className="font-mono text-xs font-bold">О ВЕЩИ</p>
            <p className="mt-3 text-sm leading-relaxed md:text-base">
              {item.description}
            </p>

            {/* Характеристики */}
            {measurements && Object.keys(measurements).length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-2 font-mono text-xs">
                {Object.entries(measurements).map(([key, value]) => (
                  <div key={key} className="rounded-soft border-2 border-brand-black bg-paper p-3">
                    <span className="text-brand-ink-muted uppercase">{key}</span>
                    <br />
                    <span className="font-bold">{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Форма заказа или блок "Продано" */}
          {isSoldOut ? (
            <div className="bg-brand-black p-6 text-white md:p-8">
              <p className="font-display text-2xl font-black md:text-3xl">
                ЭТА ВЕЩЬ ЗАКОНЧИЛАСЬ.
              </p>
              <Link 
                href="/drops"
                className="mt-4 inline-block border-2 border-white bg-transparent px-4 py-2 font-display text-xs font-black text-white transition-colors hover:bg-white hover:text-brand-black"
              >
                СМОТРЕТЬ НОВОЕ
              </Link>
            </div>
          ) : (
            <OrderForm itemId={item.id} />
          )}
        </div>
      </section>
    </>
  )
}