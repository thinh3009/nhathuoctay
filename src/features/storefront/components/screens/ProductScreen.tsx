import ProductCard from '../ProductCard'
import { s } from '../../data'
import type { StorefrontHub } from '../../use-storefront'

/** Trang chi tiết sản phẩm trong SPA: ảnh, thông tin, mua, đánh giá, liên quan. */
export default function ProductScreen({ hub }: { hub: StorefrontHub }) {
  const { d, sst, reviews, related, goHome } = hub

  return (
    <div style={s('max-width:1180px;margin:0 auto;padding:24px;width:100%')}>
      <div style={s('font-size:13px;color:var(--color-text-muted);margin-bottom:18px')}><span onClick={goHome} style={s('cursor:pointer;color:var(--color-text-link)')}>Trang chủ</span> / <span onClick={d.onCat} style={s('cursor:pointer;color:var(--color-text-link)')}>{d.catLabel}</span> / {d.name}</div>
      <div className="qt-stack" style={s('display:grid;grid-template-columns:440px 1fr;gap:36px;align-items:start')}>
        <div style={{ ...s('border-radius:var(--radius-xl);aspect-ratio:1 / 1;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden'), background: d.tintBg }}>
          {d.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img alt={d.name} src={d.image} style={s('width:100%;height:100%;object-fit:cover')} />
          ) : (
            <div style={s('width:34%;height:34%;position:relative;opacity:.92')}><div style={{ ...s('position:absolute;left:36%;top:0;width:28%;height:100%;border-radius:12px'), background: d.tintFg }} /><div style={{ ...s('position:absolute;top:36%;left:0;height:28%;width:100%;border-radius:12px'), background: d.tintFg }} /></div>
          )}
          {d.badge ? <div style={s('position:absolute;top:16px;left:16px;background:var(--color-brand-primary);color:#fff;font-size:13px;font-weight:700;padding:5px 14px;border-radius:var(--radius-pill)')}>{d.badge}</div> : null}
        </div>
        <div>
          <div style={{ ...s('font-size:13px;font-weight:600;margin-bottom:8px'), color: d.tintFg }}>{d.catLabel} · {d.brand}</div>
          <h1 style={s('font:var(--text-display-md);color:var(--color-text-heading);margin:0 0 12px')}>{d.name}</h1>
          <div style={s('display:flex;align-items:center;gap:8px;font-size:14px;color:var(--color-text-muted);margin-bottom:18px')}><span style={s('color:var(--color-brand-accent)')}>★★★★★</span><span style={s('color:var(--color-text-body);font-weight:600')}>{d.ratingText}</span><span>· {d.reviewsText}</span></div>
          <div style={s('display:flex;align-items:flex-end;gap:14px;background:var(--teal-50);border-radius:var(--radius-md);padding:18px 22px;margin-bottom:22px')}>
            <div style={{ ...s('font:var(--text-display-md)'), color: 'var(--color-brand-accent)' }}>{d.priceText}</div>
            {d.oldPriceText ? <div style={s('font-size:16px;color:var(--neutral-400);text-decoration:line-through;padding-bottom:5px')}>{d.oldPriceText}</div> : null}
            {d.discountText ? <div style={s('background:var(--orange-100);color:var(--orange-700);font-size:13px;font-weight:700;padding:3px 10px;border-radius:var(--radius-pill);margin-bottom:6px')}>{d.discountText}</div> : null}
          </div>
          <div style={s('display:flex;flex-direction:column;gap:9px;margin-bottom:24px')}>
            <div style={s('display:flex;gap:10px;font-size:14px;color:var(--color-text-body)')}><span style={s('color:var(--color-text-muted);min-width:90px')}>Quy cách</span><span style={s('font-weight:600;color:var(--color-text-heading)')}>{d.unit}</span></div>
            <div style={s('display:flex;gap:10px;font-size:14px;color:var(--color-text-body)')}><span style={s('color:var(--color-text-muted);min-width:90px')}>Công dụng</span><span style={s('font-weight:600;color:var(--color-text-heading)')}>{d.usesText}</span></div>
            <div style={s('display:flex;gap:10px;font-size:14px;color:var(--color-text-body)')}><span style={s('color:var(--color-text-muted);min-width:90px')}>Xuất xứ</span><span style={s('font-weight:600;color:var(--color-text-heading)')}>Chính hãng, có hóa đơn</span></div>
          </div>
          <div className="qt-buyrow" style={s('display:flex;align-items:center;gap:16px')}>
            <div style={s('display:flex;align-items:center;border:1.5px solid var(--color-border-default);border-radius:var(--radius-pill);overflow:hidden')}>
              <button onClick={d.dec} style={s('border:none;background:var(--neutral-100);width:42px;height:46px;font-size:20px;cursor:pointer;color:var(--color-brand-primary)')}>−</button>
              <div style={s('width:48px;text-align:center;font-size:16px;font-weight:700')}>{sst.detailQty}</div>
              <button onClick={d.inc} style={s('border:none;background:var(--neutral-100);width:42px;height:46px;font-size:20px;cursor:pointer;color:var(--color-brand-primary)')}>+</button>
            </div>
            <button onClick={d.add} style={s('flex:1;background:var(--neutral-0);color:var(--color-brand-primary);border:1.5px solid var(--color-brand-primary);padding:14px;border-radius:var(--radius-pill);font-weight:700;font-size:15px;cursor:pointer')}>Thêm vào giỏ</button>
            <button onClick={d.buyNow} style={s('flex:1;background:var(--color-brand-primary);color:#fff;border:none;padding:14px;border-radius:var(--radius-pill);font-weight:700;font-size:15px;cursor:pointer')}>Mua ngay</button>
          </div>
          <div style={s('margin-top:24px;padding:18px 20px;background:var(--teal-50);border-radius:var(--radius-md);font-size:14px;color:var(--color-text-body);line-height:1.65')}>{d.desc}</div>
        </div>
      </div>

      {/* reviews */}
      <div style={s('margin-top:44px')}>
        <h2 style={s('font:var(--text-heading-lg);color:var(--color-text-heading);margin:0 0 18px')}>Đánh giá sản phẩm</h2>
        <div className="qt-stack" style={s('display:grid;grid-template-columns:240px 1fr;gap:26px;align-items:start')}>
          <div style={s('background:var(--neutral-0);border:1px solid var(--color-border-subtle);border-radius:var(--radius-lg);padding:24px;text-align:center')}>
            <div style={{ ...s('font:var(--text-display-md)'), color: 'var(--color-brand-accent)' }}>{d.ratingText}</div>
            <div style={s('color:var(--color-brand-accent);font-size:18px;margin:6px 0')}>★★★★★</div>
            <div style={s('font-size:13px;color:var(--color-text-muted)')}>{d.reviewsText}</div>
          </div>
          <div style={s('display:flex;flex-direction:column;gap:14px')}>
            {reviews.map((r, i) => (
              <div key={i} style={s('background:var(--neutral-0);border:1px solid var(--color-border-subtle);border-radius:var(--radius-md);padding:18px')}>
                <div style={s('display:flex;align-items:center;gap:11px;margin-bottom:8px')}><div style={s('width:36px;height:36px;border-radius:50%;background:var(--teal-50);display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--color-brand-primary);font-size:14px')}>{r.initial}</div><div><div style={s('font-size:14px;font-weight:700;color:var(--color-text-heading)')}>{r.name}</div><div style={s('font-size:11.5px;color:var(--color-text-muted)')}>{r.date}</div></div><div style={s('margin-left:auto;color:var(--color-brand-accent);font-size:13px')}>{r.stars}</div></div>
                <div style={s('font-size:13.5px;color:var(--color-text-body);line-height:1.6')}>{r.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* related */}
      <div style={s('margin-top:44px')}>
        <h2 style={s('font:var(--text-heading-lg);color:var(--color-text-heading);margin:0 0 18px')}>Sản phẩm liên quan</h2>
        <div className="qt-slider" style={s('display:grid;grid-template-columns:repeat(5,1fr);gap:16px')}>
          {related.map((c, i) => (
            <ProductCard key={i} p={c.p} onView={c.onView} onAdd={c.onAdd} />
          ))}
        </div>
      </div>
    </div>
  )
}
