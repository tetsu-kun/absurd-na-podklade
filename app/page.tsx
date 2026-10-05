export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black p-4 md:p-12 font-mono">
      <div className="max-w-4xl mx-auto">
        {/* Заголовок */}
        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-8">
          АБСУРД<br />НА ПОДКЛАДЕ
        </h1>

        {/* О бренде */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold uppercase mb-4 border-b-2 border-black pb-2">
            О проекте
          </h2>
          <p className="text-lg leading-relaxed mb-4">
            Кастомная одежда с характером. Каждая вещь — это эксперимент с кроем, 
            материалами и смыслами. Мы не следуем трендам, мы создаем их.
          </p>
          <p className="text-lg leading-relaxed">
            Все изделия выпускаются лимитированными дропами. Когда вещь продана — 
            она уходит в архив. Никаких перевыпусков.
          </p>
        </section>

        {/* Контакты */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold uppercase mb-4 border-b-2 border-black pb-2">
            Контакты
          </h2>
          <ul className="space-y-2 text-lg">
            <li>
              <strong>Telegram канал:</strong>{" "}
              <a href="https://t.tv/your_channel" className="underline hover:no-underline">
                @absurd_na_podklade
              </a>
            </li>
            <li>
              <strong>Личные сообщения:</strong>{" "}
              <a href="https://t.me/your_username" className="underline hover:no-underline">
                @your_username
              </a>
            </li>
            <li>
              <strong>Email:</strong>{" "}
              <a href="mailto:info@absurd.ru" className="underline hover:no-underline">
                info@absurd.ru
              </a>
            </li>
          </ul>
        </section>

        {/* CTA */}
        <section className="border-2 border-black p-6 bg-gray-50">
          <h3 className="text-xl font-bold uppercase mb-2">
            Следи за новыми дропами
          </h3>
          <p className="mb-4">
            Подпишись на Telegram канал, чтобы первым узнавать о релизах.
          </p>
          <a
            href="/drops"
            className="inline-block bg-black text-white px-6 py-3 font-bold uppercase hover:bg-gray-800"
          >
            Смотреть активные дропы →
          </a>
        </section>
      </div>
    </main>
  );
}