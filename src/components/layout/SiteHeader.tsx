'use client'

import { type CSSProperties, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import AuthMenu from '@/features/auth/components/AuthMenu'
import { CATEGORY_CONFIG } from '@/lib/constants'
import { s } from '@/features/storefront/data'

// Header dùng chung, khớp giao diện + responsive mobile của trang chủ (QuayThuoc16).
// Điều hướng bằng route thật: tìm kiếm & đặt thuốc theo toa mở trang chủ kèm
// query (?q= / ?rx=1) — QuayThuoc16 đọc param này để mở đúng màn hình.
export default function SiteHeader({
  cartCount = 0,
  activeCategorySlug,
}: {
  cartCount?: number
  activeCategorySlug?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [query, setQuery] = useState('')
  const [mobSearch, setMobSearch] = useState(false)
  const [mobMenu, setMobMenu] = useState(false)
  // Danh mục hiển thị trên nav: khởi tạo bằng config tĩnh (ổn định khi SSR),
  // sau đó đồng bộ từ DB qua /api/categories — danh mục admin đã ẩn sẽ biến mất.
  const [navCategories, setNavCategories] = useState<{ slug: string; label: string }[]>(
    CATEGORY_CONFIG.map((c) => ({ slug: c.slug, label: c.label })),
  )

  useEffect(() => {
    let cancelled = false
    fetch('/api/categories')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && Array.isArray(data?.items)) {
          setNavCategories(data.items.map((item: { slug: string; label: string }) => ({ slug: item.slug, label: item.label })))
        }
      })
      .catch(() => {}) // lỗi mạng → giữ danh sách tĩnh
    return () => {
      cancelled = true
    }
  }, [])

  function submitSearch() {
    const q = query.trim()
    router.push(q ? `/?q=${encodeURIComponent(q)}` : '/')
    setMobSearch(false)
  }

  const navItems: { label: string; href: string; active: boolean }[] = [
    ...navCategories.map((c) => ({
      label: c.label,
      href: `/category/${c.slug}`,
      active: activeCategorySlug === c.slug,
    })),
    { label: 'Tin tức', href: '/bai-viet', active: pathname?.startsWith('/bai-viet') ?? false },
  ]

  function navStyle(active: boolean): CSSProperties {
    return {
      cursor: 'pointer',
      fontWeight: active ? 700 : 500,
      color: active ? '#1c7a45' : '#3a4a42',
      fontSize: '14px',
      padding: '13px 0',
      borderBottom: active ? '2px solid #2e9e5b' : '2px solid transparent',
      textDecoration: 'none',
      whiteSpace: 'nowrap',
    }
  }

  const cartBadge =
    cartCount > 0 ? (
      <span style={s('position:absolute;top:-6px;right:-6px;background:#e8654e;color:#fff;font-size:11px;font-weight:700;min-width:20px;height:20px;border-radius:11px;display:flex;align-items:center;justify-content:center;padding:0 5px')}>
        {cartCount}
      </span>
    ) : null

  return (
    <>
      {/* Thanh thông tin */}
      <div style={s('background:#14532d;color:#cdeed8;font-size:12.5px')}>
        <div className="qt-topstrip" style={s('max-width:1180px;margin:0 auto;padding:7px 24px;display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%')}>
          <span>Tận tâm, tận lòng · Giao nhanh trong 2 giờ nội thành</span>
          <span style={s('display:flex;gap:18px')}>
            <span>Hotline: 1900 16 16</span>
            <Link className="qt-hide-mobile-inline" href="/account/orders" style={s('color:#cdeed8')}>Theo dõi đơn hàng</Link>
          </span>
        </div>
      </div>

      {/* Header chính */}
      <header style={s('position:sticky;top:0;z-index:30;background:#fff;box-shadow:0 1px 0 #e4ece7')}>
        <div className="qt-hrow" style={s('max-width:1180px;margin:0 auto;padding:14px 24px;display:flex;align-items:center;gap:22px;width:100%')}>
          <Link href="/" aria-label="Quầy thuốc 16 - trang chủ" style={s('display:flex;align-items:center;gap:11px;cursor:pointer;flex-shrink:0;text-decoration:none')}>
            <div style={s('width:42px;height:42px;background:#2e9e5b;border-radius:12px;position:relative;flex-shrink:0')}>
              <div style={s('position:absolute;left:38%;top:20%;width:24%;height:60%;background:#fff;border-radius:4px')} />
              <div style={s('position:absolute;top:38%;left:20%;height:24%;width:60%;background:#fff;border-radius:4px')} />
            </div>
            <div style={s('line-height:1.1')}>
              <div style={s('font-size:19px;font-weight:800;color:#14532d')}>
                Quầy thuốc <span style={s('color:#2e9e5b')}>16</span>
              </div>
              <div style={s('font-size:11px;color:#8a948e;font-weight:500')}>Tận tâm, tận lòng</div>
            </div>
          </Link>

          <div className="qt-search-full" style={s('flex:1;display:flex;align-items:center;background:#f1f6f3;border:1.5px solid #e0ebe4;border-radius:12px;padding:0 6px 0 14px;max-width:560px')}>
            <span aria-hidden="true" style={s('color:#8a948e;font-size:16px')}>⌕</span>
            <input
              aria-label="Tìm sản phẩm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitSearch()}
              placeholder="Tìm thuốc, thực phẩm chức năng, thiết bị y tế..."
              style={s('flex:1;border:none;background:transparent;outline:none;padding:11px 10px;font-size:14px;color:#1f2a24')}
            />
            <button onClick={submitSearch} style={s('border:none;background:#2e9e5b;color:#fff;padding:8px 18px;border-radius:9px;font-weight:600;font-size:14px;cursor:pointer')}>
              Tìm
            </button>
          </div>

          <div className="qt-hactions" style={s('display:flex;align-items:center;gap:14px')}>
            <Link href="/?rx=1" style={s('display:flex;align-items:center;gap:7px;border:1.5px solid #2e9e5b;background:#fff;color:#1c7a45;padding:9px 14px;border-radius:11px;font-weight:600;font-size:13.5px;cursor:pointer;flex-shrink:0;text-decoration:none')}>
              📋 Đặt thuốc theo toa
            </Link>
            <Link href="/cart" style={s('position:relative;display:flex;align-items:center;gap:8px;background:#eaf6ef;color:#14532d;padding:9px 15px;border-radius:11px;font-weight:600;font-size:13.5px;cursor:pointer;flex-shrink:0;text-decoration:none')}>
              <span aria-hidden="true" style={s('font-size:17px')}>🛒</span> Giỏ hàng
              {cartBadge}
            </Link>
            <AuthMenu variant="light" />
          </div>

          {/* Icon mobile: tìm kiếm + giỏ + menu */}
          <div className="qt-hmobile" style={s('align-items:center;gap:8px;margin-left:auto')}>
            <button aria-label="Tìm kiếm" aria-expanded={mobSearch} onClick={() => { setMobSearch((v) => !v); setMobMenu(false) }} style={s('display:flex;align-items:center;justify-content:center;width:40px;height:40px;border:1.5px solid #e0ebe4;background:#f1f6f3;border-radius:11px;font-size:18px;cursor:pointer;color:#1c7a45')}>⌕</button>
            <Link href="/cart" aria-label={`Giỏ hàng${cartCount > 0 ? `, ${cartCount} sản phẩm` : ''}`} style={s('position:relative;display:flex;align-items:center;justify-content:center;width:40px;height:40px;border:none;background:#eaf6ef;border-radius:11px;font-size:18px;cursor:pointer;text-decoration:none')}>🛒{cartBadge}</Link>
            <button aria-label="Menu" aria-expanded={mobMenu} onClick={() => { setMobMenu((v) => !v); setMobSearch(false) }} style={s('display:flex;align-items:center;justify-content:center;width:40px;height:40px;border:1.5px solid #e0ebe4;background:#f1f6f3;border-radius:11px;font-size:18px;cursor:pointer;color:#14532d')}>☰</button>
          </div>
        </div>

        {/* Ô tìm kiếm mở trên mobile */}
        {mobSearch ? (
          <div className="qt-msearch" style={s('padding:0 16px 12px;display:flex;gap:8px')}>
            <input
              aria-label="Tìm sản phẩm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitSearch()}
              placeholder="Tìm thuốc, TPCN, thiết bị y tế..."
              style={s('flex:1;border:1.5px solid #e0ebe4;background:#f1f6f3;border-radius:11px;outline:none;padding:11px 14px;font-size:14px;color:#1f2a24')}
            />
            <button onClick={submitSearch} style={s('border:none;background:#2e9e5b;color:#fff;padding:0 18px;border-radius:11px;font-weight:600;font-size:14px;cursor:pointer')}>Tìm</button>
          </div>
        ) : null}

        {/* Menu mở trên mobile */}
        {mobMenu ? (
          <div className="qt-mmenu" style={s('padding:0 16px 14px;display:flex;flex-direction:column;gap:8px')}>
            <Link href="/?rx=1" onClick={() => setMobMenu(false)} style={s('display:flex;align-items:center;gap:9px;border:1.5px solid #2e9e5b;background:#fff;color:#1c7a45;padding:12px 14px;border-radius:11px;font-weight:600;font-size:14px;text-decoration:none')}>📋 Đặt thuốc theo toa</Link>
            <Link href="/cart" onClick={() => setMobMenu(false)} style={s('display:flex;align-items:center;gap:9px;background:#eaf6ef;color:#14532d;padding:12px 14px;border-radius:11px;font-weight:600;font-size:14px;text-decoration:none')}>🛒 Giỏ hàng{cartCount > 0 ? ` (${cartCount})` : ''}</Link>
            <AuthMenu variant="light" onNavigate={() => setMobMenu(false)} />
          </div>
        ) : null}

        {/* Thanh danh mục */}
        <nav aria-label="Danh mục sản phẩm" style={s('border-top:1px solid #eef3f0')}>
          <div className="qt-nav-inner" style={s('max-width:1180px;margin:0 auto;padding:0 24px;display:flex;gap:26px;width:100%;overflow-x:auto')}>
            {navItems.map((n) => (
              <Link href={n.href} key={n.href} aria-current={n.active ? 'page' : undefined} style={navStyle(n.active)}>
                {n.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>
    </>
  )
}
