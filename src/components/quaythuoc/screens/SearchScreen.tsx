import ProductCard from '../ProductCard'
import { s } from '../data'
import type { StorefrontHub } from '../use-storefront'

/** Trang kết quả tìm kiếm theo từ khóa (sst.query). */
export default function SearchScreen({ hub }: { hub: StorefrontHub }) {
  const { sst, searchResults } = hub

  return (
    <div style={s('max-width:1180px;margin:0 auto;padding:24px;width:100%')}>
      <h1 style={s('font-size:24px;font-weight:800;color:#14532d;margin:0 0 6px')}>Kết quả cho &quot;{sst.query}&quot;</h1>
      <div style={s('font-size:14px;color:#8a948e;margin-bottom:22px')}>{searchResults.length} sản phẩm</div>
      {searchResults.length > 0 ? (
        <div className="qt-grid2" style={s('display:grid;grid-template-columns:repeat(5,1fr);gap:16px')}>
          {searchResults.map((c, i) => (
            <ProductCard key={i} p={c.p} onView={c.onView} onAdd={c.onAdd} />
          ))}
        </div>
      ) : (
        <div style={s('background:#fff;border:1px solid #e7efe9;border-radius:16px;padding:60px;text-align:center')}><div style={s('font-size:40px;margin-bottom:10px')}>🔍</div><div style={s('font-size:16px;font-weight:600;color:#4a564e')}>Không tìm thấy &quot;{sst.query}&quot;</div><div style={s('font-size:13.5px;color:#9aa8a0;margin-top:6px')}>Kiểm tra chính tả hoặc thử từ khóa khác</div></div>
      )}
    </div>
  )
}
