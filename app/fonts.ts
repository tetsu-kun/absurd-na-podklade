import { Unbounded, JetBrains_Mono } from 'next/font/google'

// Для заголовков
export const unbounded = Unbounded({
  subsets: ['cyrillic', 'latin'], // Сначала cyrillic для корректного фолбэка
  weight: ['400', '700', '900'],
  variable: '--font-unbounded',
  display: 'swap',
})

// Для текста
export const jetbrainsMono = JetBrains_Mono({
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
  display: 'swap',
})