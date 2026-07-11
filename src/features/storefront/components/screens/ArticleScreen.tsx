import { s } from '../../data'
import type { StorefrontHub } from '../../use-storefront'

/** Trang bài viết trong SPA (nội dung demo dựng từ article view-model). */
export default function ArticleScreen({ hub }: { hub: StorefrontHub }) {
  const { article, goHome, goNews } = hub

  return (
    <div style={s('max-width:760px;margin:0 auto;padding:24px;width:100%')}>
      <div style={s('font-size:13px;color:var(--color-text-muted);margin-bottom:16px')}><span onClick={goHome} style={s('cursor:pointer;color:var(--color-text-link)')}>Trang chủ</span> / <span onClick={goNews} style={s('cursor:pointer;color:var(--color-text-link)')}>Tin tức</span> / {article.tag}</div>
      <div style={s('display:inline-block;background:var(--teal-50);color:var(--teal-800);font-size:12px;font-weight:600;padding:5px 13px;border-radius:var(--radius-pill);margin-bottom:14px')}>{article.tag}</div>
      <h1 style={s('font:var(--text-display-md);color:var(--color-text-heading);margin:0 0 12px')}>{article.title}</h1>
      <div style={s('font-size:13px;color:var(--color-text-muted);margin-bottom:22px')}>{article.date} · Dược sĩ Quầy thuốc 16</div>
      <div style={{ ...s('aspect-ratio:16 / 9;border-radius:var(--radius-lg);display:flex;align-items:center;justify-content:center;margin-bottom:26px;font:600 12px ui-monospace,monospace'), background: article.tintBg, color: article.tintFg }}>ảnh minh họa bài viết</div>
      <div style={s('display:flex;flex-direction:column;gap:18px')}>
        {article.body.map((para, i) => (
          <p key={i} style={s('font-size:16px;line-height:1.75;color:var(--color-text-body);margin:0')}>{para}</p>
        ))}
      </div>
      <div style={s('margin-top:30px')}><button onClick={goNews} style={s('background:var(--teal-50);color:var(--teal-800);border:none;padding:12px 24px;border-radius:var(--radius-pill);font-weight:600;font-size:14px;cursor:pointer')}>← Quay lại tin tức</button></div>
    </div>
  )
}
