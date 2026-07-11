import ProductCard from '../ProductCard'
import { s } from '../../data'
import type { StorefrontHub } from '../../use-storefront'

/** Trang danh mục: breadcrumb, bộ lọc (drawer trên mobile), sắp xếp, lưới sản phẩm. */
export default function CategoryScreen({ hub }: { hub: StorefrontHub }) {
  const { catTitle, results, catTabs, useChips, sortBtns, goHome, mobileFilter, setMobileFilter } = hub

  return (
    <div style={s('max-width:1180px;margin:0 auto;padding:24px;width:100%')}>
      <div style={s('font-size:13px;color:var(--color-text-muted);margin-bottom:14px')}><span onClick={goHome} style={s('cursor:pointer;color:var(--color-text-link)')}>Trang chủ</span> / {catTitle}</div>
      <h1 style={s('font:var(--text-display-md);color:var(--color-text-heading);margin:0 0 6px')}>{catTitle}</h1>
      <div style={s('font-size:14px;color:var(--color-text-muted);margin-bottom:22px')}>{results.length} sản phẩm</div>
      {/* Nút mở bộ lọc (chỉ hiện trên mobile) */}
      <button
        className="qt-filter-btn"
        onClick={() => setMobileFilter(true)}
        style={s('align-items:center;gap:8px;background:var(--neutral-0);border:1.5px solid var(--color-brand-primary);color:var(--color-brand-primary);padding:10px 16px;border-radius:var(--radius-pill);font-weight:600;font-size:14px;cursor:pointer;margin-bottom:16px')}
      >
        <i className="ph ph-sliders-horizontal" /> Bộ lọc &amp; danh mục
      </button>
      {/* Overlay cho drawer bộ lọc */}
      {mobileFilter ? (
        <div className="qt-filter-overlay" onClick={() => setMobileFilter(false)} />
      ) : null}
      <div className="qt-catlayout" style={s('display:grid;grid-template-columns:240px 1fr;gap:26px;align-items:start')}>
        <aside className={`qt-filter${mobileFilter ? ' qt-filter-open' : ''}`} style={s('background:var(--neutral-0);border:1px solid var(--color-border-subtle);border-radius:var(--radius-lg);padding:20px;position:sticky;top:140px')}>
          <div className="qt-filter-close" style={s('display:none;align-items:center;justify-content:space-between;margin-bottom:14px')}>
            <h2 style={s('font:var(--text-heading-sm);color:var(--color-text-heading);margin:0')}>Bộ lọc</h2>
            <button onClick={() => setMobileFilter(false)} style={s('border:none;background:var(--neutral-100);width:32px;height:32px;border-radius:50%;font-size:15px;cursor:pointer;color:var(--color-text-muted);display:flex;align-items:center;justify-content:center')}><i className="ph ph-x" /></button>
          </div>
          <h2 style={s('font-size:14px;font-weight:700;color:var(--color-text-heading);margin:0 0 12px')}>Danh mục</h2>
          <div style={s('display:flex;flex-direction:column;gap:7px;margin-bottom:22px')}>
            {catTabs.map((t, i) => (
              <div key={i} onClick={t.onClick} style={t.style}>{t.label}</div>
            ))}
          </div>
          <h2 style={s('font-size:14px;font-weight:700;color:var(--color-text-heading);margin:0 0 12px')}>Lọc theo công dụng</h2>
          <div style={s('display:flex;flex-wrap:wrap;gap:8px')}>
            {useChips.map((u, i) => (
              <button key={i} onClick={u.onClick} style={u.style}>{u.label}</button>
            ))}
          </div>
        </aside>
        <div>
          <div style={s('display:flex;align-items:center;gap:10px;margin-bottom:18px;flex-wrap:wrap')}>
            <span style={s('font-size:13.5px;color:var(--color-text-muted);font-weight:600')}>Sắp xếp:</span>
            {sortBtns.map((so, i) => (
              <button key={i} onClick={so.onClick} style={so.style}>{so.label}</button>
            ))}
          </div>
          {results.length > 0 ? (
            <div className="qt-grid2" style={s('display:grid;grid-template-columns:repeat(4,1fr);gap:16px')}>
              {results.map((c, i) => (
                <ProductCard key={i} p={c.p} onView={c.onView} onAdd={c.onAdd} />
              ))}
            </div>
          ) : (
            <div style={s('background:var(--neutral-0);border:1px solid var(--color-border-subtle);border-radius:var(--radius-lg);padding:60px;text-align:center')}><i className="ph ph-magnifying-glass" style={s('font-size:40px;color:var(--color-text-muted);margin-bottom:10px;display:block')} /><div style={s('font-size:16px;font-weight:600;color:var(--color-text-body)')}>Không tìm thấy sản phẩm phù hợp</div><div style={s('font-size:13.5px;color:var(--color-text-muted);margin-top:6px')}>Hãy thử bỏ bớt bộ lọc</div></div>
          )}
        </div>
      </div>
    </div>
  )
}
