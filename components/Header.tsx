'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()

  const navItems = [
    { label: 'ГЛАВНАЯ', path: '/' },
    { label: 'ДРОПЫ', path: '/drops' },
    { label: 'АРХИВ', path: '/archive' },
  ]

  return (
    <header className="sticky top-0 z-40 border-b-2 border-brand-black bg-paper/95 backdrop-blur-sm">
      <div className="flex h-14 md:h-16 items-center px-4 md:px-6 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="grid h-8 w-8 place-items-center bg-brand-black text-white font-display text-sm font-black transition-colors group-hover:bg-brand-red">
            А
          </div>
          <div className="font-display text-xs md:text-sm font-black leading-none tracking-tight">
            АБСУРД <br />
            <span className="text-brand-red">НА ПОДКЛАДЕ</span>
          </div>
        </Link>

        <nav className="ml-auto flex items-center gap-4 md:gap-6">
          {navItems.map((item) => {
            const isActive = pathname === item.path || (item.path !== '/' && pathname?.startsWith(item.path))
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`text-xs font-display font-bold transition-colors ${
                  isActive ? 'text-brand-black' : 'text-brand-ink-muted hover:text-brand-black'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}