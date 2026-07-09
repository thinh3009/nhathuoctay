'use client'

import { useRef } from 'react'
import type { Product } from '@/features/products/types'
import ProductCard from './ProductCard'

type RelatedProductsSectionProps = {
  products: Product[]
}

export default function RelatedProductsSection({ products }: RelatedProductsSectionProps) {
  const trackRef = useRef<HTMLDivElement | null>(null)

  function scrollTrack(direction: 'previous' | 'next') {
    const track = trackRef.current

    if (!track) {
      return
    }

    const card = track.querySelector<HTMLElement>('[data-related-card="true"]')
    const scrollAmount = card ? card.offsetWidth + 16 : Math.max(track.clientWidth * 0.82, 260)

    track.scrollBy({
      left: direction === 'next' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    })
  }

  return (
    <section className="mt-8 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm shadow-emerald-100/60">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Gợi ý mua thêm</p>
          <h2 className="mt-1 text-2xl font-bold text-stone-900">Sản phẩm liên quan</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            aria-label="Xem sản phẩm liên quan trước"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-lg font-bold text-stone-700 transition hover:border-emerald-300 hover:text-emerald-700"
            onClick={() => scrollTrack('previous')}
            type="button"
          >
            ‹
          </button>
          <button
            aria-label="Xem sản phẩm liên quan tiếp theo"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-lg font-bold text-stone-700 transition hover:border-emerald-300 hover:text-emerald-700"
            onClick={() => scrollTrack('next')}
            type="button"
          >
            ›
          </button>
        </div>
      </div>

      <div
        className="mt-6 flex snap-x snap-proximity scroll-smooth gap-4 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        ref={trackRef}
      >
        {products.map((product) => (
          <div
            className="min-w-[78%] shrink-0 snap-start sm:min-w-[320px] lg:min-w-[290px] xl:min-w-[275px]"
            data-related-card="true"
            key={product.slug}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  )
}
