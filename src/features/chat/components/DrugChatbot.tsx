'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

type MessageVM = {
  id: string
  sender: 'user' | 'admin'
  content: string
  createdAt: string
}

const WELCOME =
  'Xin chào! Bạn cần tư vấn về thuốc hay sản phẩm nào? Nhắn cho dược sĩ ở đây, dược sĩ của Quầy thuốc 16 sẽ trả lời ngay trong khung chat này.'

export default function DrugChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<MessageVM[]>([])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  // undefined = chưa kiểm tra · null = chưa đăng nhập · object = đã đăng nhập.
  const [member, setMember] = useState<{ fullName: string } | null | undefined>(undefined)
  const [loadedHistory, setLoadedHistory] = useState(false)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isOpen, member])

  // Mở khung tư vấn khi bấm nút "Tư vấn bác sĩ" ở header/hero.
  useEffect(() => {
    const onOpen = () => setIsOpen(true)
    window.addEventListener('qt:open-consult', onOpen)
    return () => window.removeEventListener('qt:open-consult', onOpen)
  }, [])

  // DrugChatbot gắn ở root layout nên không remount khi điều hướng (vd. từ /auth/login về
  // trang trước đó bằng router.push). Phải tự nghe sự kiện đăng nhập/đăng xuất để kiểm tra
  // lại trạng thái, nếu không nút chat sẽ giữ nguyên trạng thái "chưa đăng nhập" đã cache.
  useEffect(() => {
    const onAuthChanged = () => {
      setMember(undefined)
      setMessages([])
      setLoadedHistory(false)
    }
    window.addEventListener('qt:auth-changed', onAuthChanged)
    return () => window.removeEventListener('qt:auth-changed', onAuthChanged)
  }, [])

  // Khi mở khung: kiểm tra đăng nhập.
  useEffect(() => {
    if (!isOpen || member !== undefined) return
    let active = true
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data) => {
        if (active) setMember(data.user ? { fullName: (data.user.fullName ?? '').trim() } : null)
      })
      .catch(() => {
        if (active) setMember(null)
      })
    return () => {
      active = false
    }
  }, [isOpen, member])

  const mergeMessages = useCallback((incoming: MessageVM[]) => {
    if (!incoming.length) return
    setMessages((cur) => {
      const seen = new Set(cur.map((m) => m.id))
      const added = incoming.filter((m) => !seen.has(m.id))
      return added.length ? [...cur, ...added] : cur
    })
  }, [])

  // Tải lịch sử tin nhắn khi đã đăng nhập.
  useEffect(() => {
    if (!isOpen || !member || loadedHistory) return
    let active = true
    fetch('/api/chat', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : { messages: [] }))
      .then((data) => {
        if (active) {
          setMessages(data.messages ?? [])
          setLoadedHistory(true)
        }
      })
      .catch(() => {
        if (active) setLoadedHistory(true)
      })
    return () => {
      active = false
    }
  }, [isOpen, member, loadedHistory])

  // Poll tin mới (dược sĩ trả lời) mỗi 5s khi khung mở & đã đăng nhập.
  useEffect(() => {
    if (!isOpen || !member || !loadedHistory) return
    const t = setInterval(async () => {
      const last = messages[messages.length - 1]?.createdAt
      const url = last ? `/api/chat?after=${encodeURIComponent(last)}` : '/api/chat'
      try {
        const res = await fetch(url, { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        mergeMessages(data.messages ?? [])
      } catch {
        /* noop */
      }
    }, 5000)
    return () => clearInterval(t)
  }, [isOpen, member, loadedHistory, messages, mergeMessages])

  async function sendMessage() {
    const text = input.trim()
    if (!text || isSending || !member) return
    setInput('')
    setIsSending(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })
      if (res.status === 401) {
        setMember(null)
        return
      }
      if (!res.ok) throw new Error('send failed')
      const data = await res.json()
      if (data.message) mergeMessages([data.message])
    } catch {
      setMessages((cur) => [
        ...cur,
        {
          id: `err-${Date.now()}`,
          sender: 'admin',
          content: 'Xin lỗi, hiện chưa gửi được. Vui lòng thử lại hoặc gọi hotline 1900 16 16.',
          createdAt: new Date().toISOString(),
        },
      ])
    } finally {
      setIsSending(false)
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void sendMessage()
    }
  }

  return (
    <>
      {/* Nút mở khung tư vấn — icon bác sĩ (ống nghe), nổi bật với tông cam + vòng nhấp nháy */}
      <div className="fixed bottom-5 right-5 z-50">
        {!isOpen ? (
          <span
            aria-hidden="true"
            className="absolute inset-0 animate-ping rounded-full"
            style={{ background: 'var(--color-brand-accent)', opacity: 0.45 }}
          />
        ) : null}
        <button
          aria-label={isOpen ? 'Đóng tư vấn dược sĩ' : 'Tư vấn dược sĩ'}
          className="relative flex h-16 w-16 items-center justify-center rounded-full text-white transition-transform hover:scale-105"
          onClick={() => setIsOpen((open) => !open)}
          type="button"
          style={{
            background: isOpen
              ? 'var(--color-brand-primary)'
              : 'linear-gradient(135deg, var(--color-brand-accent), var(--orange-600))',
            boxShadow: isOpen
              ? 'var(--shadow-lg)'
              : '0 10px 26px rgba(240,147,13,0.55), 0 0 0 4px rgba(255,255,255,0.9)',
          }}
        >
          {isOpen ? (
            <i className="ph-bold ph-x" style={{ fontSize: 26 }} />
          ) : (
            <i className="ph-fill ph-stethoscope" style={{ fontSize: 32 }} />
          )}
        </button>
      </div>

      {/* Khung tư vấn */}
      {isOpen ? (
        <div className="fixed bottom-24 right-5 z-50 flex h-[32rem] w-[90vw] max-w-sm flex-col overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-2xl">
          <div className="flex items-center gap-3 border-b border-brand-100 bg-brand-50 px-4 py-3">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full text-white"
              style={{ background: 'var(--color-brand-accent)' }}
            >
              <i className="ph-fill ph-stethoscope" style={{ fontSize: 18 }} />
            </span>
            <div>
              <p className="text-sm font-bold text-brand-800">Tư vấn dược sĩ</p>
              <p className="text-xs text-stone-500">Dược sĩ trả lời trực tiếp trong khung này</p>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4" ref={scrollRef}>
            {/* Lời chào tĩnh luôn hiển thị đầu khung */}
            <div className="flex justify-start">
              <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl bg-stone-100 px-3 py-2 text-sm text-stone-800">
                {WELCOME}
              </div>
            </div>
            {messages.map((m) => (
              <div key={m.id} className={m.sender === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
                    m.sender === 'user' ? 'bg-brand-700 text-white' : 'bg-stone-100 text-stone-800'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-stone-200 p-3">
            {member === undefined ? (
              <div className="flex items-center justify-center gap-2 py-6 text-sm text-stone-400">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-stone-300 border-t-brand-600" />
                Đang kiểm tra đăng nhập…
              </div>
            ) : member === null ? (
              <div className="flex flex-col items-center gap-3 py-4 text-center">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-full text-white"
                  style={{ background: 'var(--color-brand-accent)' }}
                >
                  <i className="ph-fill ph-lock-key" style={{ fontSize: 22 }} />
                </span>
                <p className="text-sm font-semibold text-stone-700">Cần đăng nhập để được tư vấn</p>
                <p className="text-xs text-stone-500">
                  Vui lòng đăng nhập để dược sĩ biết bạn là ai và trả lời trực tiếp cho bạn.
                </p>
                <Link
                  className="w-full rounded-full bg-brand-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-800"
                  href={`/auth/login?from=${encodeURIComponent(typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/')}`}
                >
                  Đăng nhập
                </Link>
                <p className="text-xs text-stone-400">
                  Chưa có tài khoản?{' '}
                  <Link className="font-semibold text-brand-700 hover:underline" href="/auth/register">
                    Đăng ký
                  </Link>
                </p>
              </div>
            ) : (
              <>
                <p className="mb-2 text-xs text-stone-500">
                  Đang tư vấn với tư cách <span className="font-semibold text-brand-700">{member.fullName || 'thành viên'}</span>
                </p>
                <div className="flex items-end gap-2">
                  <textarea
                    className="max-h-24 min-h-[2.5rem] flex-1 resize-none rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Nhập câu hỏi cho dược sĩ..."
                    rows={1}
                    value={input}
                  />
                  <button
                    aria-label="Gửi"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-700 text-white transition hover:bg-brand-800 disabled:opacity-50"
                    disabled={isSending || !input.trim()}
                    onClick={() => void sendMessage()}
                    type="button"
                  >
                    <i className="ph-bold ph-paper-plane-tilt" style={{ fontSize: 18 }} />
                  </button>
                </div>
                <p className="mt-2 text-[10px] leading-tight text-stone-400">
                  Thông tin chỉ mang tính tham khảo, không thay thế tư vấn của bác sĩ/dược sĩ.
                </p>
              </>
            )}
          </div>
        </div>
      ) : null}
    </>
  )
}
