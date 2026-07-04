'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

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
  storageLimitBytes,
  usage,
}: {
  images: ManagedImage[]
  // Hạn mức Storage (bytes) — server truyền xuống từ env, không hard-code theo gói free.
  storageLimitBytes: number
  usage: Usage
}) {
  const [tab, setTab] = useState<'list' | 'usage'>('list')
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
      </div>

      {error ? (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</p>
      ) : null}

      {tab === 'list' ? (
        <ImageList deleting={deleting} images={images} onDelete={handleDelete} />
      ) : (
        <UsageChart limitBytes={storageLimitBytes} usage={usage} usagePercent={usagePercent} />
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
