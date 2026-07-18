'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export type ConversationVM = {
  userId: string
  fullName: string
  email: string | null
  phone: string | null
  lastContent: string
  lastAt: string
  unread: number
}

type MessageVM = {
  id: string
  sender: 'user' | 'admin'
  content: string
  createdAt: string
}

type ActiveUser = { id: string; fullName: string; email: string | null; phone: string | null }

function timeLabel(iso: string): string {
  const d = new Date(iso)
  const today = new Date()
  const sameDay = d.toDateString() === today.toDateString()
  return sameDay
    ? d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
}

export default function ChatInbox({ initialConversations }: { initialConversations: ConversationVM[] }) {
  const [conversations, setConversations] = useState<ConversationVM[]>(initialConversations)
  const [activeUserId, setActiveUserId] = useState<string | null>(null)
  const [activeUser, setActiveUser] = useState<ActiveUser | null>(null)
  const [messages, setMessages] = useState<MessageVM[]>([])
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const [loadingThread, setLoadingThread] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  // Xác nhận xóa tự thu lại sau 4s nếu không bấm (không dùng window.confirm để tránh chặn luồng).
  useEffect(() => {
    if (!confirmDelete) return
    const t = setTimeout(() => setConfirmDelete(false), 4000)
    return () => clearTimeout(t)
  }, [confirmDelete])

  const refreshConversations = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/chat', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setConversations(data.conversations ?? [])
      }
    } catch {
      /* giữ danh sách cũ khi lỗi mạng */
    }
  }, [])

  const openConversation = useCallback(async (userId: string) => {
    setActiveUserId(userId)
    setLoadingThread(true)
    setMessages([])
    setConfirmDelete(false)
    try {
      const res = await fetch(`/api/admin/chat/${userId}`, { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setMessages(data.messages ?? [])
        setActiveUser(data.user ?? null)
      }
    } catch {
      /* noop */
    } finally {
      setLoadingThread(false)
    }
    // Mở hội thoại = đã đọc → làm mới danh sách để xoá badge chưa đọc.
    void refreshConversations()
  }, [refreshConversations])

  // Mở sẵn hội thoại khi tới từ thông báo admin (/admin/chat?u=<userId>).
  useEffect(() => {
    const u = searchParams.get('u')
    if (!u) return
    const id = setTimeout(() => void openConversation(u), 0)
    return () => clearTimeout(id)
  }, [searchParams, openConversation])

  // Poll danh sách hội thoại mỗi 8s.
  useEffect(() => {
    const t = setInterval(() => void refreshConversations(), 8000)
    return () => clearInterval(t)
  }, [refreshConversations])

  // Poll tin mới của hội thoại đang mở mỗi 4s.
  useEffect(() => {
    if (!activeUserId) return
    const t = setInterval(async () => {
      const last = messages[messages.length - 1]?.createdAt
      const url = last
        ? `/api/admin/chat/${activeUserId}?after=${encodeURIComponent(last)}`
        : `/api/admin/chat/${activeUserId}`
      try {
        const res = await fetch(url, { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        const incoming: MessageVM[] = data.messages ?? []
        if (incoming.length) {
          setMessages((cur) => {
            const seen = new Set(cur.map((m) => m.id))
            return [...cur, ...incoming.filter((m) => !seen.has(m.id))]
          })
        }
      } catch {
        /* noop */
      }
    }, 4000)
    return () => clearInterval(t)
  }, [activeUserId, messages])

  async function sendReply() {
    const content = reply.trim()
    if (!content || sending || !activeUserId) return
    setSending(true)
    try {
      const res = await fetch(`/api/admin/chat/${activeUserId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      if (res.ok) {
        const data = await res.json()
        setMessages((cur) => [...cur, data.message])
        setReply('')
        void refreshConversations()
      }
    } catch {
      /* noop */
    } finally {
      setSending(false)
    }
  }

  // Xóa toàn bộ hội thoại đang mở (dọn bộ nhớ) — KHÔNG thể hoàn tác.
  async function deleteActiveConversation() {
    if (!activeUserId || deleting) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/chat/${activeUserId}`, { method: 'DELETE' })
      if (res.ok) {
        setActiveUserId(null)
        setActiveUser(null)
        setMessages([])
        setConfirmDelete(false)
        setConversations((cur) => cur.filter((c) => c.userId !== activeUserId))
      }
    } catch {
      /* noop */
    } finally {
      setDeleting(false)
    }
  }

  const totalUnread = conversations.reduce((s, c) => s + c.unread, 0)

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <h1 className="text-2xl font-black tracking-tight text-stone-900">Tư vấn khách hàng</h1>
        {totalUnread > 0 ? (
          <span className="rounded-full bg-orange-500 px-2.5 py-0.5 text-xs font-bold text-white">
            {totalUnread} tin mới
          </span>
        ) : null}
      </div>

      <div className="grid h-[calc(100vh-11rem)] grid-cols-1 gap-4 lg:grid-cols-[20rem_1fr]">
        {/* Danh sách hội thoại */}
        <div
          className={`${activeUserId ? 'hidden lg:flex' : 'flex'} flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white`}
        >
          <div className="border-b border-stone-100 px-4 py-3 text-sm font-bold text-stone-700">
            Hội thoại ({conversations.length})
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <p className="p-4 text-sm text-stone-400">Chưa có tin nhắn nào.</p>
            ) : (
              conversations.map((c) => (
                <button
                  key={c.userId}
                  onClick={() => void openConversation(c.userId)}
                  className={`flex w-full items-start gap-3 border-b border-stone-50 px-4 py-3 text-left transition hover:bg-stone-50 ${
                    activeUserId === c.userId ? 'bg-brand-50' : ''
                  }`}
                  type="button"
                >
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                    {(c.fullName || '?').charAt(0).toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-semibold text-stone-800">{c.fullName}</span>
                      <span className="flex-shrink-0 text-[11px] text-stone-400">{timeLabel(c.lastAt)}</span>
                    </span>
                    <span className="mt-0.5 flex items-center justify-between gap-2">
                      <span className="truncate text-xs text-stone-500">{c.lastContent}</span>
                      {c.unread > 0 ? (
                        <span className="flex-shrink-0 rounded-full bg-orange-500 px-1.5 text-[11px] font-bold text-white">
                          {c.unread}
                        </span>
                      ) : null}
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Khung hội thoại */}
        <div
          className={`${activeUserId ? 'flex' : 'hidden lg:flex'} flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white`}
        >
          {!activeUserId ? (
            <div className="flex flex-1 items-center justify-center p-6 text-center text-sm text-stone-400">
              Chọn một hội thoại để xem và trả lời.
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 border-b border-stone-100 px-4 py-3">
                <button
                  className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg text-stone-500 hover:bg-stone-100"
                  onClick={() => setActiveUserId(null)}
                  type="button"
                  aria-label="Quay lại"
                >
                  <i className="ph-bold ph-arrow-left" />
                </button>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-stone-800">{activeUser?.fullName ?? 'Khách hàng'}</p>
                  <p className="truncate text-xs text-stone-400">
                    {activeUser?.phone ?? activeUser?.email ?? ''}
                  </p>
                </div>

                {!confirmDelete ? (
                  <button
                    className="flex h-8 flex-shrink-0 items-center gap-1 rounded-lg px-2.5 text-xs font-semibold text-stone-500 hover:bg-red-50 hover:text-red-600"
                    onClick={() => setConfirmDelete(true)}
                    type="button"
                  >
                    <i className="ph-bold ph-trash" /> Xóa hội thoại
                  </button>
                ) : (
                  <div className="flex flex-shrink-0 items-center gap-1.5">
                    <button
                      className="rounded-lg bg-red-600 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-60"
                      disabled={deleting}
                      onClick={() => void deleteActiveConversation()}
                      type="button"
                    >
                      {deleting ? 'Đang xóa…' : 'Chắc chắn?'}
                    </button>
                    <button
                      className="rounded-lg px-2 py-1.5 text-xs font-semibold text-stone-500 hover:bg-stone-100"
                      disabled={deleting}
                      onClick={() => setConfirmDelete(false)}
                      type="button"
                    >
                      Hủy
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto bg-stone-50 px-4 py-4" ref={scrollRef}>
                {loadingThread ? (
                  <p className="text-center text-sm text-stone-400">Đang tải…</p>
                ) : (
                  messages.map((m) => (
                    <div key={m.id} className={m.sender === 'admin' ? 'flex justify-end' : 'flex justify-start'}>
                      <div
                        className={`max-w-[75%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
                          m.sender === 'admin' ? 'bg-brand-700 text-white' : 'bg-white text-stone-800 shadow-sm'
                        }`}
                      >
                        {m.content}
                        <span
                          className={`mt-1 block text-[10px] ${m.sender === 'admin' ? 'text-brand-100/80' : 'text-stone-400'}`}
                        >
                          {timeLabel(m.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-stone-200 p-3">
                <div className="flex items-end gap-2">
                  <textarea
                    className="max-h-28 min-h-[2.5rem] flex-1 resize-none rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    onChange={(e) => setReply(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        void sendReply()
                      }
                    }}
                    placeholder="Nhập câu trả lời cho khách…"
                    rows={1}
                    value={reply}
                  />
                  <button
                    className="flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-brand-700 px-4 text-sm font-bold text-white transition hover:bg-brand-800 disabled:opacity-50"
                    disabled={sending || !reply.trim()}
                    onClick={() => void sendReply()}
                    type="button"
                  >
                    <i className="ph-bold ph-paper-plane-tilt" /> Gửi
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
