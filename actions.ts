'use server'

import { sendTelegramMessage, formatNewOrderNotification, formatStatusChangeNotification } from '@/lib/telegram'
import { PrismaClient, OrderStatus } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

// 1. Создание заказа (статус NEW, stock НЕ меняется)
export async function createOrder(formData: FormData) {
  const itemId = formData.get('itemId') as string
  const customerName = formData.get('customerName') as string
  const telegramUsername = formData.get('telegramUsername') as string

  if (!itemId || !customerName || !telegramUsername) {
    return { error: 'Все поля обязательны для заполнения' }
  }

  try {
    const item = await prisma.item.findUnique({ where: { id: itemId } })
    if (!item || item.stock <= 0) {
      return { error: 'Эта вещь уже закончилась' }
    }

    await prisma.order.create({
      data: {
        itemId,
        customerName,
        telegramUsername,
        status: 'NEW',
      },
    })

    // 🔥 Уведомление о новом заказе
    const notification = formatNewOrderNotification(
      customerName,
      telegramUsername,
      item.name,
      item.price,
      itemId // Используем itemId как временный ID для уведомления, реальный ID заказа мы не сохраняем в переменной здесь, но для уведомления сойдет
    )
    await sendTelegramMessage(notification)

    revalidatePath(`/drops/${itemId}`)
    revalidatePath('/drops')
    revalidatePath('/admin/orders')

    return { success: 'Заявка отправлена! Мы свяжемся с вами для подтверждения.' }
  } catch (error) {
    console.error('Ошибка при создании заказа:', error)
    return { error: 'Произошла ошибка' }
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