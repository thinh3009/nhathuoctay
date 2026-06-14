import Link from 'next/link'
import AnimateIn from '@/components/ui/AnimateIn'

type ShortcutItem = {
  title: string
  href: string
  icon: 'pill' | 'advisor' | 'note' | 'pin' | 'vaccine' | 'lookup'
}

type LandingShortcutGridProps = {
  items: ShortcutItem[]
}

function ShortcutIcon({ icon }: { icon: ShortcutItem['icon'] }) {
  if (icon === 'pill') {
    return (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24">
        <rect height="12" rx="6" stroke="currentColor" strokeWidth="1.8" width="14" x="5" y="6" />
        <path d="M9 12h6M12 9v6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
    )
  }
  if (icon === 'advisor') {
    return (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24">
        <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M3 19a6 6 0 0 1 12 0" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        <path d="m17 10 1.5 1.5L21 9" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        <circle cx="19" cy="7" r="3" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    )
  }
  if (icon === 'note') {
    return (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24">
        <rect height="16" rx="2.5" stroke="currentColor" strokeWidth="1.8" width="12" x="6" y="4" />
        <path d="M9 9h6M9 13h6M9 17h4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
    )
  }
  if (icon === 'pin') {
    return (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24">
        <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    )
  }
  if (icon === 'vaccine') {
    return (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24">
        <path d="m8 9 7 7M15 6l4 4M7 10l2-2 7 7-2 2a3 3 0 0 1-4.2 0L7 14.8A3 3 0 0 1 7 10Z" stroke="currentColor" strokeWidth="1.8" />
        <path d="m3 21 3.5-3.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
    )
  }
  return (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="m16 16 4.5 4.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <path d="M9 11h4M11 9v4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  )
}

export default function LandingShortcutGrid({ items }: LandingShortcutGridProps) {
  return (
    <section className="overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-50 to-emerald-50/60 px-4 py-5 shadow-sm sm:rounded-[32px] sm:px-5 sm:py-6">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {items.map((item, i) => (
          <AnimateIn delay={i * 55} key={item.title} variant="scale">
            <Link
              className="group flex min-h-[136px] flex-col items-center justify-center rounded-[22px] bg-white px-3 py-5 text-center shadow-sm transition-all duration-250 hover:-translate-y-1 hover:shadow-md hover:shadow-emerald-100/80 sm:rounded-[24px]"
              href={item.href}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 transition-colors duration-200 group-hover:bg-emerald-100 group-hover:text-emerald-800">
                <ShortcutIcon icon={item.icon} />
              </div>
              <p className="mt-3.5 text-[13px] font-bold leading-tight text-stone-800">
                {item.title}
              </p>
            </Link>
          </AnimateIn>
        ))}
      </div>
    </section>
  )
}
