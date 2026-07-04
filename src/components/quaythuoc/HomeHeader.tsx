import AuthMenu from '@/components/AuthMenu'
import { s } from './data'
import type { StorefrontHub } from './use-storefront'

/**
 * Header storefront: thanh thông tin trên cùng, hàng logo + ô tìm kiếm +
 * hành động (desktop) hoặc icon tìm/giỏ/menu (mobile), và thanh điều hướng.
 */
export default function HomeHeader({ hub }: { hub: StorefrontHub }) {
  const { sst, cc, set, doSearch, onQueryKey, goHome, goCart, openRx, navLinks, mobSearch, setMobSearch, mobMenu, setMobMenu } = hub

  return (
    <>
      {/* Thanh thông tin trên cùng — cố ý KHÔNG sticky (chỉ header chính mới dính). */}
      <div style={s('background:#14532d;color:#cdeed8;font-size:12.5px')}>
        <div className="qt-topstrip" style={s('max-width:1180px;margin:0 auto;padding:7px 24px;display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%')}>
          <span>Tận tâm, tận lòng · Giao nhanh trong 2 giờ nội thành</span>
          <span style={s('display:flex;gap:18px')}>
            <span>Hotline: 1900 16 16</span>
            <span className="qt-hide-mobile-inline">Theo dõi đơn hàng</span>
          </span>
        </div>
      </div>
      <header style={s('position:sticky;top:0;z-index:30;background:#fff;box-shadow:0 1px 0 #e4ece7')}>
      <div className="qt-hrow" style={s('max-width:1180px;margin:0 auto;padding:14px 24px;display:flex;align-items:center;gap:22px;width:100%')}>
        <div onClick={goHome} style={s('display:flex;align-items:center;gap:11px;cursor:pointer;flex-shrink:0')}>
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
        </div>
        <div className="qt-search-full" style={s('flex:1;display:flex;align-items:center;background:#f1f6f3;border:1.5px solid #e0ebe4;border-radius:12px;padding:0 6px 0 14px;max-width:560px')}>
          <span style={s('color:#8a948e;font-size:16px')}>⌕</span>
          <input
            value={sst.query}
            onChange={(e) => set({ query: e.target.value })}
            onKeyDown={onQueryKey}
            placeholder="Tìm thuốc, thực phẩm chức năng, thiết bị y tế..."
            style={s('flex:1;border:none;background:transparent;outline:none;padding:11px 10px;font-size:14px;color:#1f2a24')}
          />
          <button onClick={doSearch} style={s('border:none;background:#2e9e5b;color:#fff;padding:8px 18px;border-radius:9px;font-weight:600;font-size:14px;cursor:pointer')}>
            Tìm
          </button>
        </div>
        <div className="qt-hactions" style={s('display:flex;align-items:center;gap:14px')}>
          <button onClick={openRx} style={s('display:flex;align-items:center;gap:7px;border:1.5px solid #2e9e5b;background:#fff;color:#1c7a45;padding:9px 14px;border-radius:11px;font-weight:600;font-size:13.5px;cursor:pointer;flex-shrink:0')}>
            📋 Đặt thuốc theo toa
          </button>
          <button onClick={goCart} style={s('position:relative;display:flex;align-items:center;gap:8px;background:#eaf6ef;border:none;color:#14532d;padding:9px 15px;border-radius:11px;font-weight:600;font-size:13.5px;cursor:pointer;flex-shrink:0')}>
            <span style={s('font-size:17px')}>🛒</span> Giỏ hàng
            {cc > 0 ? (
              <span style={s('position:absolute;top:-6px;right:-6px;background:#e8654e;color:#fff;font-size:11px;font-weight:700;min-width:20px;height:20px;border-radius:11px;display:flex;align-items:center;justify-content:center;padding:0 5px')}>{cc}</span>
            ) : null}
          </button>
          <AuthMenu variant="light" />
        </div>
        {/* Icon mobile: tìm kiếm + menu */}
        <div className="qt-hmobile" style={s('align-items:center;gap:8px;margin-left:auto')}>
          <button aria-label="Tìm kiếm" onClick={() => { setMobSearch((v) => !v); setMobMenu(false) }} style={s('display:flex;align-items:center;justify-content:center;width:40px;height:40px;border:1.5px solid #e0ebe4;background:#f1f6f3;border-radius:11px;font-size:18px;cursor:pointer;color:#1c7a45')}>⌕</button>
          <button aria-label="Giỏ hàng" onClick={goCart} style={s('position:relative;display:flex;align-items:center;justify-content:center;width:40px;height:40px;border:none;background:#eaf6ef;border-radius:11px;font-size:18px;cursor:pointer')}>🛒{cc > 0 ? (<span style={s('position:absolute;top:-5px;right:-5px;background:#e8654e;color:#fff;font-size:10px;font-weight:700;min-width:18px;height:18px;border-radius:10px;display:flex;align-items:center;justify-content:center;padding:0 4px')}>{cc}</span>) : null}</button>
          <button aria-label="Menu" onClick={() => { setMobMenu((v) => !v); setMobSearch(false) }} style={s('display:flex;align-items:center;justify-content:center;width:40px;height:40px;border:1.5px solid #e0ebe4;background:#f1f6f3;border-radius:11px;font-size:18px;cursor:pointer;color:#14532d')}>☰</button>
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
            style={s('flex:1;border:1.5px solid #e0ebe4;background:#f1f6f3;border-radius:11px;outline:none;padding:11px 14px;font-size:14px;color:#1f2a24')}
          />
          <button onClick={() => { doSearch(); setMobSearch(false) }} style={s('border:none;background:#2e9e5b;color:#fff;padding:0 18px;border-radius:11px;font-weight:600;font-size:14px;cursor:pointer')}>Tìm</button>
        </div>
      ) : null}

      {/* Menu 3 mục mở trên mobile */}
      {mobMenu ? (
        <div className="qt-mmenu" style={s('padding:0 16px 14px;display:flex;flex-direction:column;gap:8px')}>
          <button onClick={() => { openRx(); setMobMenu(false) }} style={s('display:flex;align-items:center;gap:9px;border:1.5px solid #2e9e5b;background:#fff;color:#1c7a45;padding:12px 14px;border-radius:11px;font-weight:600;font-size:14px;cursor:pointer;text-align:left')}>📋 Đặt thuốc theo toa</button>
          <button onClick={() => { goCart(); setMobMenu(false) }} style={s('display:flex;align-items:center;gap:9px;background:#eaf6ef;color:#14532d;border:none;padding:12px 14px;border-radius:11px;font-weight:600;font-size:14px;cursor:pointer;text-align:left')}>🛒 Giỏ hàng{cc > 0 ? ` (${cc})` : ''}</button>
          <AuthMenu variant="light" onNavigate={() => setMobMenu(false)} />
        </div>
      ) : null}

      <nav style={s('border-top:1px solid #eef3f0')}>
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
