'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Product } from '@/lib/schemas'
import StoreHeroVisual from './StoreHeroVisual'

type StoreHeroSlide = {
  eyebrow: string
  title: string
  description: string
  primaryCta: { label: string; href: string }
  secondaryCta: { label: string; href: string }
  stats: Array<{ label: string; value: string; description: string }>
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
  const [animKey, setAnimKey] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return

    const timer = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % slides.length)
      setAnimKey((k) => k + 1)
    }, autoPlayMs)

    return () => window.clearInterval(timer)
  }, [autoPlayMs, slides.length])

  const slide = slides[activeIndex]
  if (!slide) return null

  function goTo(index: number) {
    setActiveIndex(index)
    setAnimKey((k) => k + 1)
  }

  function goPrev() {
    setActiveIndex((i) => (i - 1 + slides.length) % slides.length)
    setAnimKey((k) => k + 1)
  }

  function goNext() {
    setActiveIndex((i) => (i + 1) % slides.length)
    setAnimKey((k) => k + 1)
  }

  return (
    <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-800 px-5 py-7 shadow-2xl shadow-emerald-900/25 sm:rounded-[32px] sm:px-8 sm:py-10 lg:px-12 lg:py-14">
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-teal-400/10 blur-3xl" />
        <div className="absolute left-1/3 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-lime-400/5 blur-2xl" />
      </div>

      <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-14">
        {/* ── Text side ── */}
        <div key={animKey} className="anim-slide-left order-2 lg:order-1">
          {/* Eyebrow tag */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-4 py-1.5 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-300">
              {slide.eyebrow}
            </span>
          </div>

          {/* Headline */}
          <h1 className="mt-5 text-[2rem] font-black leading-[1.15] tracking-tight text-white sm:text-4xl lg:text-5xl">
            {slide.title}
          </h1>

          {/* Description */}
          <p className="mt-4 max-w-lg text-sm leading-7 text-emerald-100/75 sm:text-base sm:leading-8">
            {slide.description}
          </p>

          {/* CTAs */}
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-emerald-900 shadow-lg shadow-white/10 transition-all duration-200 hover:scale-[1.03] hover:bg-emerald-50 hover:shadow-xl active:scale-95"
              href={slide.primaryCta.href}
            >
              {slide.primaryCta.label}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                <path d="m9 18 6-6-6-6" stroke="currentColor" strokeLinecap="round" strokeWidth="2.2" />
              </svg>
            </Link>
            <Link
              className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/18 hover:border-white/35"
              href={slide.secondaryCta.href}
            >
              {slide.secondaryCta.label}
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-3 gap-3">
            {slide.stats.map((stat, i) => (
              <div
                className="rounded-2xl border border-white/10 bg-white/8 px-3 py-3.5 backdrop-blur-sm sm:px-4 sm:py-4"
                key={stat.label}
                style={{ animationDelay: `${0.1 + i * 0.06}s` }}
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-400">
                  {stat.label}
                </p>
                <p className="mt-1.5 text-xl font-black text-white sm:text-2xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-[11px] leading-5 text-emerald-100/60">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>

          {/* Slide nav */}
          {slides.length > 1 && (
            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center gap-2">
                {slides.map((s, i) => (
                  <button
                    aria-label={`Slide ${i + 1}`}
                    className="relative h-2 overflow-hidden rounded-full bg-white/20 transition-all duration-300"
                    key={s.eyebrow}
                    onClick={() => goTo(i)}
                    style={{ width: i === activeIndex ? 32 : 8 }}
                    type="button"
                  >
                    {i === activeIndex && (
                      <span
                        className="absolute inset-y-0 left-0 rounded-full bg-white"
                        key={animKey}
                        style={{
                          animation: `slideProgress ${autoPlayMs}ms linear both`,
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>

              <div className="ml-auto flex gap-2">
                <button
                  aria-label="Slide trước"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 active:scale-90"
                  onClick={goPrev}
                  type="button"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <path d="m15 18-6-6 6-6" stroke="currentColor" strokeLinecap="round" strokeWidth="2.2" />
                  </svg>
                </button>
                <button
                  aria-label="Slide tiếp"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 active:scale-90"
                  onClick={goNext}
                  type="button"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <path d="m9 18 6-6-6-6" stroke="currentColor" strokeLinecap="round" strokeWidth="2.2" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Visual side ── */}
        <div
          className="anim-scale-up order-1 lg:order-2"
          key={`v-${animKey}`}
          style={{ animationDelay: '0.12s' }}
        >
          <StoreHeroVisual products={slide.products} />
        </div>
      </div>
    </section>
  )
}
