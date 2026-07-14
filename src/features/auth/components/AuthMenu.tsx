'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

type AuthUser = {
  id: string
  email: string | null
  phone: string | null
  fullName: string | null
  role: 'customer' | 'admin' | 'pharmacist'
} | null

// Menu tài khoản dùng chung cho các header (client-side).
// Tự gọi /api/auth/me để biết trạng thái đăng nhập, không cần truyền prop từ server.
// onNavigate: gọi khi người dùng thực sự điều hướng (bấm 1 mục / đăng nhập / đăng xuất),
// KHÔNG gọi khi chỉ mở/đóng dropdown — để header mobile đóng menu đúng lúc, tránh
// việc bấm nút tài khoản lại làm sập luôn cả menu mobile (khiến không vào được trang quản trị).
export default function AuthMenu({
  variant = 'light',
  onNavigate,
}: {
  variant?: 'light' | 'dark'
  onNavigate?: () => void
}) {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser>(null)
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let active = true
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data) => {
        if (active) setUser(data.user ?? null)
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
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

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    setOpen(false)
    onNavigate?.()
    window.dispatchEvent(new CustomEvent('qt:auth-changed'))
    router.refresh()
  }

  const triggerClass =
    variant === 'dark'
      ? 'bg-white/15 text-white hover:bg-white/25'
      : 'bg-brand-50 text-brand-800 hover:bg-brand-100'

  if (loading) {
    return <div className={`h-9 w-24 animate-pulse rounded-full ${variant === 'dark' ? 'bg-white/10' : 'bg-brand-50'}`} />
  }

  if (!user) {
    return (
      <Link
        className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ${triggerClass}`}
        href="/auth/login"
        onClick={() => onNavigate?.()}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
          <path d="M4 20a8 8 0 0 1 16 0" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
        Đăng nhập
      </Link>
    )
  }

  const contactLabel = user.email ?? user.phone ?? ''
  const displayName = user.fullName?.trim() || contactLabel

  return (
    <div className="relative shrink-0" ref={boxRef}>
      <button
        className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition ${triggerClass}`}
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
          {displayName.charAt(0).toUpperCase()}
        </span>
        <span className="max-w-[120px] truncate">{displayName}</span>
        <svg className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24">
          <path d="m6 9 6 6 6-6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-xl shadow-brand-900/10">
          <div className="border-b border-stone-100 px-4 py-3">
            <p className="truncate text-sm font-bold text-stone-900">{displayName}</p>
            <p className="truncate text-xs text-stone-500">{contactLabel}</p>
          </div>
          <div className="p-1.5">
            <Link
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-stone-700 transition hover:bg-brand-50 hover:text-brand-800"
              href="/account/orders"
              onClick={() => {
                setOpen(false)
                onNavigate?.()
              }}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                <path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.6" />
                <path d="M8 12h8M8 16h5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
              </svg>
              Đơn hàng của tôi
            </Link>
            {user.role === 'admin' && (
              <>
                <Link
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-brand-700 transition hover:bg-brand-50"
                  href="/admin/chat"
                  onClick={() => {
                    setOpen(false)
                    onNavigate?.()
                  }}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
                  </svg>
                  Tư vấn
                </Link>
                <Link
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-amber-700 transition hover:bg-amber-50"
                  href="/admin"
                  onClick={() => {
                    setOpen(false)
                    onNavigate?.()
                  }}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <path d="m12 3 7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7l7-4Z" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                  Trang quản trị
                </Link>
              </>
            )}
            <button
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
              onClick={handleLogout}
              type="button"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
              </svg>
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
