'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { SITE_NAME } from '@/config/site'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') ?? '/'

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Đăng nhập thất bại')
        return
      }

      router.push(from)
      router.refresh()
    } catch {
      setError('Lỗi kết nối, vui lòng thử lại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.26em] text-emerald-600">Nhà thuốc</p>
          <Link className="text-3xl font-black tracking-tight text-emerald-900" href="/">
            {SITE_NAME}
          </Link>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-stone-100 bg-white shadow-xl shadow-emerald-100/40">
          <div className="bg-gradient-to-r from-emerald-700 to-teal-600 px-6 py-5 text-white">
            <h1 className="text-xl font-black">Đăng nhập</h1>
            <p className="mt-1 text-sm text-emerald-100/80">Chào mừng bạn trở lại</p>
          </div>

          <form className="p-6" onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-stone-700" htmlFor="email">
                  Email
                </label>
                <input
                  autoComplete="email"
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  id="email"
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="email@example.com"
                  required
                  type="email"
                  value={form.email}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-stone-700" htmlFor="password">
                  Mật khẩu
                </label>
                <input
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  id="password"
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  required
                  type="password"
                  value={form.password}
                />
              </div>
            </div>

            <button
              className="mt-6 w-full rounded-xl bg-emerald-700 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:opacity-60"
              disabled={loading}
              type="submit"
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>

            <p className="mt-4 text-center text-sm text-stone-500">
              Chưa có tài khoản?{' '}
              <Link className="font-semibold text-emerald-700 hover:underline" href="/auth/register">
                Đăng ký ngay
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
