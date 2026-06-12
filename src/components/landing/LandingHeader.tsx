import Link from 'next/link'

const navItems = [
  { label: 'Kiến trúc', href: '#kien-truc' },
  { label: 'SEO', href: '#seo' },
  { label: 'Redirect', href: '#redirect' },
  { label: 'Triển khai', href: '#trien-khai' },
]

export default function LandingHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-emerald-100/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
            Next.js Architecture
          </p>
          <Link className="mt-1 block text-xl font-bold text-stone-900 sm:text-2xl" href="/">
            Landing Page tối ưu SEO và Redirect
          </Link>
        </div>

        <nav className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => (
            <Link
              className="rounded-full px-4 py-2 text-sm font-medium text-stone-600 transition hover:bg-emerald-50 hover:text-emerald-700"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
          <Link
            className="rounded-full bg-amber-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
            href="#trien-khai"
          >
            Xem blueprint
          </Link>
        </nav>
      </div>
    </header>
  )
}
