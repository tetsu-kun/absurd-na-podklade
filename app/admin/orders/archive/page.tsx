import { PrismaClient, OrderStatus } from '@prisma/client'
import Link from 'next/link'

const prisma = new PrismaClient()

export default async function ArchiveOrdersPage() {
  const orders = await prisma.order.findMany({
    where: {
      status: {
        in: ['COMPLETED', 'CANCELLED'] // Только завершенные
      }
    },
    include: { item: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <main className="min-h-screen bg-gray-50 text-black p-4 md:p-12 font-mono">
      <div className="max-w-6xl mx-auto">
        
        {/* Шапка с навигацией */}
        <div className="flex justify-between items-center mb-8 border-b-4 border-black pb-4">
          <h1 className="text-4xl font-black uppercase">Архив заказов</h1>
          <div className="flex gap-4 items-center">
            <Link 
              href="/admin/orders" 
              className="text-sm font-bold uppercase border-2 border-black px-4 py-2 hover:bg-black hover:text-white transition-colors"
            >
              ← Активные
            </Link>
            <form action={async () => {
              'use server'
              const { logoutAction } = await import('@/app/admin/login/actions')
              await logoutAction()
            }}>
              <button 
                type="submit"
                className="text-sm font-bold uppercase border-2 border-black px-4 py-2 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
              >
                Выйти
              </button>
            </form>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="border-2 border-black p-12 text-center bg-white">
            <p className="text-xl font-bold uppercase">Архив пуст</p>
            <p className="text-gray-600 mt-2">Завершенные заказы будут появляться здесь</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div 
                key={order.id} 
                className={`bg-white border-2 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 opacity-75 ${
                  order.status === 'CANCELLED' ? 'border-red-300' : 'border-gray-400'
                }`}
              >
                
                {/* Информация о заказе */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className={`px-2 py-1 text-xs font-bold uppercase border-2 border-black ${
                      order.status === 'COMPLETED' ? 'bg-gray-400' : 'bg-red-200'
                    }`}>
                      {order.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      {order.createdAt.toLocaleString('ru-RU')}
                    </span>
                    {order.completedAt && (
                      <span className="text-xs text-gray-500">
                        Завершен: {order.completedAt.toLocaleString('ru-RU')}
                      </span>
                    )}
                    {order.cancelledAt && (
                      <span className="text-xs text-gray-500">
                        Отменен: {order.cancelledAt.toLocaleString('ru-RU')}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-bold uppercase">{order.item.name}</h3>
                  <p className="text-sm">
                    <strong>Клиент:</strong> {order.customerName} ({order.telegramUsername})
                  </p>
                  <p className="text-sm font-bold mt-1">
                    Цена: {order.item.price.toLocaleString()} ₽
                  </p>
                </div>

                {/* Статус (без возможности изменения) */}
                <div className={`text-sm font-bold uppercase border-2 px-4 py-2 ${
                  order.status === 'COMPLETED' 
                    ? 'text-gray-600 border-gray-600' 
                    : 'text-red-600 border-red-600'
                }`}>
                  {order.status === 'COMPLETED' ? '✓ Завершен' : '✗ Отменен'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}