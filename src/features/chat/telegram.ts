import 'server-only'

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// Báo Telegram cho dược sĩ khi có tin/mục mới cần chú ý (tuỳ chọn, không chặn nếu chưa cấu hình).
// `label` mô tả loại tin (vd "vừa nhắn tư vấn", "vừa gửi toa thuốc") để phân biệt nguồn.
export async function notifyTelegramChat(
  emoji: string,
  name: string,
  label: string,
  message: string,
) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return
  const text = [
    `${emoji} <b>${escapeHtml(name)}</b> ${label}:`,
    '',
    escapeHtml(message),
    '',
    '↩️ Trả lời khách tại trang <b>Quản trị → Tư vấn</b>.',
  ].join('\n')
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
    })
  } catch (e) {
    console.error('Telegram notify failed:', e)
  }
}
