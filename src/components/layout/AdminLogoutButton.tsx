'use client'

import { useRouter } from 'next/navigation'

export default function AdminLogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <button
      className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-red-300 transition hover:bg-red-900/30 hover:text-red-200"
      onClick={handleLogout}
      type="button"
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
      Đăng xuất
    </button>
  )
}
