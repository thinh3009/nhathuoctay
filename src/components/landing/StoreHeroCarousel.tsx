'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Product } from '@/lib/schemas'
import StoreHeroVisual from './StoreHeroVisual'

type StoreHeroSlide = {
  eyebrow: string
  title: string
  description: string
  primaryCta: {
    label: string
    href: string
  }
  secondaryCta: {
    label: string
    href: string
  }
  stats: Array<{
    label: string
    value: string
    description: string
  }>
  products: Product[]
}

type StoreHeroCarouselProps = {
  slides: StoreHeroSlide[]
  autoPlayMs?: number
}

export default function StoreHeroCarousel({
  slides,
  autoPlayMs = 5500,
}: StoreHeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) {
      return
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length)
    }, autoPlayMs)

    return () => window.clearInterval(timer)
  }, [autoPlayMs, slides.length])

  const activeSlide = slides[activeIndex]

  if (!activeSlide) {
    return null
  }

  function goTo(index: number) {
    setActiveIndex(index)
  }

  function goPrevious() {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length)
  }

  function goNext() {
    setActiveIndex((current) => (current + 1) % slides.length)
  }

  return (
    <section className="overflow-hidden rounded-[28px] border border-emerald-100 bg-gradient-to-br from-white via-emerald-50 to-lime-50 px-5 py-6 shadow-sm shadow-emerald-100 sm:rounded-[32px] sm:p-8 lg:p-10">
      <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
        <div>
          <div className="inline-flex rounded-full bg-emerald-700 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white sm:px-4 sm:text-xs">
            {activeSlide.eyebrow}
          </div>
          <h1 className="mt-4 max-w-4xl text-3xl font-black tracking-tight text-stone-950 sm:text-4xl lg:text-5xl">
            {activeSlide.title}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-600 sm:text-base sm:leading-8">
            {activeSlide.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              className="rounded-full bg-amber-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-600"
              href={activeSlide.primaryCta.href}
            >
              {activeSlide.primaryCta.label}
            </Link>
            <Link
              className="rounded-full border border-emerald-300 bg-white px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:border-emerald-500 hover:bg-emerald-50"
              href={activeSlide.secondaryCta.href}
            >
              {activeSlide.secondaryCta.label}
            </Link>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {activeSlide.stats.map((stat) => (
              <article className="rounded-[22px] bg-white px-4 py-4 shadow-sm" key={stat.label}>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  {stat.label}
                </p>
                <p className="mt-2 text-2xl font-black text-stone-900 sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-sm leading-6 text-stone-600">{stat.description}</p>
              </article>
            ))}
          </div>

          {slides.length > 1 ? (
            <div className="mt-5 flex items-center gap-3">
              <div className="flex items-center gap-2">
                {slides.map((slide, index) => (
                  <button
                    aria-label={`Chuyển tới slide ${index + 1}`}
                    className={`h-2.5 rounded-full transition ${
                      activeIndex === index ? 'w-7 bg-emerald-700' : 'w-2.5 bg-emerald-200'
                    }`}
                    key={slide.title}
                    onClick={() => goTo(index)}
                    type="button"
                  />
                ))}
              </div>

              <div className="ml-auto flex gap-2">
                <button
                  aria-label="Xem slide trước"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-200 bg-white text-emerald-700 transition hover:bg-emerald-50"
                  onClick={goPrevious}
                  type="button"
                >
                  ‹
                </button>
                <button
                  aria-label="Xem slide tiếp theo"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-200 bg-white text-emerald-700 transition hover:bg-emerald-50"
                  onClick={goNext}
                  type="button"
                >
                  ›
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <StoreHeroVisual products={activeSlide.products} />
      </div>
    </section>
  )
}
