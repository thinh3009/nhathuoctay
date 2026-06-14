import Link from 'next/link'
import AnimateIn from '@/components/ui/AnimateIn'

type PromoItem = {
  title: string
  description: string
  badge: string
  href: string
  ctaLabel: string
}

type LandingPromoStripProps = {
  items: PromoItem[]
}

const GRADIENTS = [
  'from-emerald-700 via-green-600 to-teal-500',
  'from-teal-700 via-emerald-600 to-green-500',
  'from-green-800 via-teal-700 to-emerald-500',
]

export default function LandingPromoStrip({ items }: LandingPromoStripProps) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-stone-100 bg-white px-4 py-5 shadow-sm sm:rounded-[32px] sm:px-5 sm:py-6">
      <div className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2" style={{ scrollbarWidth: 'none' }}>
        {items.map((item, index) => (
          <AnimateIn
            delay={index * 80}
            key={item.title}
            tag="article"
            variant="scale"
            className={`relative min-w-[300px] flex-shrink-0 snap-start overflow-hidden rounded-[24px] px-6 py-6 text-white shadow-lg sm:min-w-[340px] bg-gradient-to-br ${GRADIENTS[index % GRADIENTS.length]}`}
          >
            {/* Decorative circle */}
            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute -bottom-6 right-10 h-20 w-20 rounded-full bg-white/8" />

            <span className="relative inline-flex rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
              {item.badge}
            </span>

            <h2 className="relative mt-4 text-2xl font-black leading-tight tracking-tight">
              {item.title}
            </h2>

            <p className="relative mt-2 max-w-xs text-sm leading-6 text-white/80">
              {item.description}
            </p>

            <Link
              className="relative mt-5 inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-emerald-800 shadow-md transition-all duration-200 hover:scale-[1.04] hover:bg-emerald-50 hover:shadow-lg active:scale-95"
              href={item.href}
            >
              {item.ctaLabel}
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                <path d="m9 18 6-6-6-6" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
              </svg>
            </Link>
          </AnimateIn>
        ))}
      </div>
    </section>
  )
}
