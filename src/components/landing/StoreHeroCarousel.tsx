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
    <section className="overflow-hidden rounded-[28px] bg-gradient-to-br from-sky-300 via-cyan-200 to-emerald-100 px-4 py-4 shadow-lg shadow-cyan-100 sm:rounded-[32px] sm:p-6 lg:p-8">
      <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
        <div>
          <div className="inline-flex rounded-full bg-white/80 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-800 sm:px-4 sm:text-xs">
            {activeSlide.eyebrow}
          </div>
          <h1 className="mt-4 max-w-4xl text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            {activeSlide.title}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-600 sm:text-base sm:leading-8">
            {activeSlide.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              className="rounded-full bg-fuchsia-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-fuchsia-700"
              href={activeSlide.primaryCta.href}
            >
              {activeSlide.primaryCta.label}
            </Link>
            <Link
              className="rounded-full border border-white/70 bg-white/80 px-5 py-3 text-sm font-semibold text-emerald-800 transition hover:border-white hover:bg-white"
              href={activeSlide.secondaryCta.href}
            >
              {activeSlide.secondaryCta.label}
            </Link>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {activeSlide.stats.map((stat) => (
              <article className="rounded-[22px] bg-white/80 px-4 py-4 shadow-sm backdrop-blur" key={stat.label}>
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
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/85 text-emerald-700 transition hover:bg-white"
                  onClick={goPrevious}
                  type="button"
                >
                  ‹
                </button>
                <button
                  aria-label="Xem slide tiếp theo"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/85 text-emerald-700 transition hover:bg-white"
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
