import Link from 'next/link'
import { Item } from '@prisma/client'

interface ItemCardProps {
  item: Item
  index?: number
}

export default function ItemCard({ item, index = 0 }: ItemCardProps) {
  const isSoldOut = item.stock <= 0

  const categoryLabel = 
    item.category === 'ART' ? 'АРТ-ОБЪЕКТ' : 
    item.category === 'ACCESSORY' ? 'АКСЕССУАР' : 'ОДЕЖДА'

  return (
    <article className="group overflow-hidden rounded-soft border-2 border-brand-black bg-paper shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover">
      <Link href={`/drops/${item.id}`} className="block">
        
        {/* Изображение */}
        <div className="relative aspect-[3/4] overflow-hidden border-b-2 border-brand-black bg-brand-gray">
          <img
            src={item.images[0]}
            alt={item.name}
            className="h-full w-full object-contain grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
            style={{ objectPosition: index % 2 === 0 ? 'center' : 'top' }}
          />
          
          {/* Номерной бейдж */}
          <span className="absolute left-3 top-3 rounded-full border-2 border-brand-black bg-paper px-2 py-1 font-mono text-xs font-bold">
            0{index + 1}
          </span>

          {/* Штамп ПРОДАНО */}
          {isSoldOut && (
            <span className="absolute left-4 right-4 top-1/2 -translate-y-1/2 -rotate-3 rounded-full border-2 border-brand-black bg-brand-blue px-3 py-2 text-center font-display text-sm font-black text-white">
              ПРОДАНО
            </span>
          )}
        </div>

        {/* Информация */}
        <div className="p-4 md:p-5">
          <p className="font-mono text-xs text-brand-ink-muted">
            {categoryLabel}
          </p>
          
          <h3 className="mt-2 font-display text-lg font-black leading-tight md:text-xl">
            {item.name}
          </h3>

          <div className="mt-5 flex items-end justify-between gap-3">
            <p className={`font-display text-base font-black ${
              isSoldOut ? 'text-brand-ink-muted' : 'text-brand-red'
            }`}>
              {isSoldOut ? 'ПРОДАНО' : `${item.price.toLocaleString()} ₽`}
            </p>
            
            <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-brand-black bg-paper font-mono text-base transition-colors group-hover:bg-brand-black group-hover:text-white">
              →
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}