'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

type Conversation = {
  userId: string
  fullName: string
  lastContent: string
  lastAt: string
  unread: number
}

function timeLabel(iso: string): string {
  const d = new Date(iso)
  const sameDay = d.toDateString() === new Date().toDateString()
  return sameDay
    ? d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
}

/**
 * Chuông thông báo cho admin. Bấm chuông mở bảng thông báo các khách vừa nhắn
 * ("<tên khách> đã gửi tin nhắn"). Bấm một dòng sẽ nhảy tới /admin/chat và mở
 * đúng hội thoại đó (qua query ?u=<userId>).
 */
export default function AdminChatBell({
  unread,
  buttonClassName,
  className = '',
}: {
  unread: number
  buttonClassName: string
  className?: string
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<Conversation[]>([])
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    let active = true
    const load = async () => {
      try {
        const res = await fetch('/api/admin/chat', { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        if (!active) return
        setItems((data.conversations ?? []).filter((c: Conversation) => c.unread > 0))
      } catch {
        /* noop */
      }
    }
    void load()
    function onClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => {
      active = false
      document.removeEventListener('mousedown', onClick)
    }
  }, [open])

  function goToConversation(userId: string) {
    setOpen(false)
    router.push(`/admin/chat?u=${userId}`)
  }

  return (
    <div ref={boxRef} className={`relative ${className}`}>
      <button
        aria-label={unread > 0 ? `Tin nhắn tư vấn, ${unread} tin mới` : 'Tin nhắn tư vấn'}
        className={buttonClassName}
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
        {unread > 0 ? (
          <span className="absolute right-0.5 top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-full z-50 mt-2 w-72 max-w-[86vw] overflow-hidden rounded-2xl border border-stone-200 bg-white text-stone-800 shadow-2xl">
          <div className="border-b border-stone-100 px-4 py-2.5 text-sm font-bold text-stone-700">
            Tin nhắn tư vấn mới
          </div>
          <div className="max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <div className="p-4 text-center text-sm text-stone-400">Không có tin mới.</div>
            ) : (
              items.map((c) => (
                <button
                  key={c.userId}
                  onClick={() => goToConversation(c.userId)}
                  type="button"
                  className="flex w-full items-start gap-3 border-b border-stone-50 bg-brand-50/60 px-4 py-3 text-left transition hover:bg-brand-50"
                >
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                    {(c.fullName || '?').charAt(0).toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm text-stone-800">
                      <b>{c.fullName}</b> đã gửi tin nhắn
                    </span>
                    <span className="block truncate text-xs text-stone-500">{c.lastContent}</span>
                    <span className="mt-0.5 block text-[11px] text-stone-400">{timeLabel(c.lastAt)}</span>
                  </span>
                  {c.unread > 0 ? (
                    <span className="flex-shrink-0 rounded-full bg-orange-500 px-1.5 text-[11px] font-bold text-white">
                      {c.unread}
                    </span>
                  ) : null}
                </button>
              ))
            )}
          </div>
          <button
            onClick={() => {
              setOpen(false)
              router.push('/admin/chat')
            }}
            type="button"
            className="block w-full border-t border-stone-100 bg-emerald-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-900"
          >
            Xem tất cả hội thoại
          </button>
        </div>
      ) : null}
    </div>
  )
}
