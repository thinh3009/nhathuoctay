'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

const ROLE_OPTIONS = [
  { value: 'customer', label: 'Khách hàng' },
  { value: 'pharmacist', label: 'Dược sĩ' },
  { value: 'admin', label: 'Quản trị viên' },
] as const

export default function CreateUserForm() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const form = event.currentTarget
    const data = new FormData(form)
    const payload = {
      fullName: String(data.get('fullName') ?? ''),
      email: String(data.get('email') ?? ''),
      phone: String(data.get('phone') ?? ''),
      password: String(data.get('password') ?? ''),
      role: String(data.get('role') ?? 'customer'),
    }

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await response.json()

      if (!response.ok) {
        setError(result.error ?? 'Không tạo được tài khoản')
        return
      }

      form.reset()
      setIsOpen(false)
      router.refresh()
    } catch {
      setError('Lỗi kết nối, vui lòng thử lại')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        className="rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-800"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        + Tạo tài khoản
      </button>
    )
  }

  return (
    <form
      className="w-full rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
      onSubmit={handleSubmit}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-stone-900">Tạo tài khoản mới</h2>
        <button
          className="text-sm text-stone-400 hover:text-stone-600"
          onClick={() => {
            setIsOpen(false)
            setError(null)
          }}
          type="button"
        >
          Hủy
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <input
          className="rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
          name="fullName"
          placeholder="Họ và tên"
          required
        />
        <input
          className="rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
          name="email"
          placeholder="Email"
          type="email"
          required
        />
        <input
          className="rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
          name="phone"
          placeholder="Số điện thoại (tùy chọn)"
        />
        <input
          className="rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
          name="password"
          placeholder="Mật khẩu (tối thiểu 6 ký tự)"
          type="password"
          required
        />
        <select
          className="rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
          defaultValue="pharmacist"
          name="role"
        >
          {ROLE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {error ? <p className="mt-3 text-sm font-medium text-red-600">{error}</p> : null}

      <button
        className="mt-4 rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-800 disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? 'Đang tạo...' : 'Tạo tài khoản'}
      </button>
    </form>
  )
}
