'use client'

import { useState } from 'react'
import { formatPrice } from '@/lib/catalog'
import type { Product } from '@/lib/schemas'
import AddToCartButton from './AddToCartButton'
import ProductVisual from './ProductVisual'
import QuantitySelector from './QuantitySelector'

type ProductDetailHeroProps = {
  product: Product
}

export default function ProductDetailHero({ product }: ProductDetailHeroProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(product.defaultQuantity)

  return (
    <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm">
            <div className="grid min-h-[430px] gap-6 sm:grid-cols-[1fr_1.05fr]">
              <div className="flex items-end justify-center">
                <div className="relative h-72 w-32 rounded-[2rem] border border-slate-200 bg-white shadow-lg">
                  <div className="absolute left-4 right-4 top-5 rounded-full bg-slate-100 px-2 py-1 text-center text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                    {product.unit}
                  </div>
                  <div className="absolute inset-x-4 top-16 rounded-xl bg-cyan-50 px-3 py-4 text-center shadow-sm">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-cyan-700">
                      {product.topCategory}
                    </p>
                    <p className="mt-2 text-lg font-bold leading-tight text-slate-950">{product.name}</p>
                  </div>
                  <div className="absolute bottom-6 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-cyan-700 text-xs font-bold text-white">
                    {product.unit}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="relative h-80 w-full max-w-[280px] rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">
                  <div className="inline-flex rounded-full bg-cyan-700 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                    {product.images[selectedImageIndex]}
                  </div>
                  <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-slate-500">
                    {product.manufacturer}
                  </p>
                  <h3 className="mt-2 text-4xl font-bold leading-none text-slate-950">
                    {product.name.split(' ')[0]}
                  </h3>
                  <p className="mt-1 text-xl font-semibold text-slate-800">
                    {product.name.split(' ').slice(1).join(' ')}
                  </p>
                  <div className="mt-8 inline-flex rounded-full bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700">
                    {product.ingredientHighlight}
                  </div>
                  <div className="absolute bottom-5 left-5 right-5 rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-xs text-slate-500">Quy cách</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{product.specification}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
            {product.images.map((imageLabel, index) => (
              <button key={imageLabel} onClick={() => setSelectedImageIndex(index)} type="button">
                <ProductVisual
                  active={selectedImageIndex === index}
                  imageLabel={imageLabel}
                  product={product}
                  variant="thumb"
                />
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {['Đổi trả trong 30 ngày', 'Cam kết chính hãng', 'Miễn phí giao hàng từ 500.000đ'].map((item) => (
              <div
                className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
                key={item}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600">
              Chính hãng
            </span>
            <span className="rounded-full border border-cyan-200 px-3 py-1 text-xs font-semibold text-cyan-700">
              {product.badge}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-bold leading-tight text-slate-950">{product.name}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <span>{product.sku}</span>
            <span className="text-amber-500">&#9733; {product.rating.toFixed(1)}</span>
            <span>{product.reviewCount} đánh giá</span>
            <span>{product.commentCount} bình luận</span>
          </div>

          <p className="mt-5 text-4xl font-bold text-cyan-700">
            {formatPrice(product.price)}
            <span className="ml-2 text-2xl font-medium text-slate-500">/ {product.unit}</span>
          </p>

          <div className="mt-6 space-y-5">
            <div className="flex flex-wrap items-center gap-4">
              <p className="text-sm font-medium text-slate-700">Chọn đơn vị tính</p>
              <span className="rounded-full border border-cyan-700 px-4 py-2 font-semibold text-cyan-700">
                {product.unit}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <p className="text-sm font-medium text-slate-700">Chọn số lượng</p>
              <QuantitySelector onChange={setQuantity} quantity={quantity} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <AddToCartButton
                className="rounded-full bg-cyan-700 px-5 py-4 text-lg font-semibold text-white hover:bg-cyan-800 disabled:opacity-60"
                label="Chọn mua"
                productSlug={product.slug}
                quantity={quantity}
              />
              <button
                className="rounded-full bg-slate-100 px-5 py-4 text-lg font-semibold text-cyan-700 hover:bg-slate-200"
                type="button"
              >
                Tìm nhà thuốc
              </button>
            </div>
          </div>

          <p className="mt-6 text-base leading-7 text-slate-700">{product.shortDescription}</p>

          <div className="mt-8 grid gap-x-6 gap-y-4 border-t border-slate-200 pt-6 sm:grid-cols-[160px_minmax(0,1fr)]">
            <p className="font-medium text-slate-700">Tên chính hãng</p>
            <p className="text-slate-950">{product.officialName}</p>
            <p className="font-medium text-slate-700">Số đăng ký</p>
            <div>
              <p className="text-slate-950">{product.registrationNumber}</p>
              <p className="mt-1 text-sm text-cyan-700">Xem giấy công bố sản phẩm</p>
            </div>
            <p className="font-medium text-slate-700">Thành phần</p>
            <p className="text-slate-950">{product.ingredientHighlight}</p>
            <p className="font-medium text-slate-700">Dạng bào chế</p>
            <p className="text-slate-950">{product.form}</p>
            <p className="font-medium text-slate-700">Quy cách</p>
            <p className="text-slate-950">{product.specification}</p>
            <p className="font-medium text-slate-700">Danh mục</p>
            <p className="text-cyan-700">{product.subCategory}</p>
            <p className="font-medium text-slate-700">Nhà sản xuất</p>
            <p className="text-slate-950">{product.manufacturer}</p>
            <p className="font-medium text-slate-700">Nước sản xuất</p>
            <p className="text-slate-950">{product.countryOfOrigin}</p>
            <p className="font-medium text-slate-700">Hạn sử dụng</p>
            <p className="text-slate-950">{product.shelfLife}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
