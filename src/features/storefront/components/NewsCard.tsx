import { s } from '../data'
import type { StorefrontHub } from '../use-storefront'

/** View-model một thẻ tin tức (lấy từ hub.newsHome / hub.newsList). */
type NewsCardVM = StorefrontHub['newsList'][number]

/** Thẻ bài viết dùng chung cho section tin tức trang chủ và trang danh sách tin. */
export default function NewsCard({ article }: { article: NewsCardVM }) {
  return (
    <div onClick={article.onClick} className="qt-card" style={s('background:#fff;border:1px solid #e7efe9;border-radius:16px;overflow:hidden;cursor:pointer;display:flex;flex-direction:column')}>
      <div style={{ ...s('aspect-ratio:16 / 9;position:relative;display:flex;align-items:center;justify-content:center'), background: article.tintBg }}>
        <div style={{ ...s('font:600 11px ui-monospace,monospace'), color: article.tintFg }}>ảnh bài viết</div>
        <div style={{ ...s('position:absolute;top:12px;left:12px;background:#fff;font-size:11px;font-weight:600;padding:4px 11px;border-radius:20px'), color: article.tintFg }}>{article.tag}</div>
      </div>
      <div style={s('padding:18px;display:flex;flex-direction:column;gap:8px;flex:1')}>
        <div style={s('font-size:16px;font-weight:700;color:#14532d;line-height:1.35')}>{article.title}</div>
        <div style={s('font-size:13px;color:#6b7770;line-height:1.55;flex:1')}>{article.excerpt}</div>
        <div style={s('font-size:12px;color:#9aa8a0;margin-top:4px')}>{article.date} · Dược sĩ Quầy thuốc 16</div>
      </div>
    </div>
  )
}
