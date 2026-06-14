'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SITE_NAME } from '@/config/site'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirm) {
      setError('Mật khẩu xác nhận không khớp')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone || undefined,
          password: form.password,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Đăng ký thất bại')
        return
      }

      router.push('/')
      router.refresh()
    } catch {
      setError('Lỗi kết nối, vui lòng thử lại')
    } finally {
      setLoading(false)
    }
  }

  function field(id: keyof typeof form) {
    return {
      value: form[id],
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((f) => ({ ...f, [id]: e.target.value })),
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.26em] text-emerald-600">Nhà thuốc</p>
          <Link className="text-3xl font-black tracking-tight text-emerald-900" href="/">
            {SITE_NAME}
          </Link>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-stone-100 bg-white shadow-xl shadow-emerald-100/40">
          <div className="bg-gradient-to-r from-emerald-700 to-teal-600 px-6 py-5 text-white">
            <h1 className="text-xl font-black">Tạo tài khoản</h1>
            <p className="mt-1 text-sm text-emerald-100/80">Đăng ký để theo dõi đơn hàng</p>
          </div>

          <form className="p-6" onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-stone-700" htmlFor="fullName">
                  Họ và tên
                </label>
                <input
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  id="fullName"
                  placeholder="Nguyễn Văn A"
                  required
                  type="text"
                  {...field('fullName')}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-stone-700" htmlFor="email">
                  Email
                </label>
                <input
                  autoComplete="email"
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  id="email"
                  placeholder="email@example.com"
                  required
                  type="email"
                  {...field('email')}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-stone-700" htmlFor="phone">
                  Số điện thoại <span className="font-normal text-stone-400">(tùy chọn)</span>
                </label>
                <input
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  id="phone"
                  placeholder="0900 123 456"
                  type="tel"
                  {...field('phone')}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-stone-700" htmlFor="password">
                  Mật khẩu
                </label>
                <input
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  id="password"
                  minLength={6}
                  placeholder="Tối thiểu 6 ký tự"
                  required
                  type="password"
                  {...field('password')}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-stone-700" htmlFor="confirm">
                  Xác nhận mật khẩu
                </label>
                <input
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  id="confirm"
                  placeholder="Nhập lại mật khẩu"
                  required
                  type="password"
                  {...field('confirm')}
                />
              </div>
            </div>

            <button
              className="mt-6 w-full rounded-xl bg-emerald-700 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:opacity-60"
              disabled={loading}
              type="submit"
            >
              {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
            </button>

            <p className="mt-4 text-center text-sm text-stone-500">
              Đã có tài khoản?{' '}
              <Link className="font-semibold text-emerald-700 hover:underline" href="/auth/login">
                Đăng nhập
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
