'use client'

import { useEffect, useRef, useState } from 'react'

type Notif = {
  id: string
  senderName: string | null
  content: string
  createdAt: string
  read: boolean
}

function timeLabel(iso: string): string {
  const d = new Date(iso)
  const sameDay = d.toDateString() === new Date().toDateString()
  return sameDay
    ? d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
}

/**
 * Chuông thông báo cho khách. Bấm chuông mở BẢNG THÔNG BÁO (không mở thẳng chat):
 * mỗi dòng "<tên dược sĩ> đã gửi tin nhắn cho bạn". Bấm một thông báo (hoặc nút
 * "Mở khung tư vấn") mới mở khung chat (sự kiện qt:open-consult).
 */
export default function ChatNotifyBell() {
  const [authed, setAuthed] = useState(false)
  const [ready, setReady] = useState(false)
  const [unread, setUnread] = useState(0)
  const [notifs, setNotifs] = useState<Notif[]>([])
  const [open, setOpen] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let active = true
    const poll = async () => {
      try {
        const res = await fetch('/api/chat/notifications', { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        if (!active) return
        setAuthed(Boolean(data.authed))
        setUnread(Number(data.unread ?? 0))
        setNotifs(data.notifications ?? [])
      } catch {
        /* giữ trạng thái cũ khi lỗi mạng */
      } finally {
        if (active) setReady(true)
      }
    }
    void poll()
    const t = setInterval(() => void poll(), 15000)
    const onOpenChat = () => setTimeout(() => void poll(), 1500)
    window.addEventListener('qt:open-consult', onOpenChat)
    return () => {
      active = false
      clearInterval(t)
      window.removeEventListener('qt:open-consult', onOpenChat)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    function onClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  if (!ready || !authed) return null

  function openChat() {
    setOpen(false)
    try {
      window.dispatchEvent(new CustomEvent('qt:open-consult'))
    } catch {
      /* noop */
    }
  }

  return (
    <div ref={boxRef} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        aria-label={unread > 0 ? `Thông báo tư vấn, ${unread} tin mới` : 'Thông báo tư vấn'}
        onClick={() => setOpen((v) => !v)}
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

      {open ? (
        <div
          style={{
            position: 'absolute',
            top: 48,
            right: 0,
            width: 300,
            maxWidth: '86vw',
            background: '#fff',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 60,
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--color-border-subtle)', fontWeight: 700, fontSize: 14, color: 'var(--color-text-heading)' }}>
            Thông báo tư vấn
          </div>
          <div style={{ maxHeight: 320, overflowY: 'auto' }}>
            {notifs.length === 0 ? (
              <div style={{ padding: 16, fontSize: 13, color: 'var(--color-text-muted)', textAlign: 'center' }}>
                Chưa có thông báo nào.
              </div>
            ) : (
              notifs.map((n) => (
                <button
                  key={n.id}
                  onClick={openChat}
                  type="button"
                  style={{
                    display: 'flex',
                    gap: 10,
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 14px',
                    border: 'none',
                    borderBottom: '1px solid var(--neutral-100)',
                    background: n.read ? '#fff' : 'var(--teal-50)',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ display: 'flex', flexShrink: 0, width: 32, height: 32, borderRadius: '50%', background: 'var(--color-brand-accent)', color: '#fff', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>
                    <i className="ph-fill ph-stethoscope" />
                  </span>
                  <span style={{ minWidth: 0, flex: 1 }}>
                    <span style={{ display: 'block', fontSize: 13, color: 'var(--color-text-heading)' }}>
                      <b>{n.senderName || 'Dược sĩ'}</b> đã gửi tin nhắn cho bạn
                    </span>
                    <span style={{ display: 'block', fontSize: 12, color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {n.content}
                    </span>
                    <span style={{ display: 'block', fontSize: 11, color: 'var(--neutral-400)', marginTop: 2 }}>{timeLabel(n.createdAt)}</span>
                  </span>
                </button>
              ))
            )}
          </div>
          <button
            onClick={openChat}
            type="button"
            style={{ display: 'block', width: '100%', padding: '10px 14px', border: 'none', borderTop: '1px solid var(--color-border-subtle)', background: 'var(--color-brand-primary)', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
          >
            Mở khung tư vấn
          </button>
        </div>
      ) : null}
    </div>
  )
}
