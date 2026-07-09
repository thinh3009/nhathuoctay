import { s } from '../../data'
import type { StorefrontHub } from '../../use-storefront'

/** Trang giỏ hàng: danh sách sản phẩm + tóm tắt đơn hàng. */
export default function CartScreen({ hub }: { hub: StorefrontHub }) {
  const { cc, cartView, subtotalText, shipText, totalText, freeshipHint, goCheckout, goHome } = hub

  return (
    <div style={s('max-width:1180px;margin:0 auto;padding:24px;width:100%')}>
      <h1 style={s('font-size:28px;font-weight:800;color:#14532d;margin:0 0 22px')}>Giỏ hàng</h1>
      {cc > 0 ? (
        <div className="qt-stack" style={s('display:grid;grid-template-columns:1fr 360px;gap:26px;align-items:start')}>
          <div style={s('display:flex;flex-direction:column;gap:14px')}>
            {cartView.map((c, i) => (
              <div key={i} className="qt-cartrow" style={s('background:#fff;border:1px solid #e7efe9;border-radius:16px;padding:16px;display:flex;align-items:center;gap:16px')}>
                <div onClick={c.onView} style={{ ...s('width:80px;height:80px;border-radius:12px;position:relative;flex-shrink:0;cursor:pointer;overflow:hidden'), background: c.tintBg }}>
                  {c.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img alt={c.name} src={c.image} style={s('width:100%;height:100%;object-fit:cover')} />
                  ) : (
                    <><div style={{ ...s('position:absolute;left:38%;top:24%;width:24%;height:52%;border-radius:5px'), background: c.tintFg }} /><div style={{ ...s('position:absolute;top:38%;left:24%;height:24%;width:52%;border-radius:5px'), background: c.tintFg }} /></>
                  )}
                </div>
                <div className="qt-cart-info" style={s('flex:1;min-width:0')}><div style={{ ...s('font-size:11px;font-weight:600'), color: c.tintFg }}>{c.catLabel}</div><div onClick={c.onView} style={s('font-size:15px;font-weight:600;color:#1f2a24;cursor:pointer;margin:2px 0 4px')}>{c.name}</div><div style={s('font-size:15px;font-weight:700;color:#1c7a45')}>{c.priceText}</div></div>
                <div style={s('display:flex;align-items:center;border:1.5px solid #e0ebe4;border-radius:10px;overflow:hidden;flex-shrink:0')}><button onClick={c.dec} style={s('border:none;background:#f1f6f3;width:34px;height:38px;font-size:18px;cursor:pointer;color:#1c7a45')}>−</button><div style={s('width:40px;text-align:center;font-weight:700;font-size:15px')}>{c.qty}</div><button onClick={c.inc} style={s('border:none;background:#f1f6f3;width:34px;height:38px;font-size:18px;cursor:pointer;color:#1c7a45')}>+</button></div>
                <div className="qt-cart-total" style={s('width:110px;text-align:right;font-size:16px;font-weight:700;color:#14532d')}>{c.lineText}</div>
                <button onClick={c.remove} style={s('border:none;background:transparent;color:#c0c9c3;font-size:20px;cursor:pointer;padding:6px;flex-shrink:0')}>✕</button>
              </div>
            ))}
          </div>
          <div style={s('background:#fff;border:1px solid #e7efe9;border-radius:16px;padding:24px;position:sticky;top:140px')}>
            <h2 style={s('font-size:17px;font-weight:700;color:#14532d;margin:0 0 18px')}>Tóm tắt đơn hàng</h2>
            <div style={s('display:flex;justify-content:space-between;font-size:14px;color:#4a564e;margin-bottom:11px')}><span>Tạm tính</span><span style={s('font-weight:600')}>{subtotalText}</span></div>
            <div style={s('display:flex;justify-content:space-between;font-size:14px;color:#4a564e;margin-bottom:11px')}><span>Phí giao hàng</span><span style={s('font-weight:600')}>{shipText}</span></div>
            {freeshipHint ? <div style={s('background:#eaf7ef;color:#1c7a45;font-size:12.5px;padding:9px 12px;border-radius:9px;margin-bottom:11px')}>{freeshipHint}</div> : null}
            <div style={s('border-top:1px solid #eef3f0;margin:14px 0;padding-top:14px;display:flex;justify-content:space-between;align-items:center')}><span style={s('font-size:16px;font-weight:700;color:#14532d')}>Tổng cộng</span><span style={s('font-size:22px;font-weight:800;color:#1c7a45')}>{totalText}</span></div>
            <button onClick={goCheckout} style={s('width:100%;background:#2e9e5b;color:#fff;border:none;padding:15px;border-radius:12px;font-weight:700;font-size:15px;cursor:pointer;margin-top:8px')}>Tiến hành thanh toán</button>
            <button onClick={goHome} style={s('width:100%;background:transparent;color:#8a948e;border:none;padding:12px;font-size:13.5px;cursor:pointer;margin-top:4px')}>Tiếp tục mua sắm</button>
          </div>
        </div>
      ) : (
        <div style={s('background:#fff;border:1px solid #e7efe9;border-radius:16px;padding:70px;text-align:center')}><div style={s('font-size:48px;margin-bottom:14px')}>🛒</div><div style={s('font-size:17px;font-weight:600;color:#4a564e')}>Giỏ hàng của bạn đang trống</div><button onClick={goHome} style={s('margin-top:18px;background:#2e9e5b;color:#fff;border:none;padding:13px 28px;border-radius:11px;font-weight:700;font-size:14px;cursor:pointer')}>Mua sắm ngay</button></div>
      )}
    </div>
  )
}
