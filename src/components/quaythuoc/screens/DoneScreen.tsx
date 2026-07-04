import { s } from '../data'
import type { StorefrontHub } from '../use-storefront'

/** Trang xác nhận đặt hàng thành công (hiển thị mã đơn). */
export default function DoneScreen({ hub }: { hub: StorefrontHub }) {
  const { sst, goHome } = hub

  return (
    <div style={s('max-width:560px;margin:60px auto;padding:24px;width:100%;text-align:center')}>
      <div style={s('width:88px;height:88px;background:#eaf7ef;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 22px;font-size:42px')}>✓</div>
      <h1 style={s('font-size:28px;font-weight:800;color:#14532d;margin:0 0 10px')}>Đặt hàng thành công!</h1>
      <p style={s('font-size:15px;color:#4a564e;margin:0 0 8px;line-height:1.6')}>Cảm ơn bạn đã tin tưởng Quầy thuốc 16. Dược sĩ sẽ gọi xác nhận trong ít phút.</p>
      <div style={s('display:inline-block;background:#f6faf7;border:1px solid #e7efe9;border-radius:12px;padding:14px 26px;margin:14px 0 26px')}><span style={s('font-size:13px;color:#8a948e')}>Mã đơn hàng: </span><span style={s('font-size:16px;font-weight:800;color:#1c7a45')}>{sst.ordered}</span></div>
      <div><button onClick={goHome} style={s('background:#2e9e5b;color:#fff;border:none;padding:14px 30px;border-radius:12px;font-weight:700;font-size:15px;cursor:pointer')}>Tiếp tục mua sắm</button></div>
    </div>
  )
}
