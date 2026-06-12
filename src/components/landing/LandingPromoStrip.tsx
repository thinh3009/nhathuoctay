import Link from 'next/link'

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

export default function LandingPromoStrip({ items }: LandingPromoStripProps) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-emerald-100 bg-white px-4 py-4 shadow-sm shadow-emerald-100 sm:px-5">
      <div className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-1">
        {items.map((item, index) => (
          <article
            className={`min-w-[280px] snap-start rounded-[26px] px-5 py-5 text-white shadow-md sm:min-w-[320px] ${
              index % 3 === 0
                ? 'bg-gradient-to-r from-emerald-700 via-green-600 to-lime-500'
                : index % 3 === 1
                  ? 'bg-gradient-to-r from-teal-700 via-emerald-600 to-green-500'
                  : 'bg-gradient-to-r from-green-800 via-emerald-700 to-teal-500'
            }`}
            key={item.title}
          >
            <p className="inline-flex rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90">
              {item.badge}
            </p>
            <h2 className="mt-4 text-2xl font-black leading-tight">{item.title}</h2>
            <p className="mt-2 max-w-xs text-sm leading-6 text-white/85">{item.description}</p>
            <Link
              className="mt-5 inline-flex rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
              href={item.href}
            >
              {item.ctaLabel}
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
