import { s } from '../data'

/** Toast thông báo nổi ở đáy màn hình (tự ẩn qua state trong useStorefront). */
export default function Toast({ message }: { message: string }) {
  if (!message) return null
  return (
    <div style={s('position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:#14532d;color:#fff;padding:13px 24px;border-radius:12px;font-size:14px;font-weight:600;box-shadow:0 8px 28px rgba(0,0,0,.22);z-index:60;animation:qtToast .25s ease;display:flex;align-items:center;gap:9px')}>
      <span style={s('color:#7be0a0')}>✓</span>
      {message}
    </div>
  )
}
