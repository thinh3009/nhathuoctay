import { s } from '../data'
import type { StorefrontHub } from '../use-storefront'

/** Modal "Đặt thuốc theo toa": tải ảnh toa + SĐT để dược sĩ liên hệ. */
export default function RxModal({ hub }: { hub: StorefrontHub }) {
  const { sst, closeRx, onRxFile, submitRx, setForm } = hub
  if (!sst.showRx) return null
  return (
    <div onClick={closeRx} style={s('position:fixed;inset:0;background:rgba(0,71,63,.45);z-index:70;display:flex;align-items:center;justify-content:center;padding:24px;animation:qtFade .2s ease')}>
      <div onClick={(e) => e.stopPropagation()} style={s('background:var(--neutral-0);border-radius:var(--radius-xl);box-shadow:var(--shadow-lg);padding:30px;width:480px;max-width:100%;animation:qtModal .25s ease')}>
        <div style={s('display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:6px')}><h2 style={s('font:var(--text-heading-md);color:var(--color-text-heading);margin:0')}>Đặt thuốc theo toa</h2><button onClick={closeRx} style={s('border:none;background:var(--neutral-100);width:32px;height:32px;border-radius:50%;font-size:15px;cursor:pointer;color:var(--color-text-muted);display:flex;align-items:center;justify-content:center')}><i className="ph ph-x" /></button></div>
        <p style={s('font-size:13.5px;color:var(--color-text-muted);margin:0 0 20px;line-height:1.6')}>Chụp hoặc tải ảnh toa thuốc. Dược sĩ sẽ soạn đơn và liên hệ xác nhận với bạn.</p>
        <label style={s('display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;border:2px dashed var(--teal-200);border-radius:var(--radius-md);padding:30px;cursor:pointer;background:var(--teal-50);text-align:center')}>
          <i className="ph ph-file-text" style={s('font-size:34px;color:var(--teal-600)')} />
          {!sst.rxName ? (
            <>
              <span style={s('font-size:14px;font-weight:600;color:var(--color-brand-primary)')}>Bấm để tải ảnh toa thuốc</span>
              <span style={s('font-size:12px;color:var(--color-text-muted)')}>PNG, JPG tối đa 10MB</span>
            </>
          ) : (
            <>
              <span style={s('font-size:14px;font-weight:600;color:var(--color-brand-primary);display:flex;align-items:center;gap:6px')}><i className="ph-fill ph-check-circle" /> {sst.rxName}</span>
              <span style={s('font-size:12px;color:var(--color-text-muted)')}>Bấm để chọn ảnh khác</span>
            </>
          )}
          <input type="file" accept="image/*" onChange={onRxFile} style={s('display:none')} />
        </label>
        <input value={sst.form.phone} onChange={(e) => setForm('phone', e.target.value)} placeholder="Số điện thoại để dược sĩ liên hệ" style={s('width:100%;border:1.5px solid var(--color-border-default);border-radius:var(--radius-md);padding:13px 14px;font-size:14px;outline:none;margin:16px 0 0')} />
        <button onClick={submitRx} style={s('width:100%;background:var(--color-brand-primary);color:#fff;border:none;padding:14px;border-radius:var(--radius-pill);font-weight:700;font-size:15px;cursor:pointer;margin-top:14px')}>Gửi toa cho dược sĩ</button>
      </div>
    </div>
  )
}
