'use client'

import { useEffect, useState } from 'react'

/**
 * Chuông thông báo cho khách: hiện badge khi có tin dược sĩ trả lời chưa đọc.
 * Chỉ hiển thị khi đã đăng nhập. Bấm chuông sẽ mở khung tư vấn (DrugChatbot
 * lắng nghe sự kiện qt:open-consult), tin sẽ được đánh dấu đã đọc khi mở.
 */
export default function ChatNotifyBell() {
  const [authed, setAuthed] = useState(false)
  const [ready, setReady] = useState(false)
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    let active = true
    const poll = async () => {
      try {
        const res = await fetch('/api/chat/unread', { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        if (!active) return
        setAuthed(Boolean(data.authed))
        setUnread(Number(data.unread ?? 0))
      } catch {
        /* giữ trạng thái cũ khi lỗi mạng */
      } finally {
        if (active) setReady(true)
      }
    }
    void poll()
    const t = setInterval(() => void poll(), 15000)
    // Khi khung chat vừa được mở, tin sẽ được đọc → làm mới sau 1.5s để tắt badge.
    const onOpen = () => setTimeout(() => void poll(), 1500)
    window.addEventListener('qt:open-consult', onOpen)
    return () => {
      active = false
      clearInterval(t)
      window.removeEventListener('qt:open-consult', onOpen)
    }
  }, [])

  if (!ready || !authed) return null

  function openChat() {
    setUnread(0)
    try {
      window.dispatchEvent(new CustomEvent('qt:open-consult'))
    } catch {
      /* noop */
    }
  }

  return (
    <button
      aria-label={unread > 0 ? `Thông báo tư vấn, ${unread} tin mới` : 'Thông báo tư vấn'}
      onClick={openChat}
      type="button"
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        border: 'none',
        background: 'var(--teal-50)',
        borderRadius: '50%',
        fontSize: 18,
        cursor: 'pointer',
        color: 'var(--teal-800)',
        flexShrink: 0,
      }}
    >
      <i className={unread > 0 ? 'ph-fill ph-bell' : 'ph ph-bell'} />
      {unread > 0 ? (
        <span
          style={{
            position: 'absolute',
            top: -4,
            right: -4,
            background: 'var(--orange-600)',
            color: '#fff',
            fontSize: 10,
            fontWeight: 700,
            minWidth: 18,
            height: 18,
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 4px',
          }}
        >
          {unread > 9 ? '9+' : unread}
        </span>
      ) : null}
    </button>
  )
}
