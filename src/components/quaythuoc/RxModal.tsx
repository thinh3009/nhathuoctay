import { s } from './data'
import type { StorefrontHub } from './use-storefront'

/** Modal "Đặt thuốc theo toa": tải ảnh toa + SĐT để dược sĩ liên hệ. */
export default function RxModal({ hub }: { hub: StorefrontHub }) {
  const { sst, closeRx, onRxFile, submitRx, setForm } = hub
  if (!sst.showRx) return null
  return (
    <div onClick={closeRx} style={s('position:fixed;inset:0;background:rgba(20,40,30,.55);z-index:70;display:flex;align-items:center;justify-content:center;padding:24px;animation:qtFade .2s ease')}>
      <div onClick={(e) => e.stopPropagation()} style={s('background:#fff;border-radius:20px;padding:30px;width:480px;max-width:100%;animation:qtModal .25s ease')}>
        <div style={s('display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:6px')}><h2 style={s('font-size:21px;font-weight:800;color:#14532d;margin:0')}>Đặt thuốc theo toa</h2><button onClick={closeRx} style={s('border:none;background:#f1f6f3;width:32px;height:32px;border-radius:9px;font-size:16px;cursor:pointer;color:#8a948e')}>✕</button></div>
        <p style={s('font-size:13.5px;color:#8a948e;margin:0 0 20px;line-height:1.6')}>Chụp hoặc tải ảnh toa thuốc. Dược sĩ sẽ soạn đơn và liên hệ xác nhận với bạn.</p>
        <label style={s('display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;border:2px dashed #bcdcc8;border-radius:14px;padding:30px;cursor:pointer;background:#f6faf7;text-align:center')}>
          <span style={s('font-size:34px')}>📄</span>
          {!sst.rxName ? (
            <>
              <span style={s('font-size:14px;font-weight:600;color:#1c7a45')}>Bấm để tải ảnh toa thuốc</span>
              <span style={s('font-size:12px;color:#9aa8a0')}>PNG, JPG tối đa 10MB</span>
            </>
          ) : (
            <>
              <span style={s('font-size:14px;font-weight:600;color:#1c7a45')}>✓ {sst.rxName}</span>
              <span style={s('font-size:12px;color:#9aa8a0')}>Bấm để chọn ảnh khác</span>
            </>
          )}
          <input type="file" accept="image/*" onChange={onRxFile} style={s('display:none')} />
        </label>
        <input value={sst.form.phone} onChange={(e) => setForm('phone', e.target.value)} placeholder="Số điện thoại để dược sĩ liên hệ" style={s('width:100%;border:1.5px solid #e0ebe4;border-radius:11px;padding:13px 14px;font-size:14px;outline:none;margin:16px 0 0')} />
        <button onClick={submitRx} style={s('width:100%;background:#2e9e5b;color:#fff;border:none;padding:14px;border-radius:12px;font-weight:700;font-size:15px;cursor:pointer;margin-top:14px')}>Gửi toa cho dược sĩ</button>
      </div>
    </div>
  )
}
