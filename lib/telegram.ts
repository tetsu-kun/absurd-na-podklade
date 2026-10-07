const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHAT_ID = process.env.TELEGRAM_CHAT_ID

export async function sendTelegramMessage(text: string) {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.error('Telegram credentials not configured')
    return
  }

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text,
        parse_mode: 'HTML',
      }),
    })

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.status}`)
    }

    console.log('✅ Telegram notification sent')
  } catch (error) {
    console.error('❌ Failed to send Telegram notification:', error)
  }
}

// Форматирование уведомлений
export function formatNewOrderNotification(
  customerName: string,
  telegramUsername: string,
  itemName: string,
  price: number,
  orderId: string
) {
  return `
 <b>Новая заявка!</b>

👤 <b>Клиент:</b> ${customerName}
📱 <b>Telegram:</b> ${telegramUsername}
👕 <b>Вещь:</b> ${itemName}
💰 <b>Цена:</b> ${price.toLocaleString()} ₽

📋 <b>Order ID:</b> ${orderId}

<a href="http://localhost:3000/admin/orders">Открыть админку</a>
  `.trim()
}

export function formatStatusChangeNotification(
  orderId: string,
  itemName: string,
  oldStatus: string,
  newStatus: string
) {
  const statusEmoji: Record<string, string> = {
    RESERVED: '🔵',
    PAID: '💚',
    SHIPPED: '📦',
    COMPLETED: '✅',
    CANCELLED: '❌',
  }

  return `
${statusEmoji[newStatus] || '📝'} <b>Статус заказа изменен</b>

📋 <b>Order ID:</b> ${orderId}
 <b>Вещь:</b> ${itemName}
🔄 <b>${oldStatus}</b> → <b>${newStatus}</b>
  `.trim()
}