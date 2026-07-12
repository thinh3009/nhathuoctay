import AuthMenu from '@/features/auth/components/AuthMenu'
import Logo from '@/components/ui/Logo'
import { s } from '../data'
import type { StorefrontHub } from '../use-storefront'

/**
 * Header storefront: thanh thông tin trên cùng, hàng logo + ô tìm kiếm +
 * hành động (desktop) hoặc icon tìm/giỏ/menu (mobile), và thanh điều hướng.
 */
export default function HomeHeader({ hub }: { hub: StorefrontHub }) {
  const { sst, cc, set, doSearch, onQueryKey, goHome, goCart, openRx, openConsult, navLinks, mobSearch, setMobSearch, mobMenu, setMobMenu } = hub

  return (
    <>
      {/* Thanh thông tin trên cùng — cố ý KHÔNG sticky (chỉ header chính mới dính). */}
      <div style={s('background:var(--color-footer-bg);color:var(--teal-50);font-size:12.5px')}>
        <div className="qt-topstrip" style={s('max-width:1180px;margin:0 auto;padding:7px 24px;display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%')}>
          <span>Tận tâm, tận lòng · Giao nhanh trong 2 giờ nội thành</span>
          <span style={s('display:flex;gap:18px')}>
            <span>Hotline: 1900 16 16</span>
            <span className="qt-hide-mobile-inline">Theo dõi đơn hàng</span>
          </span>
        </div>
      </div>
      <header style={s('position:sticky;top:0;z-index:30;background:var(--neutral-0);box-shadow:var(--shadow-xs)')}>
      <div className="qt-hrow" style={s('max-width:1180px;margin:0 auto;padding:14px 24px;display:flex;align-items:center;gap:22px;width:100%')}>
        <div onClick={goHome} style={s('cursor:pointer;flex-shrink:0')}>
          <Logo height={50} />
        </div>
        <div className="qt-search-full" style={s('flex:1;display:flex;align-items:center;background:var(--neutral-100);border:1.5px solid var(--color-border-subtle);border-radius:var(--radius-md);padding:0 6px 0 14px;max-width:560px')}>
          <i className="ph ph-magnifying-glass" style={s('color:var(--color-text-muted);font-size:16px')} />
          <input
            value={sst.query}
            onChange={(e) => set({ query: e.target.value })}
            onKeyDown={onQueryKey}
            placeholder="Tìm thuốc, thực phẩm chức năng, thiết bị y tế..."
            style={s('flex:1;border:none;background:transparent;outline:none;padding:11px 10px;font-size:14px;color:var(--color-text-heading)')}
          />
          <button onClick={doSearch} style={s('border:none;background:var(--color-brand-primary);color:#fff;padding:8px 18px;border-radius:var(--radius-pill);font-weight:600;font-size:14px;cursor:pointer')}>
            Tìm
          </button>
        </div>
        <div className="qt-hactions" style={s('display:flex;align-items:center;gap:14px')}>
          <button onClick={openConsult} style={s('display:flex;align-items:center;gap:7px;border:none;background:var(--color-brand-accent);color:#fff;padding:10px 16px;border-radius:var(--radius-pill);font-weight:700;font-size:13.5px;cursor:pointer;flex-shrink:0;box-shadow:0 6px 16px rgba(240,147,13,0.35)')}>
            <i className="ph-fill ph-stethoscope" style={s('font-size:16px')} /> Tư vấn bác sĩ
          </button>
          <button onClick={openRx} style={s('display:flex;align-items:center;gap:7px;border:1.5px solid var(--color-brand-primary);background:var(--neutral-0);color:var(--color-brand-primary);padding:9px 14px;border-radius:var(--radius-pill);font-weight:600;font-size:13.5px;cursor:pointer;flex-shrink:0')}>
            <i className="ph ph-clipboard-text" style={s('font-size:16px')} /> Đặt thuốc theo toa
          </button>
          <button onClick={goCart} style={s('position:relative;display:flex;align-items:center;gap:8px;background:var(--teal-50);border:none;color:var(--teal-800);padding:9px 15px;border-radius:var(--radius-pill);font-weight:600;font-size:13.5px;cursor:pointer;flex-shrink:0')}>
            <i className="ph ph-shopping-cart-simple" style={s('font-size:17px')} /> Giỏ hàng
            {cc > 0 ? (
              <span style={s('position:absolute;top:-6px;right:-6px;background:var(--orange-600);color:#fff;font-size:11px;font-weight:700;min-width:20px;height:20px;border-radius:11px;display:flex;align-items:center;justify-content:center;padding:0 5px')}>{cc}</span>
            ) : null}
          </button>
          <AuthMenu variant="light" />
        </div>
        {/* Icon mobile: tìm kiếm + menu */}
        <div className="qt-hmobile" style={s('align-items:center;gap:8px;margin-left:auto')}>
          <button aria-label="Tìm kiếm" onClick={() => { setMobSearch((v) => !v); setMobMenu(false) }} style={s('display:flex;align-items:center;justify-content:center;width:40px;height:40px;border:none;background:var(--neutral-100);border-radius:50%;font-size:18px;cursor:pointer;color:var(--color-brand-primary)')}>
            <i className="ph ph-magnifying-glass" />
          </button>
          <button aria-label="Giỏ hàng" onClick={goCart} style={s('position:relative;display:flex;align-items:center;justify-content:center;width:40px;height:40px;border:none;background:var(--teal-50);border-radius:50%;font-size:18px;cursor:pointer;color:var(--teal-800)')}>
            <i className="ph ph-shopping-cart-simple" />
            {cc > 0 ? (<span style={s('position:absolute;top:-5px;right:-5px;background:var(--orange-600);color:#fff;font-size:10px;font-weight:700;min-width:18px;height:18px;border-radius:10px;display:flex;align-items:center;justify-content:center;padding:0 4px')}>{cc}</span>) : null}
          </button>
          <button aria-label="Menu" onClick={() => { setMobMenu((v) => !v); setMobSearch(false) }} style={s('display:flex;align-items:center;justify-content:center;width:40px;height:40px;border:none;background:var(--neutral-100);border-radius:50%;font-size:18px;cursor:pointer;color:var(--color-text-heading)')}>
            <i className="ph ph-list" />
          </button>
        </div>
      </div>

      {/* Ô tìm kiếm mở trên mobile */}
      {mobSearch ? (
        <div className="qt-msearch" style={s('padding:0 16px 12px;display:flex;gap:8px')}>
          <input
            value={sst.query}
            onChange={(e) => set({ query: e.target.value })}
            onKeyDown={onQueryKey}
            placeholder="Tìm thuốc, TPCN, thiết bị y tế..."
            style={s('flex:1;border:1.5px solid var(--color-border-subtle);background:var(--neutral-100);border-radius:var(--radius-md);outline:none;padding:11px 14px;font-size:14px;color:var(--color-text-heading)')}
          />
          <button onClick={() => { doSearch(); setMobSearch(false) }} style={s('border:none;background:var(--color-brand-primary);color:#fff;padding:0 18px;border-radius:var(--radius-pill);font-weight:600;font-size:14px;cursor:pointer')}>Tìm</button>
        </div>
      ) : null}

      {/* Menu 3 mục mở trên mobile */}
      {mobMenu ? (
        <div className="qt-mmenu" style={s('padding:0 16px 14px;display:flex;flex-direction:column;gap:8px')}>
          <button onClick={() => { openConsult(); setMobMenu(false) }} style={s('display:flex;align-items:center;gap:9px;border:none;background:var(--color-brand-accent);color:#fff;padding:12px 14px;border-radius:var(--radius-pill);font-weight:700;font-size:14px;cursor:pointer;text-align:left')}>
            <i className="ph-fill ph-stethoscope" /> Tư vấn bác sĩ
          </button>
          <button onClick={() => { openRx(); setMobMenu(false) }} style={s('display:flex;align-items:center;gap:9px;border:1.5px solid var(--color-brand-primary);background:var(--neutral-0);color:var(--color-brand-primary);padding:12px 14px;border-radius:var(--radius-pill);font-weight:600;font-size:14px;cursor:pointer;text-align:left')}>
            <i className="ph ph-clipboard-text" /> Đặt thuốc theo toa
          </button>
          <button onClick={() => { goCart(); setMobMenu(false) }} style={s('display:flex;align-items:center;gap:9px;background:var(--teal-50);color:var(--teal-800);border:none;padding:12px 14px;border-radius:var(--radius-pill);font-weight:600;font-size:14px;cursor:pointer;text-align:left')}>
            <i className="ph ph-shopping-cart-simple" /> Giỏ hàng{cc > 0 ? ` (${cc})` : ''}
          </button>
          <AuthMenu variant="light" onNavigate={() => setMobMenu(false)} />
        </div>
      ) : null}

      <nav style={s('border-top:1px solid var(--color-border-subtle)')}>
        <div className="qt-nav-inner" style={s('max-width:1180px;margin:0 auto;padding:0 24px;display:flex;gap:26px;width:100%;overflow-x:auto')}>
          {navLinks.map((n, i) => (
            <div key={i} onClick={n.onClick} style={{ ...n.style, whiteSpace: 'nowrap' }}>
              {n.label}
            </div>
          ))}
        </div>
      </nav>
      </header>
    </>
  )
}
