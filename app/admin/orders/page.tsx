import { PrismaClient, OrderStatus } from '@prisma/client'
import { updateOrderStatus } from '@/actions'
import Link from 'next/link'
export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

export default async function ActiveOrdersPage() {
  const orders = await prisma.order.findMany({
    where: {
      status: {
        notIn: ['COMPLETED', 'CANCELLED'] // Исключаем завершенные
      }
    },
    include: { item: true },
    orderBy: { createdAt: 'desc' }
  })

  const statuses: OrderStatus[] = ['NEW', 'RESERVED', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELLED']

  return (
    <main className="min-h-screen bg-gray-50 text-black p-4 md:p-12 font-mono">
      <div className="max-w-6xl mx-auto">
        
        {/* Шапка с навигацией */}
        <div className="flex justify-between items-center mb-8 border-b-4 border-black pb-4">
          <h1 className="text-4xl font-black uppercase">Активные заказы</h1>
          <div className="flex gap-4 items-center">
            <Link 
              href="/admin/orders/archive" 
              className="text-sm font-bold uppercase border-2 border-black px-4 py-2 hover:bg-black hover:text-white transition-colors"
            >
              Архив →
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
            <p className="text-xl font-bold uppercase">Нет активных заказов</p>
            <p className="text-gray-600 mt-2">Все заказы обработаны или их пока нет</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isNew = order.status === 'NEW'
              
              return (
                <div 
                  key={order.id} 
                  className={`bg-white border-2 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                    // 🟢 ИЗМЕНЕНИЕ: Выделение NEW заказов
                    isNew 
                      ? 'border-yellow-500 border-4 shadow-[4px_4px_0_0_#eab308] animate-pulse' 
                      : 'border-black'
                  }`}
                >
                  
                  {/* Информация о заказе */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className={`px-2 py-1 text-xs font-bold uppercase border-2 border-black ${
                        order.status === 'NEW' ? 'bg-yellow-300' :
                        order.status === 'RESERVED' ? 'bg-blue-200' :
                        order.status === 'PAID' ? 'bg-green-200' :
                        order.status === 'SHIPPED' ? 'bg-purple-200' :
                        order.status === 'COMPLETED' ? 'bg-gray-400' :
                        'bg-red-200'
                      }`}>
                        {order.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        {order.createdAt.toLocaleString('ru-RU')}
                      </span>
                      {isNew && (
                        <span className="text-xs font-black uppercase text-yellow-700 bg-yellow-100 px-2 py-1 border border-yellow-500">
                          ⚡ Требует внимания
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

                  {/* Управление статусом */}
                  <form 
                    action={async (formData: FormData) => {
                      'use server'
                      const orderId = formData.get('orderId') as string
                      const newStatus = formData.get('status') as OrderStatus
                      await updateOrderStatus(orderId, newStatus)
                    }} 
                    className="flex gap-2 items-center"
                  >
                    <input type="hidden" name="orderId" value={order.id} />
                    
                    <select 
                      key={order.id + order.status}
                      name="status" 
                      defaultValue={order.status}
                      className="border-2 border-black p-2 font-mono bg-white"
                    >
                      {statuses.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    
                    <button 
                      type="submit"
                      className="bg-black text-white px-4 py-2 font-bold uppercase hover:bg-gray-800 border-2 border-black"
                    >
                      OK
                    </button>
                  </form>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}