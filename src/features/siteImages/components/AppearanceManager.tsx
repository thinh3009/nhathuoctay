'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { SiteImageMap, SiteImageSlot } from '../types'

type SlotConfig = {
  slot: SiteImageSlot
  title: string
  desc: string
  icon: string
  ratio: string
  preview: 'banner' | 'logo'
}

const SLOTS: SlotConfig[] = [
  { slot: 'hero', title: 'Banner Hero đầu trang', desc: 'Ảnh lớn hiển thị trong carousel ở đầu trang chủ. Khuyến nghị ảnh ngang, tối thiểu 800×600.', icon: 'ph-image', ratio: '4 / 3', preview: 'banner' },
  { slot: 'cta', title: 'Ảnh nền khu CTA', desc: 'Ảnh nền cho dải “Đặt thuốc theo toa / Tư vấn bác sĩ”. Nên chọn ảnh sáng, tông xanh ngọc.', icon: 'ph-megaphone', ratio: '16 / 6', preview: 'banner' },
  { slot: 'logo', title: 'Logo (header & footer)', desc: 'Logo tùy chỉnh thay cho logo mặc định. Dùng ảnh nền trong suốt (PNG/SVG-raster), cao ~120px.', icon: 'ph-sparkle', ratio: '3 / 1', preview: 'logo' },
]

export default function AppearanceManager({
  initial,
  embedded = false,
  slots,
}: {
  initial: SiteImageMap
  // embedded = nhúng trong tab khác (ẩn tiêu đề trang).
  embedded?: boolean
  // Giới hạn slot hiển thị (mặc định: tất cả).
  slots?: SiteImageSlot[]
}) {
  const router = useRouter()
  const [images, setImages] = useState<SiteImageMap>(initial)
  const [busy, setBusy] = useState<SiteImageSlot | null>(null)
  const [error, setError] = useState<string>('')
  const inputs = useRef<Record<string, HTMLInputElement | null>>({})
  const visibleSlots = slots ? SLOTS.filter((c) => slots.includes(c.slot)) : SLOTS
  const gridClass = visibleSlots.length >= 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'

  async function upload(slot: SiteImageSlot, file: File) {
    setError('')
    setBusy(slot)
    try {
      const fd = new FormData()
      fd.append('slot', slot)
      fd.append('file', file)
      const res = await fetch('/api/admin/site-images', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Upload thất bại')
        return
      }
      setImages((prev) => ({ ...prev, [slot]: `${data.url}?t=${Date.now()}` }))
      router.refresh()
    } catch {
      setError('Lỗi kết nối, vui lòng thử lại')
    } finally {
      setBusy(null)
    }
  }

  async function reset(slot: SiteImageSlot) {
    setError('')
    setBusy(slot)
    try {
      const res = await fetch(`/api/admin/site-images?slot=${slot}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Gỡ ảnh thất bại')
        return
      }
      setImages((prev) => {
        const next = { ...prev }
        delete next[slot]
        return next
      })
      router.refresh()
    } catch {
      setError('Lỗi kết nối, vui lòng thử lại')
    } finally {
      setBusy(null)
    }
  }

  return (
    <div>
      {embedded ? null : (
        <div className="mb-6">
          <h1 className="text-3xl font-black tracking-tight text-stone-900">Giao diện trang chủ</h1>
          <p className="mt-1 text-sm text-stone-500">Tùy chỉnh logo, banner hero và ảnh nền khu kêu gọi (CTA) hiển thị trên trang chủ.</p>
        </div>
      )}

      {error ? <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</div> : null}

      <div className={`grid gap-5 sm:grid-cols-2 ${gridClass}`}>
        {visibleSlots.map((cfg) => {
          const url = images[cfg.slot]
          const isBusy = busy === cfg.slot
          return (
            <div key={cfg.slot} className="flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white">
              <div className="flex items-start gap-3 border-b border-stone-100 p-5">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700"><i className={`ph ${cfg.icon} text-xl`} /></span>
                <div>
                  <h2 className="font-bold text-stone-900">{cfg.title}</h2>
                  <p className="mt-0.5 text-xs leading-relaxed text-stone-500">{cfg.desc}</p>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <div
                  className={`flex items-center justify-center overflow-hidden rounded-xl border border-dashed border-stone-300 ${cfg.preview === 'logo' ? 'bg-stone-100' : 'bg-stone-50'}`}
                  style={{ aspectRatio: cfg.ratio }}
                >
                  {url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={url} alt={cfg.title} className="h-full w-full object-contain" />
                  ) : (
                    <span className="flex flex-col items-center gap-1 text-stone-400">
                      <i className="ph ph-image-square text-3xl" />
                      <span className="text-xs">Đang dùng mặc định</span>
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <input
                    ref={(el) => { inputs.current[cfg.slot] = el }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) void upload(cfg.slot, f); e.target.value = '' }}
                  />
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => inputs.current[cfg.slot]?.click()}
                    className="flex-1 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-60"
                  >
                    {isBusy ? 'Đang xử lý…' : url ? 'Đổi ảnh' : 'Tải ảnh lên'}
                  </button>
                  {url ? (
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => void reset(cfg.slot)}
                      className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm font-semibold text-stone-600 transition hover:bg-stone-50 disabled:opacity-60"
                    >
                      Gỡ
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
