'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { ACCEPTED_IMAGE_MIME, EXTENSION_BY_MIME, MAX_UPLOAD_BYTES } from '@/lib/productImages'
import AppearanceManager from '@/features/siteImages/components/AppearanceManager'
import type { SiteImageMap } from '@/features/siteImages/types'

const MAX_UPLOAD_MB = Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)

export type HeroImage = { id: string; url: string }

export type ManagedImage = {
  name: string
  size: number
  mimeType: string | null
  updatedAt: string | null
  publicUrl: string
  deletable: boolean
  usedByProduct: string | null
}

type UsageBucket = {
  folder: string
  label: string
  fileCount: number
  totalBytes: number
}

type Usage = {
  buckets: UsageBucket[]
  totalBytes: number
  totalFiles: number
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  const mb = kb / 1024
  if (mb < 1024) return `${mb.toFixed(2)} MB`
  return `${(mb / 1024).toFixed(2)} GB`
}

const BAR_COLORS = ['#047857', '#0ea5e9', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b']

export default function ImageManagerClient({
  images,
  heroImages,
  siteImages,
  storageLimitBytes,
  usage,
}: {
  images: ManagedImage[]
  heroImages: HeroImage[]
  // Ảnh giao diện tùy biến (CTA, logo) — admin đặt trong tab "Ảnh hero".
  siteImages: SiteImageMap
  // Hạn mức Storage (bytes) — server truyền xuống từ env, không hard-code theo gói free.
  storageLimitBytes: number
  usage: Usage
}) {
  const [tab, setTab] = useState<'list' | 'usage' | 'hero'>('list')
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleDelete(image: ManagedImage) {
    const confirmed = window.confirm(
      `Xoá ảnh này khỏi Supabase Storage?${
        image.usedByProduct ? `\nẢnh đang dùng cho sản phẩm: ${image.usedByProduct}.` : ''
      }`,
    )
    if (!confirmed) return

    setError(null)
    setDeleting(image.name)
    try {
      const response = await fetch(
        `/api/admin/product-images?path=${encodeURIComponent(image.name)}`,
        { method: 'DELETE' },
      )
      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error ?? 'Xoá ảnh thất bại.')
      }
      router.refresh()
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Xoá ảnh thất bại.')
    } finally {
      setDeleting(null)
    }
  }

  const usagePercent = Math.min(100, (usage.totalBytes / storageLimitBytes) * 100)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-black text-stone-900">Quản lý ảnh</h1>
        <p className="mt-1 text-stone-500">
          {usage.totalFiles} ảnh · {formatBytes(usage.totalBytes)} đã dùng trên Supabase Storage
        </p>
      </div>

      <div className="mb-6 inline-flex rounded-xl border border-stone-200 bg-white p-1">
        <TabButton active={tab === 'list'} label="Danh sách ảnh" onClick={() => setTab('list')} />
        <TabButton active={tab === 'usage'} label="Dung lượng lưu trữ" onClick={() => setTab('usage')} />
        <TabButton active={tab === 'hero'} label="Ảnh hero" onClick={() => setTab('hero')} />
      </div>

      {error ? (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</p>
      ) : null}

      {tab === 'list' ? (
        <ImageList deleting={deleting} images={images} onDelete={handleDelete} />
      ) : tab === 'usage' ? (
        <UsageChart limitBytes={storageLimitBytes} usage={usage} usagePercent={usagePercent} />
      ) : (
        <div className="space-y-6">
          <HeroManager heroImages={heroImages} />

          {/* Giao diện khác: ảnh nền CTA + logo tùy chỉnh (lưu ở bảng site_images) */}
          <div className="rounded-2xl border border-stone-200 bg-white p-6">
            <div className="mb-4">
              <h2 className="font-bold text-stone-900">Giao diện trang chủ</h2>
              <p className="mt-0.5 text-sm text-stone-500">Ảnh nền khu kêu gọi (CTA) và logo hiển thị ở header/footer.</p>
            </div>
            <AppearanceManager embedded initial={siteImages} slots={['cta', 'logo']} />
          </div>
        </div>
      )}
    </div>
  )
}

// Quản lý ảnh hero (banner trang chủ): thêm từ máy, đổi thứ tự (slider chạy theo thứ tự
// này), xóa. Trang chủ tự trượt khi có ≥2 ảnh; 1 ảnh hiển thị tĩnh.
function HeroManager({ heroImages }: { heroImages: HeroImage[] }) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleUpload(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return
    setError(null)
    setBusy(true)
    try {
      for (const file of Array.from(fileList)) {
        if (!(file.type in EXTENSION_BY_MIME)) {
          throw new Error(`"${file.name}" không đúng định dạng (chỉ JPG, PNG, WebP, GIF, AVIF).`)
        }
        if (file.size > MAX_UPLOAD_BYTES) {
          throw new Error(`"${file.name}" vượt quá ${MAX_UPLOAD_MB}MB.`)
        }
      }
      for (const file of Array.from(fileList)) {
        const formData = new FormData()
        formData.append('file', file)
        const response = await fetch('/api/admin/hero-images', { method: 'POST', body: formData })
        if (!response.ok) {
          const data = await response.json().catch(() => null)
          throw new Error(data?.error ?? 'Upload thất bại.')
        }
      }
      router.refresh()
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Upload thất bại.')
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  async function handleReorder(id: string, direction: 'up' | 'down') {
    setError(null)
    setBusy(true)
    try {
      const response = await fetch('/api/admin/hero-images', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id, direction }),
      })
      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error ?? 'Đổi thứ tự thất bại.')
      }
      router.refresh()
    } catch (reorderError) {
      setError(reorderError instanceof Error ? reorderError.message : 'Đổi thứ tự thất bại.')
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Xóa ảnh hero này khỏi trang chủ?')) return
    setError(null)
    setBusy(true)
    try {
      const response = await fetch(`/api/admin/hero-images?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error ?? 'Xóa ảnh thất bại.')
      }
      router.refresh()
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Xóa ảnh thất bại.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-bold text-stone-900">Ảnh hero trang chủ</h2>
        <button
          className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:opacity-60"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          type="button"
        >
          {busy ? 'Đang xử lý…' : '+ Thêm ảnh từ máy'}
        </button>
      </div>
      <p className="mb-4 text-sm text-stone-500">
        Khuyến nghị ảnh ngang <span className="font-semibold text-stone-700">1200×900px</span> (tỉ lệ 4:3),
        ≤ {MAX_UPLOAD_MB}MB. Có từ 2 ảnh trở lên trang chủ sẽ tự trượt mỗi 3 giây; 1 ảnh hiển thị tĩnh.
        Kéo thứ tự bằng nút ▲▼.
      </p>

      <input
        accept={ACCEPTED_IMAGE_MIME}
        className="hidden"
        multiple
        onChange={(event) => handleUpload(event.target.files)}
        ref={inputRef}
        type="file"
      />

      {error ? <p className="mb-3 text-sm font-semibold text-red-600">{error}</p> : null}

      {heroImages.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-300 px-4 py-10 text-center text-sm text-stone-400">
          Chưa có ảnh hero nào. Trang chủ đang hiển thị khung trang trí mặc định.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {heroImages.map((image, index) => (
            <div className="overflow-hidden rounded-xl border border-stone-200" key={image.id}>
              <div className="relative aspect-[4/3] bg-stone-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt={`Ảnh hero ${index + 1}`} className="h-full w-full object-cover" src={image.url} />
                <span className="absolute left-2 top-2 rounded-full bg-emerald-700 px-2 py-0.5 text-[10px] font-bold text-white">
                  #{index + 1}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 px-3 py-2">
                <div className="flex gap-1">
                  <button
                    aria-label="Lên trước"
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-100 text-stone-600 transition hover:bg-stone-200 disabled:opacity-40"
                    disabled={busy || index === 0}
                    onClick={() => handleReorder(image.id, 'up')}
                    type="button"
                  >
                    ▲
                  </button>
                  <button
                    aria-label="Xuống sau"
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-100 text-stone-600 transition hover:bg-stone-200 disabled:opacity-40"
                    disabled={busy || index === heroImages.length - 1}
                    onClick={() => handleReorder(image.id, 'down')}
                    type="button"
                  >
                    ▼
                  </button>
                </div>
                <button
                  className="text-sm font-semibold text-red-500 transition hover:text-red-700 disabled:opacity-40"
                  disabled={busy}
                  onClick={() => handleDelete(image.id)}
                  type="button"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function TabButton({
  active,
  label,
  onClick,
}: {
  active: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
        active ? 'bg-emerald-700 text-white' : 'text-stone-600 hover:bg-stone-100'
      }`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  )
}

function ImageList({
  images,
  deleting,
  onDelete,
}: {
  images: ManagedImage[]
  deleting: string | null
  onDelete: (image: ManagedImage) => void
}) {
  if (images.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center text-stone-500">
        Chưa có ảnh nào trong Storage.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {images.map((image) => (
        <div
          className="overflow-hidden rounded-2xl border border-stone-200 bg-white"
          key={image.name}
        >
          <div className="relative aspect-square bg-stone-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt={image.name} className="h-full w-full object-cover" src={image.publicUrl} />
            {image.deletable ? (
              <button
                aria-label="Xoá ảnh"
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-stone-600 shadow transition hover:bg-red-600 hover:text-white disabled:opacity-50"
                disabled={deleting === image.name}
                onClick={() => onDelete(image)}
                type="button"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
                </svg>
              </button>
            ) : (
              <span className="absolute right-2 top-2 rounded-full bg-stone-800/70 px-2 py-0.5 text-[10px] font-semibold text-white">
                Ảnh hệ thống
              </span>
            )}
          </div>
          <div className="p-3">
            <p className="truncate text-xs font-medium text-stone-700" title={image.name}>
              {image.name.split('/').pop()}
            </p>
            <p className="mt-1 text-xs text-stone-400">{formatBytes(image.size)}</p>
            {image.usedByProduct ? (
              <p className="mt-1 truncate text-xs font-semibold text-emerald-700" title={image.usedByProduct}>
                {image.usedByProduct}
              </p>
            ) : (
              <p className="mt-1 text-xs text-amber-600">Chưa gắn sản phẩm</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function UsageChart({
  usage,
  usagePercent,
  limitBytes,
}: {
  usage: Usage
  usagePercent: number
  limitBytes: number
}) {
  const maxBytes = Math.max(1, ...usage.buckets.map((bucket) => bucket.totalBytes))

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-stone-200 bg-white p-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold text-stone-500">Tổng dung lượng ảnh</p>
            <p className="mt-1 text-3xl font-black text-stone-900">{formatBytes(usage.totalBytes)}</p>
          </div>
          <p className="text-sm text-stone-500">
            {usagePercent.toFixed(1)}% của {formatBytes(limitBytes)}
          </p>
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-stone-100">
          <div
            className="h-full rounded-full bg-emerald-600"
            style={{ width: `${Math.max(usagePercent, usage.totalBytes > 0 ? 2 : 0)}%` }}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="mb-5 font-bold text-stone-900">Dung lượng theo thư mục</h2>
        {usage.buckets.length === 0 ? (
          <p className="text-sm text-stone-500">Chưa có dữ liệu.</p>
        ) : (
          <div className="space-y-4">
            {usage.buckets.map((bucket, index) => (
              <div key={bucket.folder}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-semibold text-stone-700">{bucket.label}</span>
                  <span className="text-stone-500">
                    {formatBytes(bucket.totalBytes)} · {bucket.fileCount} ảnh
                  </span>
                </div>
                <div className="h-6 overflow-hidden rounded-lg bg-stone-100">
                  <div
                    className="flex h-full items-center rounded-lg"
                    style={{
                      width: `${Math.max((bucket.totalBytes / maxBytes) * 100, 3)}%`,
                      backgroundColor: BAR_COLORS[index % BAR_COLORS.length],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
