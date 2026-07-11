import { s } from '../../data'
import type { StorefrontHub } from '../../use-storefront'

const inputStyle = s('width:100%;border:1.5px solid var(--color-border-default);border-radius:var(--radius-md);padding:12px 14px;font-size:14px;outline:none;background:var(--neutral-0);color:var(--color-text-body)')
const labelStyle = s('font-size:13px;font-weight:600;color:var(--color-text-body);display:block;margin-bottom:6px')

/** Trang thanh toán: thông tin nhận hàng, phương thức, mã giảm giá, tóm tắt đơn. */
export default function CheckoutScreen({ hub }: { hub: StorefrontHub }) {
  const {
    sst, cc, cartView, setForm, payOptions, provinces,
    subtotalText, shipText, totalText, discountText, placeOrder, goCart,
    promoInput, appliedCode, promoError, promos, setPromoInput, applyPromo, removePromo,
  } = hub

  return (
    <div style={s('max-width:1180px;margin:0 auto;padding:24px;width:100%')}>
      <div style={s('font-size:13px;color:var(--color-text-muted);margin-bottom:14px')}><span onClick={goCart} style={s('cursor:pointer;color:var(--color-text-link)')}>Giỏ hàng</span> / Thanh toán</div>
      <h1 style={s('font:var(--text-display-md);color:var(--color-text-heading);margin:0 0 22px')}>Thanh toán</h1>
      <div className="qt-stack" style={s('display:grid;grid-template-columns:1fr 360px;gap:26px;align-items:start')}>
        <div style={s('background:var(--neutral-0);border:1px solid var(--color-border-subtle);border-radius:var(--radius-lg);padding:26px')}>
          <h2 style={s('font:var(--text-heading-sm);color:var(--color-text-heading);margin:0 0 18px')}>Thông tin nhận hàng</h2>
          <div style={s('display:flex;flex-direction:column;gap:14px')}>
            <div><label style={labelStyle}>Họ và tên *</label><input value={sst.form.name} onChange={(e) => setForm('name', e.target.value)} placeholder="Nguyễn Văn A" style={inputStyle} /></div>
            <div><label style={labelStyle}>Số điện thoại *</label><input value={sst.form.phone} onChange={(e) => setForm('phone', e.target.value)} placeholder="09xx xxx xxx" style={inputStyle} /></div>
            <div><label style={labelStyle}>Địa chỉ giao hàng *</label><input value={sst.form.address} onChange={(e) => setForm('address', e.target.value)} placeholder="Số nhà, đường, phường/xã, quận/huyện" style={inputStyle} /></div>
            <div>
              <label style={labelStyle}>Tỉnh/Thành phố *</label>
              <div style={s('position:relative')}>
                <select
                  value={sst.form.city}
                  onChange={(e) => setForm('city', e.target.value)}
                  style={{ ...inputStyle, appearance: 'none', WebkitAppearance: 'none', paddingRight: '38px', cursor: 'pointer', color: sst.form.city ? 'var(--color-text-body)' : 'var(--color-text-muted)' }}
                >
                  <option value="" disabled>Chọn tỉnh/thành phố</option>
                  {provinces.map((p) => <option key={p} value={p} style={{ color: 'var(--color-text-body)' }}>{p}</option>)}
                </select>
                <span style={s('position:absolute;right:14px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--neutral-500);display:flex')}><i className="ph ph-caret-down" style={s('font-size:14px')} /></span>
              </div>
            </div>
            <div><label style={labelStyle}>Ghi chú (tùy chọn)</label><input value={sst.form.note} onChange={(e) => setForm('note', e.target.value)} placeholder="Thời gian giao, lưu ý cho dược sĩ..." style={inputStyle} /></div>
          </div>
          <h2 style={s('font:var(--text-heading-sm);color:var(--color-text-heading);margin:26px 0 14px')}>Phương thức thanh toán</h2>
          <div style={s('display:flex;flex-direction:column;gap:10px')}>
            {payOptions.map((p, i) => (
              <div key={i} onClick={p.onClick} style={p.style}>
                <span style={s(`width:42px;height:42px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;flex-shrink:0;background:${p.active ? 'var(--teal-100)' : 'var(--neutral-100)'};color:var(--teal-700)`)}>
                  <i className={'ph ' + p.icon} style={s('font-size:22px')} />
                </span>
                <div style={s('flex:1')}>
                  <div style={s('font-size:14px;font-weight:600;color:var(--color-text-heading)')}>{p.label}</div>
                  <div style={s('font-size:12px;color:var(--color-text-muted)')}>{p.desc}</div>
                </div>
                <div style={{ ...s('width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0'), border: '2px solid ' + p.dot }}><div style={{ ...s('width:10px;height:10px;border-radius:50%'), background: p.dotFill }} /></div>
              </div>
            ))}
          </div>
        </div>

        <div style={s('background:var(--neutral-0);border:1px solid var(--color-border-subtle);border-radius:var(--radius-lg);padding:24px;position:sticky;top:140px')}>
          <h2 style={s('font:var(--text-heading-sm);color:var(--color-text-heading);margin:0 0 16px')}>Đơn hàng ({cc})</h2>
          <div style={s('display:flex;flex-direction:column;gap:10px;margin-bottom:16px;max-height:200px;overflow:auto')}>
            {cartView.map((c, i) => (
              <div key={i} style={s('display:flex;justify-content:space-between;gap:10px;font-size:13px')}><span style={s('color:var(--color-text-body)')}>{c.name} <span style={s('color:var(--color-text-muted)')}>×{c.qty}</span></span><span style={s('font-weight:600;color:var(--color-text-heading);white-space:nowrap')}>{c.lineText}</span></div>
            ))}
          </div>

          {/* Mã giảm giá */}
          <div style={s('border-top:1px solid var(--color-border-subtle);padding-top:14px;margin-bottom:14px')}>
            <div style={s('font-size:13px;font-weight:600;color:var(--color-text-heading);margin-bottom:8px;display:flex;align-items:center;gap:6px')}>
              <i className="ph ph-ticket" style={s('font-size:16px;color:var(--color-brand-accent)')} /> Mã giảm giá
            </div>
            {appliedCode ? (
              <div style={s('display:flex;align-items:center;justify-content:space-between;gap:10px;padding:9px 12px;border-radius:var(--radius-md);background:var(--color-success-bg);border:1px solid var(--green-600)')}>
                <span style={s('display:flex;align-items:center;gap:7px;font-size:12.5px;font-weight:700;color:var(--color-success-fg)')}>
                  <i className="ph ph-seal-check" style={s('font-size:16px')} /> {appliedCode} · {discountText}
                </span>
                <button onClick={removePromo} style={s('border:none;background:transparent;cursor:pointer;color:var(--color-success-fg);font-size:12.5px;font-weight:600;text-decoration:underline')}>Bỏ</button>
              </div>
            ) : (
              <>
                <div style={s('display:flex;gap:8px')}>
                  <input
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') applyPromo() }}
                    placeholder="Nhập mã giảm giá"
                    style={s('flex:1;min-width:0;border:1.5px solid var(--color-border-default);border-radius:var(--radius-md);padding:10px 12px;font-size:13px;outline:none;text-transform:uppercase;background:var(--neutral-0);color:var(--color-text-body)')}
                  />
                  <button onClick={applyPromo} style={s('flex-shrink:0;border:none;border-radius:var(--radius-md);background:var(--color-brand-accent);color:#fff;padding:0 16px;font-weight:700;font-size:13px;cursor:pointer')}>Áp dụng</button>
                </div>
                {promoError ? (
                  <div style={s('margin-top:7px;font-size:12px;color:var(--color-danger-fg)')}>{promoError}</div>
                ) : (
                  <div style={s('margin-top:8px;display:flex;flex-wrap:wrap;gap:6px')}>
                    {promos.map((p) => (
                      <button key={p.code} onClick={() => setPromoInput(p.code)} title={p.label} style={s('border:1px dashed var(--color-border-default);background:var(--cream-50);color:var(--color-text-body);border-radius:var(--radius-pill);padding:4px 10px;font-size:11.5px;font-weight:600;cursor:pointer')}>{p.code}</button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          <div style={s('border-top:1px solid var(--color-border-subtle);padding-top:14px;display:flex;justify-content:space-between;font-size:14px;color:var(--color-text-body);margin-bottom:10px')}><span>Tạm tính</span><span style={s('font-weight:600')}>{subtotalText}</span></div>
          {discountText ? (
            <div style={s('display:flex;justify-content:space-between;font-size:14px;color:var(--color-success-fg);margin-bottom:10px')}><span>Giảm giá</span><span style={s('font-weight:600')}>{discountText}</span></div>
          ) : null}
          <div style={s('display:flex;justify-content:space-between;font-size:14px;color:var(--color-text-body);margin-bottom:10px')}><span>Phí giao hàng</span><span style={s('font-weight:600')}>{shipText}</span></div>
          <div style={s('border-top:1px solid var(--color-border-subtle);margin-top:10px;padding-top:14px;display:flex;justify-content:space-between;align-items:center')}><span style={s('font-size:16px;font-weight:700;color:var(--color-text-heading)')}>Tổng cộng</span><span style={{ ...s('font-size:22px;font-weight:800'), color: 'var(--color-brand-accent)' }}>{totalText}</span></div>
          <button disabled={sst.placingOrder} onClick={() => void placeOrder()} style={{ ...s('width:100%;background:var(--color-brand-primary);color:#fff;border:none;padding:15px;border-radius:var(--radius-pill);font-weight:700;font-size:15px;margin-top:16px'), cursor: sst.placingOrder ? 'not-allowed' : 'pointer', opacity: sst.placingOrder ? 0.65 : 1 }}>{sst.placingOrder ? 'Đang đặt hàng…' : 'Đặt hàng · ' + totalText}</button>
        </div>
      </div>
    </div>
  )
}
