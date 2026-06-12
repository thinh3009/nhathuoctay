'use client'

import Image from 'next/image'
import { useState } from 'react'
import { formatPrice } from '@/lib/catalog'
import { getProductImageSrc } from '@/lib/productImages'
import type { Product } from '@/lib/schemas'
import AddToCartButton from './AddToCartButton'
import QuantitySelector from './QuantitySelector'

type ProductDetailHeroProps = {
  product: Product
}

export default function ProductDetailHero({ product }: ProductDetailHeroProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(product.defaultQuantity)

  const selectedImage = product.images[selectedImageIndex]

  function showPreviousImage() {
    setSelectedImageIndex((current) => (current === 0 ? product.images.length - 1 : current - 1))
  }

  function showNextImage() {
    setSelectedImageIndex((current) => (current === product.images.length - 1 ? 0 : current + 1))
  }

  return (
    <section className="mt-6 rounded-lg border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-stone-200 bg-stone-50 px-4 py-4 sm:px-5">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                  Hình ảnh sản phẩm
                </p>
                <h2 className="mt-1 truncate text-lg font-bold text-stone-900">{product.name}</h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  aria-label="Ảnh trước"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-lg font-bold text-stone-700 transition hover:border-emerald-300 hover:text-emerald-700"
                  onClick={showPreviousImage}
                  type="button"
                >
                  ‹
                </button>
                <button
                  aria-label="Ảnh sau"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-lg font-bold text-stone-700 transition hover:border-emerald-300 hover:text-emerald-700"
                  onClick={showNextImage}
                  type="button"
                >
                  ›
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-stone-50 via-white to-emerald-50 px-4 py-6 sm:px-6">
              <div className="flex min-h-[420px] items-center justify-center">
                {selectedImage ? (
                  <div className="w-full max-w-[420px] rounded-[2rem] border border-stone-200 bg-white p-4 shadow-xl">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <span className="rounded-full bg-stone-100 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-stone-500">
                        {product.unit}
                      </span>
                      <span className="rounded-full bg-emerald-700 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white">
                        {selectedImage.label}
                      </span>
                    </div>
                    <div className="relative overflow-hidden rounded-[1.5rem] bg-stone-50">
                      <Image
                        alt={`${product.name} - ${selectedImage.label}`}
                        className="h-[360px] w-full object-cover"
                        height={900}
                        priority={selectedImageIndex === 0}
                        sizes="(max-width: 1024px) 100vw, 420px"
                        src={getProductImageSrc(selectedImage)}
                        width={900}
                      />
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white/90 px-4 py-3 text-sm text-stone-600 shadow-sm">
                <p className="truncate font-medium">
                  Đang xem:{' '}
                  <span className="font-semibold text-stone-900">{selectedImage?.label ?? 'Ảnh sản phẩm'}</span>
                </p>
                <p className="shrink-0 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  {selectedImageIndex + 1}/{product.images.length}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {product.images.map((image, index) => (
              <button
                className={`rounded-2xl border px-3 py-3 text-left transition ${
                  selectedImageIndex === index
                    ? 'border-emerald-700 bg-emerald-50 shadow-sm'
                    : 'border-stone-200 bg-white hover:border-emerald-200'
                }`}
                key={image.storagePath}
                onClick={() => setSelectedImageIndex(index)}
                type="button"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  {image.label}
                </p>
                <p className="mt-1 text-sm text-stone-500">{product.unit}</p>
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {['Đổi trả trong 30 ngày', 'Cam kết chính hãng', 'Miễn phí giao hàng từ 500.000đ'].map(
              (item) => (
                <div
                  className="rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-700"
                  key={item}
                >
                  {item}
                </div>
              ),
            )}
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              Chính hãng
            </span>
            <span className="rounded-full border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700">
              {product.badge}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-bold leading-tight text-stone-900">{product.name}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-stone-600">
            <span>{product.sku}</span>
            <span className="text-amber-500">&#9733; {product.rating.toFixed(1)}</span>
            <span>{product.reviewCount} đánh giá</span>
            <span>{product.commentCount} bình luận</span>
          </div>

          <p className="mt-5 text-4xl font-bold text-emerald-700">
            {formatPrice(product.price)}
            <span className="ml-2 text-2xl font-medium text-stone-500">/ {product.unit}</span>
          </p>

          <div className="mt-6 space-y-5">
            <div className="flex flex-wrap items-center gap-4">
              <p className="text-sm font-medium text-stone-700">Chọn đơn vị tính</p>
              <span className="rounded-full border border-emerald-700 px-4 py-2 font-semibold text-emerald-700">
                {product.unit}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <p className="text-sm font-medium text-stone-700">Chọn số lượng</p>
              <QuantitySelector onChange={setQuantity} quantity={quantity} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <AddToCartButton
                className="rounded-full bg-amber-500 px-5 py-4 text-lg font-semibold text-white hover:bg-amber-600 disabled:opacity-60"
                label="Chọn mua"
                productSlug={product.slug}
                quantity={quantity}
              />
              <button
                className="rounded-full bg-emerald-50 px-5 py-4 text-lg font-semibold text-emerald-700 hover:bg-emerald-100"
                type="button"
              >
                Tìm nhà thuốc
              </button>
            </div>
          </div>

          <p className="mt-6 text-base leading-7 text-stone-700">{product.shortDescription}</p>

          <div className="mt-8 grid gap-x-6 gap-y-4 border-t border-stone-200 pt-6 sm:grid-cols-[160px_minmax(0,1fr)]">
            <p className="font-medium text-stone-700">Tên chính hãng</p>
            <p className="text-stone-900">{product.officialName}</p>
            <p className="font-medium text-stone-700">Số đăng ký</p>
            <div>
              <p className="text-stone-900">{product.registrationNumber}</p>
              <p className="mt-1 text-sm text-emerald-700">Xem giấy công bố sản phẩm</p>
            </div>
            <p className="font-medium text-stone-700">Thành phần</p>
            <p className="text-stone-900">{product.ingredientHighlight}</p>
            <p className="font-medium text-stone-700">Dạng bào chế</p>
            <p className="text-stone-900">{product.form}</p>
            <p className="font-medium text-stone-700">Quy cách</p>
            <p className="text-stone-900">{product.specification}</p>
            <p className="font-medium text-stone-700">Danh mục</p>
            <p className="text-emerald-700">{product.subCategory}</p>
            <p className="font-medium text-stone-700">Nhà sản xuất</p>
            <p className="text-stone-900">{product.manufacturer}</p>
            <p className="font-medium text-stone-700">Nước sản xuất</p>
            <p className="text-stone-900">{product.countryOfOrigin}</p>
            <p className="font-medium text-stone-700">Hạn sử dụng</p>
            <p className="text-stone-900">{product.shelfLife}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
