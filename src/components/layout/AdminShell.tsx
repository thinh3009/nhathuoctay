'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SITE_NAME } from '@/config/site'
import AdminLogoutButton from './AdminLogoutButton'

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: 'grid' },
  { href: '/admin/products', label: 'Sản phẩm', icon: 'box' },
  { href: '/admin/combos', label: 'Combo', icon: 'combo' },
  { href: '/admin/images', label: 'Quản lý ảnh', icon: 'image' },
  { href: '/admin/categories', label: 'Danh mục', icon: 'tag' },
  { href: '/admin/orders', label: 'Đơn hàng', icon: 'receipt' },
  { href: '/admin/articles', label: 'Bài viết', icon: 'pen' },
  { href: '/admin/users', label: 'Người dùng', icon: 'users' },
] as const

function NavIcon({ name }: { name: string }) {
  if (name === 'grid') return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <rect height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" width="7" x="3" y="3" />
      <rect height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" width="7" x="14" y="3" />
      <rect height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" width="7" x="3" y="14" />
      <rect height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" width="7" x="14" y="14" />
    </svg>
  )
  if (name === 'box') return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="m3.27 6.96 8.73 5.04 8.73-5.04M12 22.08V12" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
  if (name === 'tag') return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="7" cy="7" fill="currentColor" r="1.5" />
    </svg>
  )
  if (name === 'users') return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
  if (name === 'combo') return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M20 12v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8" stroke="currentColor" strokeWidth="1.8" />
      <rect height="4" rx="1" stroke="currentColor" strokeWidth="1.8" width="18" x="3" y="8" />
      <path d="M12 8v13M12 8S10.5 3 8 3 5 6.5 12 8ZM12 8s1.5-5 4-5 3 3.5-4 5Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  )
  if (name === 'image') return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <rect height="18" rx="2" stroke="currentColor" strokeWidth="1.8" width="18" x="3" y="3" />
      <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="m21 15-5-5L5 21" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
  if (name === 'pen') return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M12 20h9" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  )
}

// Khung quản trị: sidebar cố định trên desktop (lg+), chuyển thành drawer trượt
// từ trái + nút ☰ trên mobile. Các class `admin-*` là điểm neo ngữ nghĩa (đóng vai
// trò không ảnh hưởng production nhưng giúp override/kiểm thử responsive dễ dàng).
export default function AdminShell({
  userEmail,
  children,
}: {
  userEmail: string
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Khoá cuộn nền + đóng bằng Escape khi drawer mở (chỉ áp dụng ở mobile).
  // Việc đóng drawer khi điều hướng được xử lý ngay tại onClick của từng link.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* Thanh trên cùng (mobile) */}
      <header className="admin-topbar fixed inset-x-0 top-0 z-30 flex h-14 items-center gap-3 border-b border-emerald-800 bg-emerald-950 px-4 text-white lg:hidden">
        <button
          aria-controls="admin-sidebar"
          aria-expanded={open}
          aria-label="Mở menu quản trị"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition hover:bg-emerald-800"
          onClick={() => setOpen(true)}
          type="button"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
          </svg>
        </button>
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">Admin</span>
        <span className="truncate text-base font-black tracking-tight">{SITE_NAME}</span>
      </header>

      {/* Lớp phủ mờ khi mở drawer (mobile) */}
      {open ? (
        <div
          aria-hidden="true"
          className="admin-backdrop fixed inset-0 z-40 bg-emerald-950/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      {/* Sidebar / Drawer */}
      <aside
        aria-label="Điều hướng quản trị"
        className={`admin-sidebar fixed inset-y-0 left-0 z-50 flex w-64 max-w-[82%] flex-col bg-emerald-950 text-white shadow-2xl transition-transform duration-300 lg:z-40 lg:max-w-none lg:translate-x-0 ${
          open ? 'admin-sidebar--open translate-x-0' : '-translate-x-full'
        }`}
        id="admin-sidebar"
      >
        <div className="flex items-center justify-between border-b border-emerald-800 px-6 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-400">Admin</p>
            <p className="mt-0.5 text-xl font-black tracking-tight">{SITE_NAME}</p>
          </div>
          <button
            aria-label="Đóng menu"
            className="admin-close flex h-9 w-9 items-center justify-center rounded-lg text-emerald-200 transition hover:bg-emerald-800 hover:text-white lg:hidden"
            onClick={() => setOpen(false)}
            type="button"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24">
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = item.href === '/admin' ? pathname === '/admin' : pathname?.startsWith(item.href)
              return (
                <Link
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? 'bg-emerald-800 text-white'
                      : 'text-emerald-100/70 hover:bg-emerald-800 hover:text-white'
                  }`}
                  href={item.href}
                  key={item.href}
                  onClick={() => setOpen(false)}
                >
                  <NavIcon name={item.icon} />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="border-t border-emerald-800 p-4">
          <div className="mb-3 rounded-xl bg-emerald-900 px-3 py-2.5">
            <p className="text-xs font-semibold text-emerald-300">Đăng nhập với tư cách</p>
            <p className="mt-0.5 truncate text-sm font-bold text-white">{userEmail}</p>
          </div>
          <AdminLogoutButton />
          <Link
            className="mt-2 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-emerald-100/70 transition hover:bg-emerald-800 hover:text-white"
            href="/"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" stroke="currentColor" strokeWidth="1.8" />
            </svg>
            Về trang chủ
          </Link>
        </div>
      </aside>

      {/* Nội dung chính */}
      <main className="admin-main flex-1 pt-14 lg:ml-64 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
