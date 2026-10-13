'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-paper">
      <div className="border-b-2 border-brand-black grid md:grid-cols-2">
        <div className="border-b-2 md:border-b-0 md:border-r-2 border-brand-black p-6 md:p-8">
          <h3 className="font-display text-3xl md:text-5xl font-black leading-none">
            АБСУРД <br />
            <span className="text-brand-red">НА ПОДКЛАДЕ</span>
          </h3>
        </div>
        <div className="flex items-end justify-between gap-4 p-6 md:p-8">
          <div className="font-mono text-xs leading-8">
            <div>TELEGRAM: @ABSURD_LINING</div>
            <div>ПОЧТА: HELLO@ABSURD.STORE</div>
          </div>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="grid h-12 w-12 place-items-center border-2 border-brand-black bg-transparent font-bold transition-colors hover:bg-brand-blue hover:text-white"
          >
            ↑
          </button>
        </div>
      </div>
      <div className="flex flex-wrap justify-between gap-2 px-5 py-4 font-mono text-xs">
        <span>© 2025 АБСУРД НА ПОДКЛАДЕ</span>
        <span>СДЕЛАНО БЕЗ ЗДРАВОГО СМЫСЛА</span>
      </div>
    </footer>
  )
}