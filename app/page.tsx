import { PrismaClient } from '@prisma/client'
import Link from 'next/link'
import Marquee from '@/components/Marquee'

const prisma = new PrismaClient()

export default async function HomePage() {
  // Получаем последний активный дроп
  const latestDrop = await prisma.drop.findFirst({
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
        where: { stock: { gt: 0 } },
        orderBy: { createdAt: 'asc' },
        take: 1 // Берем первую вещь для превью
      }
    },
    orderBy: { startDate: 'desc' }
  })

  const firstItem = latestDrop?.items[0]

  return (
    <>
      {/* HERO-СЕКЦИЯ */}
      <section className="grid min-h-[calc(100vh-5rem)] border-b-2 border-brand-black p-4 lg:grid-cols-[1.1fr_0.9fr] lg:p-6 lg:gap-6">
        
        {/* Левая карточка */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-soft border-2 border-brand-black bg-paper p-5 shadow-card md:p-8">
          {/* Декоративная буква */}
          <span className="pointer-events-none absolute -right-4 top-4 font-display text-[8rem] font-black leading-none text-outline-blue md:text-[9rem]">
            А?
          </span>

          <p className="relative font-mono text-xs font-bold uppercase tracking-wider">
            НЕЗАВИСИМЫЙ БРЕНД / МОСКВА / 2026
          </p>

          <div className="relative my-20 md:my-32">
            <h1 className="font-display text-[3rem] font-black leading-[0.78] tracking-tight md:text-[6.5rem]">
              АБСУРД <br />
              <span className="text-brand-red">НА</span> <br />
              <span className="text-brand-blue">ПОДКЛАДЕ</span>
            </h1>

            <p className="mt-8 max-w-md border-l-4 border-brand-red pl-4 text-base leading-relaxed md:text-lg">
              Мы шьём вещи, у которых внутренняя сторона говорит громче внешней. 
              Маленькие тиражи, большие формы и никакой базовой базы.
            </p>
          </div>

          <Link
            href="/drops"
            className="relative flex w-full items-center justify-between rounded-soft border-2 border-brand-black bg-brand-black px-6 py-4 font-display text-sm font-black text-white shadow-button transition-all hover:-translate-y-0.5 hover:bg-brand-blue md:w-auto md:min-w-[288px]"
          >
            СМОТРЕТЬ ДРОПЫ
            <span className="font-mono text-xl">→</span>
          </Link>
        </div>

        {/* Правая карточка с изображением */}
        {/* Правая карточка с изображением */}
<div className="relative mt-4 min-h-[50vh] overflow-hidden rounded-soft border-2 border-brand-black bg-brand-black shadow-card lg:mt-0">
          {firstItem ? (
            <>
              <img
                src={firstItem.images[0]}
                alt={latestDrop.title}
                className="absolute inset-0 h-full w-full object-cover grayscale contrast-125"
              />
              {/* Дуотон-эффект */}
              <div className="bg-duotone absolute inset-0" />

              <span className="absolute right-4 top-4 rounded-soft border-2 border-brand-black bg-brand-blue px-4 py-2 font-mono text-xs font-bold text-white">
                ПОСЛЕДНИЙ ДРОП
              </span>

              <Link 
                href={`/drop/${latestDrop.id}`}
                className="absolute bottom-4 left-4 rounded-soft border-2 border-brand-black bg-paper p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover md:p-7 block"
              >
                <p className="font-mono text-xs font-bold">
                  {new Date(latestDrop.startDate).getFullYear() / 1000 | 0} / ВЕСНА—ЛЕТО
                </p>
                <p className="mt-2 font-display text-2xl font-black">
                  {latestDrop.title}
                </p>
              </Link>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-brand-gray">
              <p className="font-display text-xl font-black text-brand-ink-muted">
                СКОРО ОТКРЫТИЕ
              </p>
            </div>
          )}
        </div>
      </section>

      {/* БЕГУЩАЯ СТРОКА */}
      <Marquee />

      {/* СЕКЦИЯ ФИЧ */}
      <section className="grid gap-4 border-b-2 border-brand-black p-4 md:grid-cols-3 md:p-6">
        
        {/* Фича 1 */}
        <article className="min-h-[288px] rounded-soft border-2 border-brand-black bg-paper p-6 shadow-card">
          <p className="font-mono text-sm font-bold text-brand-red">01 / ЗАЧЕМ</p>
          <h2 className="mt-14 font-display text-2xl font-black">НЕ МАСС-МАРКЕТ</h2>
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            Каждая вещь выходит тиражом до 30 экземпляров. Повтора не будет.
          </p>
        </article>

        {/* Фича 2 — синяя */}
        <article className="min-h-[288px] rounded-soft border-2 border-brand-black bg-brand-blue p-6 text-white shadow-card">
          <p className="font-mono text-sm font-bold">02 / ЗАЧЕМ</p>
          <h2 className="mt-14 font-display text-2xl font-black">ИЗНАНКА СНАРУЖИ</h2>
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            Подкладка — главная часть образа. Мы не прячем швы и не стесняемся процесса.
          </p>
        </article>

        {/* Фича 3 */}
        <article className="min-h-[288px] rounded-soft border-2 border-brand-black bg-paper p-6 shadow-card">
          <p className="font-mono text-sm font-bold text-brand-red">03 / ЗАЧЕМ</p>
          <h2 className="mt-14 font-display text-2xl font-black">СДЕЛАНО ЛЮДЬМИ</h2>
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            Локальное производство, ручная отделка и имена мастеров на каждой бирке.
          </p>
        </article>
      </section>
    </>
  )
}