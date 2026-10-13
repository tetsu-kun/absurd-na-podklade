'use server'

import { sendTelegramMessage, formatNewOrderNotification, formatStatusChangeNotification } from '@/lib/telegram'
import { PrismaClient, OrderStatus } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

// 1. Создание заказа (статус NEW, stock НЕ меняется)
export async function createOrder(prevState: any, formData: FormData) {
  const itemId = formData.get('itemId') as string
  const customerName = formData.get('customerName') as string
  const telegramUsername = formData.get('telegramUsername') as string
  const phone = formData.get('phone') as string

  // Валидация
  if (!itemId || !customerName || !telegramUsername || !phone) {
    return { error: 'Заполни все поля' }
  }

  try {
    // Проверяем, есть ли вещь в наличии
    const item = await prisma.item.findUnique({
      where: { id: itemId },
    })

    if (!item) {
      return { error: 'Вещь не найдена' }
    }

    if (item.stock <= 0) {
      return { error: 'Вещь закончилась' }
    }

    // Создаем заказ и уменьшаем stock в одной транзакции
    await prisma.$transaction([
      prisma.order.create({
        data: {
          itemId,
          customerName,
          telegramUsername,
          phone,
          status: 'NEW',
        },
      }),
      prisma.item.update({
        where: { id: itemId },
        data: {
          stock: { decrement: 1 },
        },
      }),
    ])

    return { success: 'Заявка отправлена! Скоро напишем в Telegram.' }
  } catch (error) {
    console.error('Error creating order:', error)
    return { error: 'Ошибка при создании заказа' }
  }
}

// 2. Изменение статуса заказа (управляет остатками)
export async function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { item: true }
    })

    if (!order) return { error: 'Заказ не найден' }

    const oldStatus = order.status
    const itemId = order.itemId

    // ЛОГИКА ИЗМЕНЕНИЯ ОСТАТКОВ
    if (oldStatus !== 'RESERVED' && oldStatus !== 'PAID' && oldStatus !== 'SHIPPED' && newStatus === 'RESERVED') {
      await prisma.item.update({
        where: { id: itemId },
        data: { stock: { decrement: 1 } }
      })
    } 
    else if ((oldStatus === 'RESERVED' || oldStatus === 'PAID' || oldStatus === 'SHIPPED') && newStatus === 'CANCELLED') {
      await prisma.item.update({
        where: { id: itemId },
        data: { stock: { increment: 1 } }
      })
    }

    const updateData: any = { status: newStatus }
    if (newStatus === 'RESERVED') updateData.reservedAt = new Date()
    if (newStatus === 'PAID') updateData.paidAt = new Date()
    if (newStatus === 'SHIPPED') updateData.shippedAt = new Date()
    if (newStatus === 'COMPLETED') updateData.completedAt = new Date()
    if (newStatus === 'CANCELLED') updateData.cancelledAt = new Date()

    await prisma.order.update({
      where: { id: orderId },
      data: updateData
    })

    // 🔥 Уведомление о смене статуса (ВЫНЕСЕНО ЗА ПРЕДЕЛЫ IF, сработает для ЛЮБОГО изменения)
    const notification = formatStatusChangeNotification(
      orderId,
      order.item.name,
      oldStatus,
      newStatus
    )
    await sendTelegramMessage(notification)

    revalidatePath('/admin/orders')
    revalidatePath('/drops')
    revalidatePath(`/drops/${itemId}`)

    return { success: `Статус изменен на ${newStatus}` }
  } catch (error) {
    console.error('Ошибка при обновлении статуса:', error)
    return { error: 'Ошибка при обновлении статуса' }
  }
}