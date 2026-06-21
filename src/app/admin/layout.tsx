import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'
import { SITE_NAME } from '@/config/site'
import AdminLogoutButton from './_components/AdminLogoutButton'

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: 'grid' },
  { href: '/admin/products', label: 'Sản phẩm', icon: 'box' },
  { href: '/admin/categories', label: 'Danh mục', icon: 'tag' },
  { href: '/admin/orders', label: 'Đơn hàng', icon: 'receipt' },
  { href: '/admin/articles', label: 'Bài viết', icon: 'pen' },
  { href: '/admin/users', label: 'Người dùng', icon: 'users' },
] as const

function NavIcon({ name }: { name: string }) {
  if (name === 'grid') return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <rect height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" width="7" x="3" y="3" />
      <rect height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" width="7" x="14" y="3" />
      <rect height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" width="7" x="3" y="14" />
      <rect height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" width="7" x="14" y="14" />
    </svg>
  )
  if (name === 'box') return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="m3.27 6.96 8.73 5.04 8.73-5.04M12 22.08V12" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
  if (name === 'tag') return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="7" cy="7" fill="currentColor" r="1.5" />
    </svg>
  )
  if (name === 'users') return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
  if (name === 'pen') return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M12 20h9" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  )
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser()
  if (!user || user.role !== 'admin') {
    redirect('/')
  }

  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-emerald-950 text-white shadow-2xl">
        <div className="border-b border-emerald-800 px-6 py-5">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-400">Admin</p>
          <p className="mt-0.5 text-xl font-black tracking-tight">{SITE_NAME}</p>
        </div>

        <nav className="flex-1 px-3 py-4">
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-emerald-100/70 transition hover:bg-emerald-800 hover:text-white"
                href={item.href}
                key={item.href}
              >
                <NavIcon name={item.icon} />
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="border-t border-emerald-800 p-4">
          <div className="mb-3 rounded-xl bg-emerald-900 px-3 py-2.5">
            <p className="text-xs font-semibold text-emerald-300">Đăng nhập với tư cách</p>
            <p className="mt-0.5 truncate text-sm font-bold text-white">{user.email}</p>
          </div>
          <AdminLogoutButton />
          <Link
            className="mt-2 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-emerald-100/70 transition hover:bg-emerald-800 hover:text-white"
            href="/"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" stroke="currentColor" strokeWidth="1.8" />
            </svg>
            Về trang chủ
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
