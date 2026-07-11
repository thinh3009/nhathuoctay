import NewsCard from '../NewsCard'
import { s } from '../../data'
import type { StorefrontHub } from '../../use-storefront'

/** Trang danh sách tin tức / cẩm nang sức khỏe. */
export default function NewsScreen({ hub }: { hub: StorefrontHub }) {
  const { newsList, goHome } = hub

  return (
    <div style={s('max-width:1180px;margin:0 auto;padding:24px;width:100%')}>
      <div style={s('font-size:13px;color:var(--color-text-muted);margin-bottom:14px')}><span onClick={goHome} style={s('cursor:pointer;color:var(--color-text-link)')}>Trang chủ</span> / Tin tức</div>
      <h1 style={s('font:var(--text-display-md);color:var(--color-text-heading);margin:0 0 6px')}>Tin tức sức khỏe</h1>
      <div style={s('font-size:14px;color:var(--color-text-muted);margin-bottom:24px')}>Kiến thức và lời khuyên từ đội ngũ dược sĩ Quầy thuốc 16</div>
      <div className="qt-grid2" style={s('display:grid;grid-template-columns:repeat(3,1fr);gap:18px')}>
        {newsList.map((a, i) => (
          <NewsCard key={i} article={a} />
        ))}
      </div>
    </div>
  )
}
