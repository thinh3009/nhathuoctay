'use client'

import { useCallback, useEffect, useState } from 'react'
import { s } from '../data'

/**
 * Slider ảnh hero trang chủ.
 * - 0 ảnh: giữ placeholder trang trí (chưa cấu hình ảnh nào).
 * - 1 ảnh: hiển thị tĩnh, không tự trượt, không mũi tên.
 * - ≥2 ảnh: tự trượt mỗi 3s + nút mũi tên (bấm được trên cả điện thoại & PC) +
 *   phím ← → khi trang đang focus. Chấm tròn cho biết vị trí hiện tại.
 */
export default function HeroCarousel({ images }: { images: string[] }) {
  const count = images.length
  const [idx, setIdx] = useState(0)

  const go = useCallback((next: number) => {
    setIdx((prev) => {
      const total = images.length
      if (total === 0) return 0
      return ((next % total) + total) % total
    })
  }, [images.length])

  // Chỉ số an toàn khi số ảnh thay đổi (admin xóa ảnh) — clamp ngay lúc render,
  // không cần effect setState.
  const current = count > 0 ? ((idx % count) + count) % count : 0

  // Tự trượt mỗi 3s khi có từ 2 ảnh.
  useEffect(() => {
    if (count < 2) return
    const timer = setInterval(() => setIdx((prev) => (prev + 1) % count), 3000)
    return () => clearInterval(timer)
  }, [count])

  // Phím mũi tên trái/phải (PC).
  useEffect(() => {
    if (count < 2) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') go(current - 1)
      else if (event.key === 'ArrowRight') go(current + 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [count, current, go])

  if (count === 0) {
    return (
      <div style={s('width:100%;height:100%;background:linear-gradient(135deg,var(--teal-100),var(--teal-50));display:flex;align-items:center;justify-content:center;color:var(--teal-700);font:600 12px ui-monospace,monospace;text-align:center')}>
        ảnh hero
        <br />
        (thêm ở Quản lý ảnh)
      </div>
    )
  }

  const arrowStyle = (side: 'left' | 'right') =>
    s(
      `position:absolute;${side}:10px;top:50%;transform:translateY(-50%);width:36px;height:36px;border-radius:50%;border:none;background:rgba(255,255,255,.9);color:var(--teal-800);font-size:20px;font-weight:700;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:var(--shadow-sm);z-index:2`,
    )

  return (
    <div style={s('position:relative;width:100%;height:100%;overflow:hidden')}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt="Ảnh hero Quầy thuốc 16"
        src={images[current]}
        style={s('width:100%;height:100%;object-fit:cover;display:block')}
      />

      {count >= 2 ? (
        <>
          <button aria-label="Ảnh trước" onClick={() => go(current - 1)} style={arrowStyle('left')} type="button">
            ‹
          </button>
          <button aria-label="Ảnh sau" onClick={() => go(current + 1)} style={arrowStyle('right')} type="button">
            ›
          </button>
          <div style={s('position:absolute;left:0;right:0;bottom:10px;display:flex;gap:6px;justify-content:center;z-index:2')}>
            {images.map((_, i) => (
              <button
                aria-label={`Tới ảnh ${i + 1}`}
                key={i}
                onClick={() => go(i)}
                style={{
                  ...s('width:8px;height:8px;border-radius:50%;border:none;cursor:pointer;padding:0'),
                  background: i === current ? 'var(--color-brand-primary)' : 'rgba(255,255,255,.7)',
                }}
                type="button"
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  )
}
