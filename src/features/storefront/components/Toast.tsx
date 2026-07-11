import { s } from '../data'

/** Toast thông báo nổi ở đáy màn hình (tự ẩn qua state trong useStorefront). */
export default function Toast({ message }: { message: string }) {
  if (!message) return null
  return (
    <div style={s('position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:var(--teal-900);color:#fff;padding:13px 24px;border-radius:var(--radius-pill);font-size:14px;font-weight:600;box-shadow:var(--shadow-lg);z-index:60;animation:qtToast .25s ease;display:flex;align-items:center;gap:9px')}>
      <i className="ph-fill ph-check-circle" style={s('color:var(--teal-200);font-size:18px')} />
      {message}
    </div>
  )
}
