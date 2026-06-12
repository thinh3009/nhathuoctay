import Link from 'next/link'

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
      <svg className="h-9 w-9 text-emerald-700" fill="none" viewBox="0 0 24 24">
        <rect x="5" y="6" width="14" height="12" rx="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M9 11h6M12 8v6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
    )
  }

  if (icon === 'advisor') {
    return (
      <svg className="h-9 w-9 text-emerald-700" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="3.3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M6 19a6 6 0 0 1 12 0" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        <path d="M16.5 10.5 18 12l2.5-2.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
    )
  }

  if (icon === 'note') {
    return (
      <svg className="h-9 w-9 text-emerald-700" fill="none" viewBox="0 0 24 24">
        <rect x="6" y="4" width="12" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M9 9h6M9 13h6M9 17h4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
    )
  }

  if (icon === 'pin') {
    return (
      <svg className="h-9 w-9 text-emerald-700" fill="none" viewBox="0 0 24 24">
        <path d="M12 20s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    )
  }

  if (icon === 'vaccine') {
    return (
      <svg className="h-9 w-9 text-emerald-700" fill="none" viewBox="0 0 24 24">
        <path d="m8 9 7 7M14 6l4 4M7 10l2-2 7 7-2 2a3 3 0 0 1-4.2 0l-2.8-2.8A3 3 0 0 1 7 10Z" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    )
  }

  return (
    <svg className="h-9 w-9 text-emerald-700" fill="none" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="m16 16 4 4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <path d="M9 11h4M11 9v4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  )
}

export default function LandingShortcutGrid({ items }: LandingShortcutGridProps) {
  return (
    <section className="rounded-[28px] bg-[#eef3ff] px-4 py-5 shadow-sm sm:px-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <Link
            className="flex min-h-[148px] flex-col items-center justify-center rounded-[24px] bg-white px-4 py-5 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            href={item.href}
            key={item.title}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
              <ShortcutIcon icon={item.icon} />
            </div>
            <p className="mt-4 text-xl font-bold leading-tight text-stone-900">{item.title}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
