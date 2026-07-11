'use client'

import { type CSSProperties, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import AuthMenu from '@/features/auth/components/AuthMenu'
import Logo from '@/components/ui/Logo'
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
  // Logo tùy chỉnh do admin đặt (nếu có) — đọc qua API công khai.
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined)
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

  useEffect(() => {
    let cancelled = false
    fetch('/api/site-images')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data && typeof data.logo === 'string') setLogoUrl(data.logo)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  function submitSearch() {
    const q = query.trim()
    router.push(q ? `/?q=${encodeURIComponent(q)}` : '/')
    setMobSearch(false)
  }

  // Mở trợ lý tư vấn (DrugChatbot lắng nghe sự kiện qt:open-consult).
  function openConsult() {
    try {
      window.dispatchEvent(new CustomEvent('qt:open-consult'))
    } catch {
      /* noop */
    }
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
      color: active ? 'var(--color-brand-primary)' : 'var(--color-text-body)',
      fontSize: '14px',
      padding: '13px 0',
      borderBottom: active ? '2.5px solid var(--color-brand-primary)' : '2.5px solid transparent',
      textDecoration: 'none',
      whiteSpace: 'nowrap',
    }
  }

  const cartBadge =
    cartCount > 0 ? (
      <span style={s('position:absolute;top:-6px;right:-6px;background:var(--orange-600);color:#fff;font-size:11px;font-weight:700;min-width:20px;height:20px;border-radius:11px;display:flex;align-items:center;justify-content:center;padding:0 5px')}>
        {cartCount}
      </span>
    ) : null

  return (
    <>
      {/* Thanh thông tin */}
      <div style={s('background:var(--color-footer-bg);color:var(--teal-50);font-size:12.5px')}>
        <div className="qt-topstrip" style={s('max-width:1180px;margin:0 auto;padding:7px 24px;display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%')}>
          <span>Tận tâm, tận lòng · Giao nhanh trong 2 giờ nội thành</span>
          <span style={s('display:flex;gap:18px')}>
            <span>Hotline: 1900 16 16</span>
            <Link className="qt-hide-mobile-inline" href="/account/orders" style={s('color:var(--teal-50)')}>Theo dõi đơn hàng</Link>
          </span>
        </div>
      </div>

      {/* Header chính */}
      <header style={s('position:sticky;top:0;z-index:30;background:var(--neutral-0);box-shadow:var(--shadow-xs)')}>
        <div className="qt-hrow" style={s('max-width:1180px;margin:0 auto;padding:14px 24px;display:flex;align-items:center;gap:22px;width:100%')}>
          <Link href="/" aria-label="Quầy thuốc 16 - trang chủ" style={s('display:flex;align-items:center;cursor:pointer;flex-shrink:0;text-decoration:none')}>
            <Logo height={50} src={logoUrl} />
          </Link>

          <div className="qt-search-full" style={s('flex:1;display:flex;align-items:center;background:var(--neutral-100);border:1.5px solid var(--color-border-subtle);border-radius:var(--radius-md);padding:0 6px 0 14px;max-width:560px')}>
            <i aria-hidden="true" className="ph ph-magnifying-glass" style={s('color:var(--color-text-muted);font-size:16px')} />
            <input
              aria-label="Tìm sản phẩm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitSearch()}
              placeholder="Tìm thuốc, thực phẩm chức năng, thiết bị y tế..."
              style={s('flex:1;border:none;background:transparent;outline:none;padding:11px 10px;font-size:14px;color:var(--color-text-heading)')}
            />
            <button onClick={submitSearch} style={s('border:none;background:var(--color-brand-primary);color:#fff;padding:8px 18px;border-radius:var(--radius-pill);font-weight:600;font-size:14px;cursor:pointer')}>
              Tìm
            </button>
          </div>

          <div className="qt-hactions" style={s('display:flex;align-items:center;gap:14px')}>
            <button onClick={openConsult} style={s('display:flex;align-items:center;gap:7px;border:none;background:var(--color-brand-accent);color:#fff;padding:10px 16px;border-radius:var(--radius-pill);font-weight:700;font-size:13.5px;cursor:pointer;flex-shrink:0;box-shadow:0 6px 16px rgba(240,147,13,0.35)')}>
              <i className="ph-fill ph-stethoscope" style={s('font-size:16px')} /> Tư vấn bác sĩ
            </button>
            <Link href="/?rx=1" style={s('display:flex;align-items:center;gap:7px;border:1.5px solid var(--color-brand-primary);background:var(--neutral-0);color:var(--color-brand-primary);padding:9px 14px;border-radius:var(--radius-pill);font-weight:600;font-size:13.5px;cursor:pointer;flex-shrink:0;text-decoration:none')}>
              <i className="ph ph-clipboard-text" style={s('font-size:16px')} /> Đặt thuốc theo toa
            </Link>
            <Link href="/cart" style={s('position:relative;display:flex;align-items:center;gap:8px;background:var(--teal-50);color:var(--teal-800);padding:9px 15px;border-radius:var(--radius-pill);font-weight:600;font-size:13.5px;cursor:pointer;flex-shrink:0;text-decoration:none')}>
              <i aria-hidden="true" className="ph ph-shopping-cart-simple" style={s('font-size:17px')} /> Giỏ hàng
              {cartBadge}
            </Link>
            <AuthMenu variant="light" />
          </div>

          {/* Icon mobile: tìm kiếm + giỏ + menu */}
          <div className="qt-hmobile" style={s('align-items:center;gap:8px;margin-left:auto')}>
            <button aria-label="Tìm kiếm" aria-expanded={mobSearch} onClick={() => { setMobSearch((v) => !v); setMobMenu(false) }} style={s('display:flex;align-items:center;justify-content:center;width:40px;height:40px;border:none;background:var(--neutral-100);border-radius:50%;font-size:18px;cursor:pointer;color:var(--color-brand-primary)')}><i className="ph ph-magnifying-glass" /></button>
            <Link href="/cart" aria-label={`Giỏ hàng${cartCount > 0 ? `, ${cartCount} sản phẩm` : ''}`} style={s('position:relative;display:flex;align-items:center;justify-content:center;width:40px;height:40px;border:none;background:var(--teal-50);border-radius:50%;font-size:18px;cursor:pointer;text-decoration:none;color:var(--teal-800)')}><i className="ph ph-shopping-cart-simple" />{cartBadge}</Link>
            <button aria-label="Menu" aria-expanded={mobMenu} onClick={() => { setMobMenu((v) => !v); setMobSearch(false) }} style={s('display:flex;align-items:center;justify-content:center;width:40px;height:40px;border:none;background:var(--neutral-100);border-radius:50%;font-size:18px;cursor:pointer;color:var(--color-text-heading)')}><i className="ph ph-list" /></button>
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
              style={s('flex:1;border:1.5px solid var(--color-border-subtle);background:var(--neutral-100);border-radius:var(--radius-md);outline:none;padding:11px 14px;font-size:14px;color:var(--color-text-heading)')}
            />
            <button onClick={submitSearch} style={s('border:none;background:var(--color-brand-primary);color:#fff;padding:0 18px;border-radius:var(--radius-pill);font-weight:600;font-size:14px;cursor:pointer')}>Tìm</button>
          </div>
        ) : null}

        {/* Menu mở trên mobile */}
        {mobMenu ? (
          <div className="qt-mmenu" style={s('padding:0 16px 14px;display:flex;flex-direction:column;gap:8px')}>
            <button onClick={() => { openConsult(); setMobMenu(false) }} style={s('display:flex;align-items:center;gap:9px;border:none;background:var(--color-brand-accent);color:#fff;padding:12px 14px;border-radius:var(--radius-pill);font-weight:700;font-size:14px;cursor:pointer;text-align:left')}><i className="ph-fill ph-stethoscope" /> Tư vấn bác sĩ</button>
            <Link href="/?rx=1" onClick={() => setMobMenu(false)} style={s('display:flex;align-items:center;gap:9px;border:1.5px solid var(--color-brand-primary);background:var(--neutral-0);color:var(--color-brand-primary);padding:12px 14px;border-radius:var(--radius-pill);font-weight:600;font-size:14px;text-decoration:none')}><i className="ph ph-clipboard-text" /> Đặt thuốc theo toa</Link>
            <Link href="/cart" onClick={() => setMobMenu(false)} style={s('display:flex;align-items:center;gap:9px;background:var(--teal-50);color:var(--teal-800);padding:12px 14px;border-radius:var(--radius-pill);font-weight:600;font-size:14px;text-decoration:none')}><i className="ph ph-shopping-cart-simple" /> Giỏ hàng{cartCount > 0 ? ` (${cartCount})` : ''}</Link>
            <AuthMenu variant="light" onNavigate={() => setMobMenu(false)} />
          </div>
        ) : null}

        {/* Thanh danh mục */}
        <nav aria-label="Danh mục sản phẩm" style={s('border-top:1px solid var(--color-border-subtle)')}>
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
