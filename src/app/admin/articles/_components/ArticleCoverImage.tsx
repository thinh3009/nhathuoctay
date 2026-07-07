'use client'

import { useRef, useState } from 'react'
import { ACCEPTED_IMAGE_MIME, EXTENSION_BY_MIME, MAX_UPLOAD_BYTES } from '@/lib/productImages'
import type { ProductImage } from '@/lib/schemas'

const MAX_UPLOAD_MB = Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)

const inputClass =
  'w-full rounded-xl border border-stone-300 px-3 py-2 text-sm text-stone-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'
const labelClass = 'mb-1.5 block text-sm font-semibold text-stone-700'

// Ảnh bìa bài viết: upload từ máy (tái dùng API ảnh sản phẩm, prefix uploads/article),
// hoặc dán URL. Giá trị cuối cùng lưu vào input ẩn name="coverImage".
export default function ArticleCoverImage({ defaultUrl }: { defaultUrl?: string | null }) {
  const [url, setUrl] = useState(defaultUrl ?? '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(fileList: FileList | null) {
    const file = fileList?.[0]
    if (!file) return
    setError(null)

    if (!(file.type in EXTENSION_BY_MIME)) {
      setError('Ảnh không đúng định dạng (chỉ JPG, PNG, WebP, GIF, AVIF).')
      return
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setError(`Ảnh vượt quá ${MAX_UPLOAD_MB}MB.`)
      return
    }

    setBusy(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('productKey', 'article')
      const response = await fetch('/api/admin/product-images', { method: 'POST', body: formData })
      const data = await response.json()
      if (!response.ok) throw new Error(data?.error ?? 'Upload thất bại.')
      setUrl((data.image as ProductImage).src)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Upload thất bại.')
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      <label className={labelClass} htmlFor="coverImageUrl">
        Ảnh bìa (tùy chọn)
      </label>

      {url ? (
        <div className="mb-2 overflow-hidden rounded-xl border border-stone-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="Ảnh bìa bài viết" className="aspect-[1200/630] w-full object-cover" src={url} />
        </div>
      ) : null}

      {/* Giá trị gửi về server action */}
      <input name="coverImage" type="hidden" value={url} />

      {/* Cho phép dán URL trực tiếp nếu đã có sẵn ảnh trên web */}
      <input
        className={inputClass}
        id="coverImageUrl"
        onChange={(event) => setUrl(event.target.value)}
        placeholder="Dán URL ảnh hoặc tải lên từ máy…"
        value={url}
      />

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          className="rounded-xl bg-emerald-700 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-800 disabled:opacity-60"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          type="button"
        >
          {busy ? 'Đang tải…' : 'Tải ảnh từ máy'}
        </button>
        {url ? (
          <button
            className="rounded-xl border border-stone-300 px-3 py-2 text-xs font-semibold text-stone-600 transition hover:bg-stone-50"
            onClick={() => setUrl('')}
            type="button"
          >
            Bỏ ảnh
          </button>
        ) : null}
      </div>

      <input
        accept={ACCEPTED_IMAGE_MIME}
        className="hidden"
        onChange={(event) => handleFile(event.target.files)}
        ref={inputRef}
        type="file"
      />

      <p className="mt-2 text-xs text-stone-500">
        Khuyến nghị ảnh ngang <span className="font-semibold text-stone-700">1200×630px</span> (tỉ lệ
        1.91:1) để cân đối với khung ảnh bìa, ≤ {MAX_UPLOAD_MB}MB.
      </p>
      {error ? <p className="mt-1.5 text-xs font-semibold text-red-600">{error}</p> : null}
    </div>
  )
}
