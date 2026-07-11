import { s } from '../../data'
import type { StorefrontHub } from '../../use-storefront'

/** Trang xác nhận đặt hàng thành công (hiển thị mã đơn). */
export default function DoneScreen({ hub }: { hub: StorefrontHub }) {
  const { sst, goHome } = hub

  return (
    <div style={s('max-width:560px;margin:60px auto;padding:24px;width:100%;text-align:center')}>
      <div style={s('width:88px;height:88px;background:var(--teal-50);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 22px;color:var(--color-brand-primary)')}><i className="ph-fill ph-check-circle" style={s('font-size:44px')} /></div>
      <h1 style={s('font:var(--text-display-md);color:var(--color-text-heading);margin:0 0 10px')}>Đặt hàng thành công!</h1>
      <p style={s('font-size:15px;color:var(--color-text-body);margin:0 0 8px;line-height:1.6')}>Cảm ơn bạn đã tin tưởng Quầy thuốc 16. Dược sĩ sẽ gọi xác nhận trong ít phút.</p>
      <div style={s('display:inline-block;background:var(--teal-50);border:1px solid var(--teal-100);border-radius:var(--radius-md);padding:14px 26px;margin:14px 0 26px')}><span style={s('font-size:13px;color:var(--color-text-muted)')}>Mã đơn hàng: </span><span style={{ ...s('font-size:16px;font-weight:800'), color: 'var(--color-brand-accent)' }}>{sst.ordered}</span></div>
      <div><button onClick={goHome} style={s('background:var(--color-brand-primary);color:#fff;border:none;padding:14px 30px;border-radius:var(--radius-pill);font-weight:700;font-size:15px;cursor:pointer')}>Tiếp tục mua sắm</button></div>
    </div>
  )
}
