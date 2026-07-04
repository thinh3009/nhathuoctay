import { s } from './data'
import type { StorefrontHub } from './use-storefront'

/**
 * Footer storefront (bản trong SPA QuayThuoc16). Lưới 4 cột trên desktop,
 * gập còn 2 cột trên mobile qua class `.qt-footer-grid` (globals.css).
 */
export default function HomeFooter({ hub }: { hub: StorefrontHub }) {
  const { goCatScreen, openRx } = hub
  return (
    <footer style={s('background:#14532d;color:#a9d6ba;margin-top:54px')}>
      <div className="qt-footer-grid" style={s('max-width:1180px;margin:0 auto;padding:42px 24px 30px;width:100%;display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:32px')}>
        <div>
          <div style={s('display:flex;align-items:center;gap:10px;margin-bottom:14px')}><div style={s('width:36px;height:36px;background:#2e9e5b;border-radius:10px;position:relative')}><div style={s('position:absolute;left:38%;top:22%;width:24%;height:56%;background:#fff;border-radius:3px')} /><div style={s('position:absolute;top:38%;left:22%;height:24%;width:56%;background:#fff;border-radius:3px')} /></div><div style={s('font-size:17px;font-weight:800;color:#fff')}>Quầy thuốc 16</div></div>
          <div style={s('font-size:13.5px;line-height:1.7')}>Tận tâm, tận lòng.<br />Hệ thống nhà thuốc đạt chuẩn GPP, cam kết thuốc chính hãng, tư vấn bởi dược sĩ.</div>
        </div>
        <div><div style={s('font-size:14px;font-weight:700;color:#fff;margin-bottom:14px')}>Danh mục</div><div style={s('display:flex;flex-direction:column;gap:9px;font-size:13.5px')}><span onClick={() => goCatScreen('thuoc')} style={s('cursor:pointer')}>Thuốc</span><span onClick={() => goCatScreen('tpcn')} style={s('cursor:pointer')}>Thực phẩm chức năng</span><span onClick={() => goCatScreen('thietbi')} style={s('cursor:pointer')}>Thiết bị y tế</span></div></div>
        <div><div style={s('font-size:14px;font-weight:700;color:#fff;margin-bottom:14px')}>Hỗ trợ</div><div style={s('display:flex;flex-direction:column;gap:9px;font-size:13.5px')}><span>Tư vấn dược sĩ</span><span onClick={openRx} style={s('cursor:pointer')}>Đặt thuốc theo toa</span><span>Chính sách đổi trả</span><span>Hướng dẫn mua hàng</span></div></div>
        <div><div style={s('font-size:14px;font-weight:700;color:#fff;margin-bottom:14px')}>Liên hệ</div><div style={s('display:flex;flex-direction:column;gap:9px;font-size:13.5px')}><span>Hotline: 1900 16 16</span><span>cskh@quaythuoc16.vn</span><span>16 Đường Sức Khỏe, Q.1, TP.HCM</span></div></div>
      </div>
      <div style={s('border-top:1px solid rgba(255,255,255,.12)')}><div style={s('max-width:1180px;margin:0 auto;padding:16px 24px;font-size:12.5px;color:#7fb592')}>© 2026 Quầy thuốc 16. Sản phẩm này là bản thiết kế mẫu.</div></div>
    </footer>
  )
}
