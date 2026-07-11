import { s } from '../../data'
import type { StorefrontHub } from '../../use-storefront'

/** Trang giỏ hàng: danh sách sản phẩm + tóm tắt đơn hàng. */
export default function CartScreen({ hub }: { hub: StorefrontHub }) {
  const { cc, cartView, subtotalText, shipText, totalText, freeshipHint, goCheckout, goHome } = hub

  return (
    <div style={s('max-width:1180px;margin:0 auto;padding:24px;width:100%')}>
      <h1 style={s('font:var(--text-display-md);color:var(--color-text-heading);margin:0 0 22px')}>Giỏ hàng</h1>
      {cc > 0 ? (
        <div className="qt-stack" style={s('display:grid;grid-template-columns:1fr 360px;gap:26px;align-items:start')}>
          <div style={s('display:flex;flex-direction:column;gap:14px')}>
            {cartView.map((c, i) => (
              <div key={i} className="qt-cartrow" style={s('background:var(--neutral-0);border:1px solid var(--color-border-subtle);border-radius:var(--radius-lg);padding:16px;display:flex;align-items:center;gap:16px')}>
                <div onClick={c.onView} style={{ ...s('width:80px;height:80px;border-radius:var(--radius-md);position:relative;flex-shrink:0;cursor:pointer;overflow:hidden'), background: c.tintBg }}>
                  {c.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img alt={c.name} src={c.image} style={s('width:100%;height:100%;object-fit:cover')} />
                  ) : (
                    <><div style={{ ...s('position:absolute;left:38%;top:24%;width:24%;height:52%;border-radius:5px'), background: c.tintFg }} /><div style={{ ...s('position:absolute;top:38%;left:24%;height:24%;width:52%;border-radius:5px'), background: c.tintFg }} /></>
                  )}
                </div>
                <div className="qt-cart-info" style={s('flex:1;min-width:0')}><div style={{ ...s('font-size:11px;font-weight:600'), color: c.tintFg }}>{c.catLabel}</div><div onClick={c.onView} style={s('font-size:15px;font-weight:600;color:var(--color-text-heading);cursor:pointer;margin:2px 0 4px')}>{c.name}</div><div style={{ ...s('font-size:15px;font-weight:700'), color: 'var(--color-brand-accent)' }}>{c.priceText}</div></div>
                <div style={s('display:flex;align-items:center;border:1.5px solid var(--color-border-default);border-radius:var(--radius-pill);overflow:hidden;flex-shrink:0')}><button onClick={c.dec} style={s('border:none;background:var(--neutral-100);width:34px;height:38px;font-size:18px;cursor:pointer;color:var(--color-brand-primary)')}>−</button><div style={s('width:40px;text-align:center;font-weight:700;font-size:15px')}>{c.qty}</div><button onClick={c.inc} style={s('border:none;background:var(--neutral-100);width:34px;height:38px;font-size:18px;cursor:pointer;color:var(--color-brand-primary)')}>+</button></div>
                <div className="qt-cart-total" style={s('width:110px;text-align:right;font-size:16px;font-weight:700;color:var(--color-text-heading)')}>{c.lineText}</div>
                <button onClick={c.remove} aria-label="Xóa" style={s('border:none;background:transparent;color:var(--neutral-400);font-size:18px;cursor:pointer;padding:6px;flex-shrink:0')}><i className="ph ph-x" /></button>
              </div>
            ))}
          </div>
          <div style={s('background:var(--neutral-0);border:1px solid var(--color-border-subtle);border-radius:var(--radius-lg);padding:24px;position:sticky;top:140px')}>
            <h2 style={s('font:var(--text-heading-sm);color:var(--color-text-heading);margin:0 0 18px')}>Tóm tắt đơn hàng</h2>
            <div style={s('display:flex;justify-content:space-between;font-size:14px;color:var(--color-text-body);margin-bottom:11px')}><span>Tạm tính</span><span style={s('font-weight:600')}>{subtotalText}</span></div>
            <div style={s('display:flex;justify-content:space-between;font-size:14px;color:var(--color-text-body);margin-bottom:11px')}><span>Phí giao hàng</span><span style={s('font-weight:600')}>{shipText}</span></div>
            {freeshipHint ? <div style={s('background:var(--teal-50);color:var(--teal-800);font-size:12.5px;padding:9px 12px;border-radius:var(--radius-sm);margin-bottom:11px')}>{freeshipHint}</div> : null}
            <div style={s('border-top:1px solid var(--color-border-subtle);margin:14px 0;padding-top:14px;display:flex;justify-content:space-between;align-items:center')}><span style={s('font-size:16px;font-weight:700;color:var(--color-text-heading)')}>Tổng cộng</span><span style={{ ...s('font-size:22px;font-weight:800'), color: 'var(--color-brand-accent)' }}>{totalText}</span></div>
            <button onClick={goCheckout} style={s('width:100%;background:var(--color-brand-primary);color:#fff;border:none;padding:15px;border-radius:var(--radius-pill);font-weight:700;font-size:15px;cursor:pointer;margin-top:8px')}>Tiến hành thanh toán</button>
            <button onClick={goHome} style={s('width:100%;background:transparent;color:var(--color-text-muted);border:none;padding:12px;font-size:13.5px;cursor:pointer;margin-top:4px')}>Tiếp tục mua sắm</button>
          </div>
        </div>
      ) : (
        <div style={s('background:var(--neutral-0);border:1px solid var(--color-border-subtle);border-radius:var(--radius-lg);padding:70px;text-align:center')}><i className="ph ph-shopping-cart-simple" style={s('font-size:44px;color:var(--color-text-muted);margin-bottom:14px;display:block')} /><div style={s('font-size:17px;font-weight:600;color:var(--color-text-body)')}>Giỏ hàng của bạn đang trống</div><button onClick={goHome} style={s('margin-top:18px;background:var(--color-brand-primary);color:#fff;border:none;padding:13px 28px;border-radius:var(--radius-pill);font-weight:700;font-size:14px;cursor:pointer')}>Mua sắm ngay</button></div>
      )}
    </div>
  )
}
