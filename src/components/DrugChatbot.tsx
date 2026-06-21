'use client'

import { useEffect, useRef, useState } from 'react'

type ChatRole = 'user' | 'assistant'

type ChatMessage = {
  role: ChatRole
  content: string
}

const WELCOME: ChatMessage = {
  role: 'assistant',
  content:
    'Xin chào! Mình là trợ lý nhà thuốc. Bạn cần tra cứu sản phẩm hay công dụng nào? (ví dụ: "thuốc hạ sốt", "vitamin C", "omega 3")',
}

export default function DrugChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isOpen])

  async function sendMessage() {
    const text = input.trim()
    if (!text || isLoading) {
      return
    }

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: text }]
    setMessages([...nextMessages, { role: 'assistant', content: '' }])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Bỏ tin nhắn chào mừng (chỉ ở client) khi gửi lên server.
        body: JSON.stringify({ messages: nextMessages.filter((m) => m !== WELCOME) }),
      })

      if (!response.ok || !response.body) {
        throw new Error(`HTTP ${response.status}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      for (;;) {
        const { done, value } = await reader.read()
        if (done) {
          break
        }
        accumulated += decoder.decode(value, { stream: true })
        setMessages((current) => {
          const updated = [...current]
          updated[updated.length - 1] = { role: 'assistant', content: accumulated }
          return updated
        })
      }
    } catch {
      setMessages((current) => {
        const updated = [...current]
        updated[updated.length - 1] = {
          role: 'assistant',
          content:
            'Xin lỗi, hiện chưa kết nối được trợ lý. Vui lòng thử lại sau hoặc liên hệ nhà thuốc.',
        }
        return updated
      })
    } finally {
      setIsLoading(false)
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
      {/* Nút mở chat */}
      <button
        aria-label={isOpen ? 'Đóng trợ lý nhà thuốc' : 'Mở trợ lý nhà thuốc'}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-700 text-white shadow-lg shadow-emerald-900/30 transition hover:bg-emerald-800"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        {isOpen ? (
          <span className="text-2xl leading-none">✕</span>
        ) : (
          <span className="text-2xl leading-none">💬</span>
        )}
      </button>

      {/* Khung chat */}
      {isOpen ? (
        <div className="fixed bottom-24 right-5 z-50 flex h-[32rem] w-[90vw] max-w-sm flex-col overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-2xl">
          <div className="border-b border-emerald-100 bg-emerald-50 px-4 py-3">
            <p className="text-sm font-bold text-emerald-800">Trợ lý nhà thuốc</p>
            <p className="text-xs text-stone-500">Tra cứu sản phẩm &amp; công dụng</p>
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
                      ? 'bg-emerald-700 text-white'
                      : 'bg-stone-100 text-stone-800'
                  }`}
                >
                  {message.content || (isLoading ? '…' : '')}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-stone-200 p-3">
            <div className="flex items-end gap-2">
              <textarea
                className="max-h-24 min-h-[2.5rem] flex-1 resize-none rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập câu hỏi về sản phẩm..."
                rows={1}
                value={input}
              />
              <button
                aria-label="Gửi"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white transition hover:bg-emerald-800 disabled:opacity-50"
                disabled={isLoading || !input.trim()}
                onClick={() => void sendMessage()}
                type="button"
              >
                ➤
              </button>
            </div>
            <p className="mt-2 text-[10px] leading-tight text-stone-400">
              Thông tin chỉ mang tính tham khảo, không thay thế tư vấn của bác sĩ/dược sĩ.
            </p>
          </div>
        </div>
      ) : null}
    </>
  )
}
