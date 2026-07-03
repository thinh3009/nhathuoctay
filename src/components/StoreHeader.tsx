'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { CATEGORY_CONFIG } from '@/lib/constants'
import AuthMenu from '@/components/AuthMenu'

type AuthUser = { userId: string; email: string; role: string } | null

type StoreHeaderProps = {
  activeCategorySlug?: string
  cartCount: number
  variant?: 'default' | 'landing'
  user?: AuthUser
}

function CartIcon({ cartCount }: { cartCount: number }) {
  return (
    <div className="relative">
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path
          d="M4 6h2l2.1 9.1a1 1 0 0 0 1 .8h7.8a1 1 0 0 0 1-.8L20 9H8"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <circle cx="10" cy="19" r="1.3" fill="currentColor" />
        <circle cx="17" cy="19" r="1.3" fill="currentColor" />
      </svg>
      {cartCount > 0 ? (
        <span className="absolute -right-2 -top-2 min-w-5 rounded-full bg-emerald-950 px-1.5 text-center text-[11px] font-bold text-white shadow-sm shadow-emerald-700/30 motion-safe:animate-pulse">
          {cartCount}
        </span>
      ) : null}
    </div>
  )
}

function HeaderTopRow({
  cartCount,
  onOpenMenu,
  light = false,
}: {
  cartCount: number
  onOpenMenu: () => void
  light?: boolean
}) {
  const buttonClass = light
    ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
    : 'bg-white/15 text-white hover:bg-white/20'

  const eyebrowClass = light ? 'text-emerald-600' : 'text-emerald-100'
  const titleClass = light ? 'text-stone-900' : 'text-white'

  return (
    <div className="grid grid-cols-[48px_minmax(0,1fr)_48px] items-center gap-3">
      <button
        aria-label="Mở danh mục"
        className={`flex h-12 w-12 items-center justify-center rounded-full backdrop-blur-sm transition duration-300 active:scale-95 ${buttonClass}`}
        onClick={onOpenMenu}
        type="button"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
        </svg>
      </button>

      <div className="min-w-0 text-center">
        <p className={`text-xs uppercase tracking-[0.26em] ${eyebrowClass}`}>Nhà thuốc</p>
        <Link className={`block truncate text-[1.8rem] font-extrabold tracking-tight ${titleClass}`} href="/">
          NutriHome
        </Link>
      </div>

      <Link
        aria-label="Giỏ hàng"
        className={`flex h-12 w-12 items-center justify-center rounded-full backdrop-blur-sm transition duration-300 active:scale-95 ${buttonClass}`}
        href="/cart"
      >
        <CartIcon cartCount={cartCount} />
      </Link>
    </div>
  )
}

function CategoryDrawer({
  activeCategorySlug,
  isOpen,
  onClose,
}: {
  activeCategorySlug?: string
  isOpen: boolean
  onClose: () => void
}) {
  return (
    <div aria-hidden={!isOpen} className={`fixed inset-0 z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <button
        aria-label="Đóng danh mục"
        className={`absolute inset-0 bg-emerald-950/40 backdrop-blur-[2px] transition duration-300 ease-out ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        type="button"
      />

      <aside
        className={`absolute left-0 top-0 h-full w-[86%] max-w-sm bg-white px-5 pb-6 pt-5 shadow-2xl transition-all duration-300 ease-out ${
          isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">Danh mục</p>
            <h2 className="mt-1 text-2xl font-bold text-stone-900">Mở nhanh khu mua sắm</h2>
          </div>
          <button
            aria-label="Đóng"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 text-stone-600"
            onClick={onClose}
            type="button"
          >
            ✕
          </button>
        </div>

        <nav className="mt-6 space-y-3">
          {CATEGORY_CONFIG.map((item, index) => {
            const isActive = item.slug === activeCategorySlug

            return (
              <Link
                className={`block rounded-2xl border px-4 py-4 text-sm font-semibold transition duration-300 ${
                  isActive
                    ? 'border-emerald-700 bg-emerald-50 text-emerald-800'
                    : 'border-stone-200 bg-stone-50 text-stone-800 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700'
                } ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}
                href={`/category/${item.slug}`}
                key={item.slug}
                onClick={onClose}
                style={{ transitionDelay: `${index * 45}ms` }}
              >
                <span className="block text-base">{item.label}</span>
                <span className="mt-1 block text-xs font-medium leading-5 text-stone-500">{item.heroTitle}</span>
              </Link>
            )
          })}
          <Link
            className={`block rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4 text-sm font-semibold text-stone-800 transition duration-300 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 ${
              isOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
            }`}
            href="/bai-viet"
            onClick={onClose}
            style={{ transitionDelay: `${CATEGORY_CONFIG.length * 45}ms` }}
          >
            <span className="block text-base">Tin tức</span>
            <span className="mt-1 block text-xs font-medium leading-5 text-stone-500">
              Bài viết &amp; cẩm nang sức khỏe
            </span>
          </Link>
        </nav>
      </aside>
    </div>
  )
}

export default function StoreHeader({
  activeCategorySlug,
  cartCount,
  variant = 'default',
  user,
}: StoreHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  if (variant === 'landing') {
    return (
      <>
        <header className="overflow-hidden rounded-[28px] bg-gradient-to-b from-emerald-900 via-emerald-800 to-green-600 text-white shadow-lg shadow-emerald-200">
          <div className="bg-emerald-950/95 px-4 py-2.5 text-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium text-emerald-100">
                🏥 Nhà thuốc 16 — Chính hãng, giao nhanh, dược sĩ tư vấn 24/7
              </p>
              <div className="flex shrink-0 items-center gap-2">
                <Link
                  className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white transition hover:bg-white/20"
                  href="/bai-viet"
                >
                  Tin tức
                </Link>
                {user ? (
                  <Link
                    className="flex items-center gap-1.5 rounded-full bg-emerald-800 px-3 py-1 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-700"
                    href="/account/orders"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
                      <path d="M4 20a8 8 0 0 1 16 0" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
                    </svg>
                    Tài khoản
                  </Link>
                ) : (
                  <Link
                    className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white transition hover:bg-white/20"
                    href="/auth/login"
                  >
                    Đăng nhập
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <Link
                    className="rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white transition hover:bg-amber-600"
                    href="/admin"
                  >
                    Admin
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="px-4 pb-5 pt-4">
            <HeaderTopRow cartCount={cartCount} onOpenMenu={() => setIsOpen(true)} />

            <div className="mt-4 flex items-center gap-3 rounded-full bg-white px-4 py-3 text-stone-500 shadow-md shadow-emerald-700/15">
              <svg className="h-5 w-5 shrink-0 text-emerald-700" fill="none" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
                <path d="m16 16 4 4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
              </svg>
              <span className="min-w-0 flex-1 truncate text-base">Freeship qua ứng dụng</span>
              <button className="text-emerald-700" type="button">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <path d="M12 5a3 3 0 0 1 3 3v4a3 3 0 1 1-6 0V8a3 3 0 0 1 3-3Z" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M7 11.5a5 5 0 0 0 10 0M12 19v-2.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
                </svg>
              </button>
              <button className="text-emerald-700" type="button">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <path d="M8 4H6a2 2 0 0 0-2 2v2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
                  <rect x="8" y="8" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        <CategoryDrawer activeCategorySlug={activeCategorySlug} isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </>
    )
  }

  return (
    <>
      <header className="overflow-hidden rounded-[24px] border border-emerald-100 bg-white shadow-sm shadow-emerald-100/70">
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-600 px-4 py-4 text-white">
          <HeaderTopRow cartCount={cartCount} light={false} onOpenMenu={() => setIsOpen(true)} />
          <div className="mt-4 flex flex-wrap gap-2">
            {CATEGORY_CONFIG.map((item) => {
              const isActive = item.slug === activeCategorySlug

              return (
                <Link
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-white text-emerald-800'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                  href={`/category/${item.slug}`}
                  key={item.slug}
                >
                  {item.label}
                </Link>
              )
            })}
            <Link
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
              href="/bai-viet"
            >
              Tin tức
            </Link>
            <div className="ml-auto">
              <AuthMenu variant="dark" />
            </div>
          </div>
        </div>
      </header>

      <CategoryDrawer activeCategorySlug={activeCategorySlug} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
