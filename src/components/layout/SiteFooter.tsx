import Link from 'next/link'
import Logo from '@/components/ui/Logo'
import { s } from '@/features/storefront/data'

const social = ['ph-facebook-logo', 'ph-tiktok-logo', 'ph-instagram-logo', 'ph-youtube-logo']

// Footer dùng chung, khớp giao diện footer trang chủ (Quầy thuốc 16).
// Dùng điều hướng route thật (Link) thay cho SPA state.
export default function SiteFooter() {
  return (
    <footer style={s('background:var(--color-footer-bg);color:rgba(255,255,255,0.85);margin-top:54px')}>
      <div style={s('max-width:1180px;margin:0 auto;padding:42px 24px 30px;width:100%;display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:32px')} className="qt-footer-grid">
        <div>
          <div style={s('margin-bottom:14px')}>
            <span style={s('display:inline-flex;padding:10px 14px;border-radius:var(--radius-md);background:rgba(255,255,255,0.94)')}>
              <Logo height={46} />
            </span>
          </div>
          <div style={s('font-size:13.5px;line-height:1.7')}>
            Tận tâm, tận lòng.<br />Hệ thống nhà thuốc đạt chuẩn GPP, cam kết thuốc chính hãng, tư vấn bởi dược sĩ.
          </div>
        </div>
        <div>
          <div style={s('font:var(--text-heading-sm);color:#fff;margin-bottom:14px')}>Danh mục</div>
          <div style={s('display:flex;flex-direction:column;gap:9px;font-size:13.5px')}>
            <Link href="/category/thuoc" style={s('color:rgba(255,255,255,0.85)')}>Thuốc</Link>
            <Link href="/category/thuc-pham-chuc-nang" style={s('color:rgba(255,255,255,0.85)')}>Thực phẩm chức năng</Link>
            <Link href="/category/thiet-bi-y-te" style={s('color:rgba(255,255,255,0.85)')}>Thiết bị y tế</Link>
            <Link href="/category/cham-soc-da" style={s('color:rgba(255,255,255,0.85)')}>Chăm sóc da</Link>
          </div>
        </div>
        <div>
          <div style={s('font:var(--text-heading-sm);color:#fff;margin-bottom:14px')}>Hỗ trợ</div>
          <div style={s('display:flex;flex-direction:column;gap:9px;font-size:13.5px')}>
            <Link href="/bai-viet" style={s('color:rgba(255,255,255,0.85)')}>Tin tức &amp; cẩm nang</Link>
            <Link href="/?rx=1" style={s('color:rgba(255,255,255,0.85)')}>Đặt thuốc theo toa</Link>
            <span>Chính sách đổi trả</span>
            <span>Hướng dẫn mua hàng</span>
          </div>
        </div>
        <div>
          <div style={s('font:var(--text-heading-sm);color:#fff;margin-bottom:14px')}>Liên hệ</div>
          <div style={s('display:flex;flex-direction:column;gap:9px;font-size:13.5px')}>
            <span>Hotline: 1900 16 16</span>
            <span>cskh@quaythuoc16.vn</span>
            <span>16 Đường Sức Khỏe, Q.1, TP.HCM</span>
          </div>
        </div>
      </div>
      <div style={s('max-width:1180px;margin:0 auto;padding:0 24px 28px;display:flex;gap:12px')}>
        {social.map((icon) => (
          <span key={icon} style={s('width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.14);display:flex;align-items:center;justify-content:center')}>
            <i className={'ph-fill ' + icon} style={s('font-size:17px;color:#fff')} />
          </span>
        ))}
      </div>
      <div style={s('border-top:1px solid rgba(255,255,255,.15)')}>
        <div style={s('max-width:1180px;margin:0 auto;padding:16px 24px;font-size:12.5px;color:rgba(255,255,255,0.7)')}>
          © 2026 Quầy thuốc 16. Tận tâm, tận lòng.
        </div>
      </div>
    </footer>
  )
}
