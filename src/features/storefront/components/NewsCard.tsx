import { s } from '../data'
import type { StorefrontHub } from '../use-storefront'

/** View-model một thẻ tin tức (lấy từ hub.newsHome / hub.newsList). */
type NewsCardVM = StorefrontHub['newsList'][number]

/** Thẻ bài viết dùng chung cho section tin tức trang chủ và trang danh sách tin. */
export default function NewsCard({ article }: { article: NewsCardVM }) {
  return (
    <div onClick={article.onClick} className="qt-card" style={s('background:var(--neutral-0);border:1px solid var(--color-border-subtle);border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);overflow:hidden;cursor:pointer;display:flex;flex-direction:column')}>
      <div style={{ ...s('aspect-ratio:16 / 9;position:relative;display:flex;align-items:center;justify-content:center'), background: article.tintBg }}>
        <div style={{ ...s('font:600 11px ui-monospace,monospace'), color: article.tintFg }}>ảnh bài viết</div>
        <div style={{ ...s('position:absolute;top:12px;left:12px;background:var(--neutral-0);font-size:11px;font-weight:700;padding:4px 11px;border-radius:var(--radius-pill)'), color: article.tintFg }}>{article.tag}</div>
      </div>
      <div style={s('padding:18px;display:flex;flex-direction:column;gap:8px;flex:1')}>
        <div style={s('font:var(--text-heading-sm);color:var(--color-text-heading);line-height:1.35')}>{article.title}</div>
        <div style={s('font-size:13px;color:var(--color-text-body);line-height:1.55;flex:1')}>{article.excerpt}</div>
        <div style={s('font-size:12px;color:var(--color-text-muted);margin-top:4px')}>{article.date} · Dược sĩ Quầy thuốc 16</div>
      </div>
    </div>
  )
}
