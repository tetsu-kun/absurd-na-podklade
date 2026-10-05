import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "АБСУРД НА ПОДКЛАДЕ",
  description: "Кастомная одежда с характером",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        {/* Навигация */}
        <nav className="border-b-2 border-black p-4 font-mono">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <a href="/" className="text-xl font-black uppercase">
              АНП
            </a>
            <div className="flex gap-6">
              <a href="/" className="hover:underline">О бренде</a>
              <a href="/drops" className="hover:underline">Дропы</a>
              <a href="/archive" className="hover:underline">Архив</a>
            </div>
          </div>
        </nav>
        
        {/* Основной контент */}
        {children}
      </body>
    </html>
  );
}