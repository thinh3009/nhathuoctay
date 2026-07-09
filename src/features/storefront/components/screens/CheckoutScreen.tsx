import { s } from '../../data'
import type { StorefrontHub } from '../../use-storefront'

/** Trang thanh toán: thông tin nhận hàng, phương thức, tóm tắt đơn. */
export default function CheckoutScreen({ hub }: { hub: StorefrontHub }) {
  const { sst, cc, cartView, setForm, payOptions, subtotalText, shipText, totalText, placeOrder, goCart } = hub

  return (
    <div style={s('max-width:1180px;margin:0 auto;padding:24px;width:100%')}>
      <div style={s('font-size:13px;color:#8a948e;margin-bottom:14px')}><span onClick={goCart} style={s('cursor:pointer;color:#2e9e5b')}>Giỏ hàng</span> / Thanh toán</div>
      <h1 style={s('font-size:28px;font-weight:800;color:#14532d;margin:0 0 22px')}>Thanh toán</h1>
      <div className="qt-stack" style={s('display:grid;grid-template-columns:1fr 360px;gap:26px;align-items:start')}>
        <div style={s('background:#fff;border:1px solid #e7efe9;border-radius:16px;padding:26px')}>
          <div style={s('font-size:16px;font-weight:700;color:#14532d;margin-bottom:18px')}>Thông tin nhận hàng</div>
          <div style={s('display:flex;flex-direction:column;gap:14px')}>
            <div><label style={s('font-size:13px;font-weight:600;color:#4a564e;display:block;margin-bottom:6px')}>Họ và tên *</label><input value={sst.form.name} onChange={(e) => setForm('name', e.target.value)} placeholder="Nguyễn Văn A" style={s('width:100%;border:1.5px solid #e0ebe4;border-radius:11px;padding:12px 14px;font-size:14px;outline:none')} /></div>
            <div><label style={s('font-size:13px;font-weight:600;color:#4a564e;display:block;margin-bottom:6px')}>Số điện thoại *</label><input value={sst.form.phone} onChange={(e) => setForm('phone', e.target.value)} placeholder="09xx xxx xxx" style={s('width:100%;border:1.5px solid #e0ebe4;border-radius:11px;padding:12px 14px;font-size:14px;outline:none')} /></div>
            <div><label style={s('font-size:13px;font-weight:600;color:#4a564e;display:block;margin-bottom:6px')}>Địa chỉ giao hàng *</label><input value={sst.form.address} onChange={(e) => setForm('address', e.target.value)} placeholder="Số nhà, đường, phường/xã, quận/huyện" style={s('width:100%;border:1.5px solid #e0ebe4;border-radius:11px;padding:12px 14px;font-size:14px;outline:none')} /></div>
            <div><label style={s('font-size:13px;font-weight:600;color:#4a564e;display:block;margin-bottom:6px')}>Tỉnh/Thành phố *</label><input value={sst.form.city} onChange={(e) => setForm('city', e.target.value)} placeholder="TP. Hồ Chí Minh" style={s('width:100%;border:1.5px solid #e0ebe4;border-radius:11px;padding:12px 14px;font-size:14px;outline:none')} /></div>
            <div><label style={s('font-size:13px;font-weight:600;color:#4a564e;display:block;margin-bottom:6px')}>Ghi chú (tùy chọn)</label><input value={sst.form.note} onChange={(e) => setForm('note', e.target.value)} placeholder="Thời gian giao, lưu ý cho dược sĩ..." style={s('width:100%;border:1.5px solid #e0ebe4;border-radius:11px;padding:12px 14px;font-size:14px;outline:none')} /></div>
          </div>
          <div style={s('font-size:16px;font-weight:700;color:#14532d;margin:26px 0 14px')}>Phương thức thanh toán</div>
          <div style={s('display:flex;flex-direction:column;gap:10px')}>
            {payOptions.map((p, i) => (
              <div key={i} onClick={p.onClick} style={p.style}><div style={{ ...s('width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center'), border: '2px solid ' + p.dot }}><div style={{ ...s('width:10px;height:10px;border-radius:50%'), background: p.dotFill }} /></div><div><div style={s('font-size:14px;font-weight:600;color:#2a352e')}>{p.label}</div><div style={s('font-size:12px;color:#8a948e')}>{p.desc}</div></div></div>
            ))}
          </div>
        </div>
        <div style={s('background:#fff;border:1px solid #e7efe9;border-radius:16px;padding:24px;position:sticky;top:140px')}>
          <div style={s('font-size:17px;font-weight:700;color:#14532d;margin-bottom:16px')}>Đơn hàng ({cc})</div>
          <div style={s('display:flex;flex-direction:column;gap:10px;margin-bottom:16px;max-height:200px;overflow:auto')}>
            {cartView.map((c, i) => (
              <div key={i} style={s('display:flex;justify-content:space-between;gap:10px;font-size:13px')}><span style={s('color:#4a564e')}>{c.name} <span style={s('color:#9aa8a0')}>×{c.qty}</span></span><span style={s('font-weight:600;color:#14532d;white-space:nowrap')}>{c.lineText}</span></div>
            ))}
          </div>
          <div style={s('border-top:1px solid #eef3f0;padding-top:14px;display:flex;justify-content:space-between;font-size:14px;color:#4a564e;margin-bottom:10px')}><span>Tạm tính</span><span style={s('font-weight:600')}>{subtotalText}</span></div>
          <div style={s('display:flex;justify-content:space-between;font-size:14px;color:#4a564e;margin-bottom:10px')}><span>Phí giao hàng</span><span style={s('font-weight:600')}>{shipText}</span></div>
          <div style={s('border-top:1px solid #eef3f0;margin-top:10px;padding-top:14px;display:flex;justify-content:space-between;align-items:center')}><span style={s('font-size:16px;font-weight:700;color:#14532d')}>Tổng cộng</span><span style={s('font-size:22px;font-weight:800;color:#1c7a45')}>{totalText}</span></div>
          <button disabled={sst.placingOrder} onClick={() => void placeOrder()} style={{ ...s('width:100%;background:#2e9e5b;color:#fff;border:none;padding:15px;border-radius:12px;font-weight:700;font-size:15px;margin-top:16px'), cursor: sst.placingOrder ? 'not-allowed' : 'pointer', opacity: sst.placingOrder ? 0.65 : 1 }}>{sst.placingOrder ? 'Đang đặt hàng…' : 'Đặt hàng'}</button>
        </div>
      </div>
    </div>
  )
}
