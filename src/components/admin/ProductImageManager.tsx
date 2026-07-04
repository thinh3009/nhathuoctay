'use client'

import { useRef, useState } from 'react'
import type { ProductImage } from '@/lib/schemas'

type ProductImageManagerProps = {
  productKey: string
  initialImages?: ProductImage[]
  name?: string
  max?: number
}

// Trình quản lý ảnh cho form thêm/sửa sản phẩm: thêm (upload từ folder hoặc chụp trên
// điện thoại), xoá (xoá luôn file trên Supabase Storage). Danh sách ảnh được đồng bộ vào
// một input ẩn dạng JSON để gửi kèm form sản phẩm.
export default function ProductImageManager({
  productKey,
  initialImages = [],
  name = 'images',
  max = 6,
}: ProductImageManagerProps) {
  const [images, setImages] = useState<ProductImage[]>(initialImages)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const remaining = max - images.length

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return
    setError(null)
    setBusy(true)

    const files = Array.from(fileList).slice(0, remaining)
    const added: ProductImage[] = []

    try {
      for (const [offset, file] of files.entries()) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('productKey', productKey)
        formData.append('index', String(images.length + added.length + offset))

        const response = await fetch('/api/admin/product-images', {
          method: 'POST',
          body: formData,
        })
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data?.error ?? 'Upload thất bại.')
        }
        added.push(data.image as ProductImage)
      }
      setImages((current) => [...current, ...added])
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Upload thất bại.')
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  async function handleDelete(image: ProductImage) {
    setError(null)
    setBusy(true)
    try {
      const response = await fetch(
        `/api/admin/product-images?path=${encodeURIComponent(image.storagePath)}`,
        { method: 'DELETE' },
      )
      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error ?? 'Xoá ảnh thất bại.')
      }
      setImages((current) => current.filter((item) => item.storagePath !== image.storagePath))
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Xoá ảnh thất bại.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <input name={name} type="hidden" value={JSON.stringify(images)} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((image, index) => (
          <div
            className="group relative overflow-hidden rounded-xl border border-stone-200 bg-stone-50"
            key={image.storagePath}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={image.label}
              className="h-32 w-full object-cover"
              src={image.src}
            />
            {index === 0 ? (
              <span className="absolute left-2 top-2 rounded-full bg-emerald-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                Ảnh chính
              </span>
            ) : null}
            <button
              aria-label={`Xoá ${image.label}`}
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-stone-600 shadow transition hover:bg-red-600 hover:text-white disabled:opacity-50"
              disabled={busy}
              onClick={() => handleDelete(image)}
              type="button"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
              </svg>
            </button>
          </div>
        ))}

        {remaining > 0 ? (
          <button
            className="flex h-32 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stone-300 bg-white text-stone-500 transition hover:border-emerald-400 hover:text-emerald-700 disabled:opacity-60"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            type="button"
          >
            {busy ? (
              <span className="text-sm font-semibold">Đang tải…</span>
            ) : (
              <>
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
                </svg>
                <span className="text-sm font-semibold">Thêm ảnh</span>
              </>
            )}
          </button>
        ) : null}
      </div>

      {/* accept="image/*" cho phép chọn từ thư viện/folder hoặc mở camera trên điện thoại. */}
      <input
        accept="image/*"
        className="hidden"
        multiple
        onChange={(event) => handleFiles(event.target.files)}
        ref={inputRef}
        type="file"
      />

      <p className="mt-3 text-sm text-stone-500">
        Tối đa {max} ảnh. Ảnh đầu tiên là ảnh chính. Trên điện thoại có thể chọn ảnh có sẵn hoặc chụp trực tiếp.
        Để trống sẽ dùng ảnh mặc định theo danh mục.
      </p>
      {error ? <p className="mt-2 text-sm font-semibold text-red-600">{error}</p> : null}
    </div>
  )
}
