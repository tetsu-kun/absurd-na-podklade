import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Начинаем наполнение базы данных...')

  // 1. Создаем первый дроп
  const drop = await prisma.drop.create({
    data: {
      title: 'Дроп 01: Черновик',
      description: 'Первая коллекция экспериментальных вещей. Сырые швы, честный крой и абсурд на подкладе.',
      startDate: new Date(),
      status: 'LIVE',
    },
  })
  console.log(`✅ Создан дроп: ${drop.title}`)

  // 2. Добавляем КАРТИНУ (исправлено: теперь это отдельный вызов create)
  const artPiece = await prisma.item.create({
    data: {
      dropId: drop.id,
      name: 'Картина "Экзистенциальный холст"',
      description: 'Акрил, масло и слезы дизайнера на холсте. Не рекомендуется вешать в спальне.',
      price: 15000,
      stock: 1,
      images: ['https://placehold.co/600x800/1a1a1a/FFF?text=ART'],
      category: 'ART',
      measurements: {
        width: '50 см',
        height: '70 см',
        material: 'Холст, масло, экзистенциальная тоска'
      }
    }
  })
  console.log(`✅ Добавлена вещь: ${artPiece.name}`)

  // 3. Добавляем ФУТБОЛКУ (исправлено: убрано несуществующее поле isSold)
  const tshirt = await prisma.item.create({
    data: {
      dropId: drop.id,
      name: 'Футболка "Мелким шрифтом"',
      description: 'Плотная базовая футболка 240 г/м². Вся ирония бренда спрятана в инструкции по уходу, написанной микроскопическим шрифтом на спине.',
      price: 4500,
      stock: 5,
      images: [
        'https://placehold.co/600x800/1a1a1a/FFF?text=T-Shirt+Front',
        'https://placehold.co/600x800/1a1a1a/FFF?text=T-Shirt+Back'
      ],
      measurements: {
        chest: '110 см (ширина груди)',
        length: '72 см (длина по спинке)',
        shoulder: '55 см (ширина плеч)',
        sleeve: '22 см (длина рукава)'
      },
    },
  })
  console.log(`✅ Добавлена вещь: ${tshirt.name}`)

  // 4. Добавляем ДЖИНСЫ (исправлено: убрано несуществующее поле isSold)
  const jeans = await prisma.item.create({
    data: {
      dropId: drop.id,
      name: 'Джинсы "Сырой Деним"',
      description: 'Прямые джинсы из необработанного японского денима. Со временем будут садиться по фигуре и выцветать именно там, где нужно тебе. Фурнитура — латунь.',
      price: 12000,
      stock: 3,
      images: [
        'https://placehold.co/600x800/2c3e50/FFF?text=Jeans+Front',
        'https://placehold.co/600x800/2c3e50/FFF?text=Jeans+Back'
      ],
      measurements: {
        waist: '80 см (пояс)',
        hip: '105 см (бедра)',
        length: '105 см (общая длина)',
        inseam: '80 см (длина по внутреннему шву)',
        legOpening: '20 см (ширина штанины внизу)'
      },
    },
  })
  console.log(`✅ Добавлена вещь: ${jeans.name}`)

  console.log('🎉 Наполнение базы данных завершено успешно!')
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при наполнении базы:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })