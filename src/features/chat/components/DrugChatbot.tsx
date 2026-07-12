'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

type ChatRole = 'user' | 'assistant'

type ChatMessage = {
  role: ChatRole
  content: string
}

const WELCOME: ChatMessage = {
  role: 'assistant',
  content:
    'Xin chào! Bạn cần tư vấn về thuốc hay sản phẩm nào? Để lại câu hỏi (và số điện thoại nếu muốn được gọi lại), dược sĩ của Quầy thuốc 16 sẽ liên hệ với bạn sớm nhất.',
}

export default function DrugChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME])
  const [input, setInput] = useState('')
  const [contact, setContact] = useState('')
  const [isSending, setIsSending] = useState(false)
  // undefined = chưa kiểm tra · null = chưa đăng nhập · object = đã đăng nhập.
  const [member, setMember] = useState<{ fullName: string } | null | undefined>(undefined)
  // Đường dẫn quay lại sau khi đăng nhập (cập nhật sau khi mount, an toàn khi hydrate).
  const [returnUrl, setReturnUrl] = useState('/')
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setReturnUrl(window.location.pathname + window.location.search)
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isOpen])

  // Khi mở khung: kiểm tra đăng nhập để lấy tên từ DB. Chưa đăng nhập → yêu cầu đăng nhập.
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

  // Mở khung tư vấn khi bấm nút "Tư vấn bác sĩ" ở header/hero (sự kiện qt:open-consult).
  useEffect(() => {
    const onOpen = () => setIsOpen(true)
    window.addEventListener('qt:open-consult', onOpen)
    return () => window.removeEventListener('qt:open-consult', onOpen)
  }, [])

  async function sendMessage() {
    const text = input.trim()
    if (!text || isSending || !member) {
      return
    }

    setMessages((current) => [...current, { role: 'user', content: text }])
    setInput('')
    setIsSending(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          contact: contact.trim() || undefined,
          pageUrl: typeof window !== 'undefined' ? window.location.href : undefined,
        }),
      })

      if (response.status === 401) {
        // Phiên hết hạn giữa chừng → nhắc đăng nhập lại.
        setMember(null)
        throw new Error('Vui lòng đăng nhập để được tư vấn.')
      }
      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error ?? `HTTP ${response.status}`)
      }

      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content:
            'Đã gửi tới dược sĩ ✅ Dược sĩ sẽ xem và liên hệ với bạn trong thời gian sớm nhất. Bạn có thể nhắn thêm thông tin nếu cần.',
        },
      ])
    } catch (error) {
      const known =
        error instanceof Error &&
        (error.message.includes('nhanh') || error.message.includes('đăng nhập'))
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: known
            ? (error as Error).message
            : 'Xin lỗi, hiện chưa gửi được. Vui lòng thử lại hoặc gọi hotline 1900 16 16.',
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
              <p className="text-xs text-stone-500">Nhắn tin, dược sĩ sẽ liên hệ lại</p>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4" ref={scrollRef}>
            {messages.map((message, index) => (
              <div
                className={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
                key={index}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
                    message.role === 'user'
                      ? 'bg-brand-700 text-white'
                      : 'bg-stone-100 text-stone-800'
                  }`}
                >
                  {message.content}
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
                  Vui lòng đăng nhập để dược sĩ biết bạn là ai và tiện liên hệ lại.
                </p>
                <Link
                  className="w-full rounded-full bg-brand-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-800"
                  href={`/auth/login?from=${encodeURIComponent(returnUrl)}`}
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
                <input
                  className="mb-2 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  inputMode="tel"
                  onChange={(event) => setContact(event.target.value)}
                  placeholder="Số điện thoại để dược sĩ gọi lại (tuỳ chọn)"
                  value={contact}
                />
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
