import ProductCard from '../ProductCard'
import { s } from '../../data'
import type { StorefrontHub } from '../../use-storefront'

/** Trang kết quả tìm kiếm theo từ khóa (sst.query). */
export default function SearchScreen({ hub }: { hub: StorefrontHub }) {
  const { sst, searchResults } = hub

  return (
    <div style={s('max-width:1180px;margin:0 auto;padding:24px;width:100%')}>
      <h1 style={s('font:var(--text-display-md);color:var(--color-text-heading);margin:0 0 6px')}>Kết quả cho &quot;{sst.query}&quot;</h1>
      <div style={s('font-size:14px;color:var(--color-text-muted);margin-bottom:22px')}>{searchResults.length} sản phẩm</div>
      {searchResults.length > 0 ? (
        <div className="qt-grid2" style={s('display:grid;grid-template-columns:repeat(5,1fr);gap:16px')}>
          {searchResults.map((c, i) => (
            <ProductCard key={i} p={c.p} onView={c.onView} onAdd={c.onAdd} />
          ))}
        </div>
      ) : (
        <div style={s('background:var(--neutral-0);border:1px solid var(--color-border-subtle);border-radius:var(--radius-lg);padding:60px;text-align:center')}><i className="ph ph-magnifying-glass" style={s('font-size:40px;color:var(--color-text-muted);margin-bottom:10px;display:block')} /><div style={s('font-size:16px;font-weight:600;color:var(--color-text-body)')}>Không tìm thấy &quot;{sst.query}&quot;</div><div style={s('font-size:13.5px;color:var(--color-text-muted);margin-top:6px')}>Kiểm tra chính tả hoặc thử từ khóa khác</div></div>
      )}
    </div>
  )
}
