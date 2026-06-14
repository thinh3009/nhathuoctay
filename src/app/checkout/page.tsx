'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { SITE_NAME } from '@/config/site'

type CartItem = {
  slug: string
  name: string
  price: number
  quantity: number
  image?: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    addressLine: '',
    ward: '',
    district: '',
    city: '',
    note: '',
    paymentMethod: 'cod' as 'cod' | 'bank_transfer',
  })

  useEffect(() => {
    fetch('/api/cart')
      .then((r) => r.json())
      .then((data) => {
        setItems(data.items ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingFee = subtotal >= 500000 ? 0 : 30000
  const total = subtotal + shippingFee

  function formatPrice(n: number) {
    return n.toLocaleString('vi-VN') + '₫'
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (items.length === 0) {
      setError('Giỏ hàng trống')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingAddress: {
            fullName: form.fullName,
            phone: form.phone,
            addressLine: form.addressLine,
            ward: form.ward || undefined,
            district: form.district || undefined,
            city: form.city,
          },
          paymentMethod: form.paymentMethod,
          note: form.note || undefined,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Đặt hàng thất bại')
        return
      }

      router.push(`/checkout/success?order=${data.orderNumber}`)
    } catch {
      setError('Lỗi kết nối, vui lòng thử lại')
    } finally {
      setSubmitting(false)
    }
  }

  function f(key: keyof typeof form) {
    return {
      value: form[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm((prev) => ({ ...prev, [key]: e.target.value })),
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-stone-400">Đang tải...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <Link className="text-xl font-black text-emerald-900" href="/">{SITE_NAME}</Link>
          <span className="text-stone-300">/</span>
          <span className="text-stone-600">Thanh toán</span>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8">
        <form className="grid gap-6 lg:grid-cols-[1fr_380px]" onSubmit={handleSubmit}>
          {/* Left: address + payment */}
          <div className="space-y-5">
            <div className="rounded-2xl border border-stone-200 bg-white p-6">
              <h2 className="mb-5 text-lg font-black text-stone-900">Địa chỉ giao hàng</h2>
              <div className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <InputField label="Họ và tên *" placeholder="Nguyễn Văn A" required {...f('fullName')} />
                  <InputField label="Số điện thoại *" placeholder="0900 123 456" required type="tel" {...f('phone')} />
                </div>
                <InputField label="Địa chỉ cụ thể *" placeholder="123 Đường Lê Lợi" required {...f('addressLine')} />
                <div className="grid gap-4 sm:grid-cols-3">
                  <InputField label="Phường/Xã" placeholder="Phường 1" {...f('ward')} />
                  <InputField label="Quận/Huyện" placeholder="Quận 1" {...f('district')} />
                  <InputField label="Tỉnh/Thành phố *" placeholder="TP. Hồ Chí Minh" required {...f('city')} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-stone-700">Ghi chú đơn hàng</label>
                  <textarea
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                    placeholder="Ghi chú về đơn hàng (tùy chọn)"
                    rows={2}
                    {...f('note')}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-6">
              <h2 className="mb-5 text-lg font-black text-stone-900">Phương thức thanh toán</h2>
              <div className="space-y-3">
                {[
                  { value: 'cod', label: 'Thanh toán khi nhận hàng (COD)', icon: '💵' },
                  { value: 'bank_transfer', label: 'Chuyển khoản ngân hàng', icon: '🏦' },
                ].map((method) => (
                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                      form.paymentMethod === method.value
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-stone-200 hover:border-emerald-300 hover:bg-stone-50'
                    }`}
                    key={method.value}
                  >
                    <input
                      checked={form.paymentMethod === method.value}
                      className="accent-emerald-600"
                      name="paymentMethod"
                      onChange={() => setForm((f) => ({ ...f, paymentMethod: method.value as 'cod' | 'bank_transfer' }))}
                      type="radio"
                      value={method.value}
                    />
                    <span className="text-xl">{method.icon}</span>
                    <span className="text-sm font-semibold text-stone-800">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right: order summary */}
          <div>
            <div className="sticky top-4 rounded-2xl border border-stone-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-black text-stone-900">Đơn hàng của bạn</h2>

              {items.length === 0 ? (
                <div className="py-6 text-center text-stone-400">
                  <p>Giỏ hàng trống</p>
                  <Link className="mt-2 block text-sm font-semibold text-emerald-700 hover:underline" href="/">
                    Tiếp tục mua sắm
                  </Link>
                </div>
              ) : (
                <>
                  <div className="max-h-64 space-y-3 overflow-y-auto">
                    {items.map((item) => (
                      <div className="flex items-start justify-between gap-3" key={item.slug}>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-stone-900">{item.name}</p>
                          <p className="mt-0.5 text-xs text-stone-400">
                            {item.price.toLocaleString('vi-VN')}₫ × {item.quantity}
                          </p>
                        </div>
                        <p className="shrink-0 text-sm font-bold text-stone-900">
                          {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 space-y-2 border-t border-stone-100 pt-4 text-sm">
                    <div className="flex justify-between text-stone-500">
                      <span>Tạm tính</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-stone-500">
                      <span>Phí vận chuyển</span>
                      <span className={shippingFee === 0 ? 'font-semibold text-emerald-600' : ''}>
                        {shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}
                      </span>
                    </div>
                    {shippingFee > 0 && (
                      <p className="text-xs text-stone-400">Miễn phí ship cho đơn từ 500.000₫</p>
                    )}
                    <div className="flex justify-between border-t border-stone-100 pt-2 font-black text-stone-900">
                      <span>Tổng cộng</span>
                      <span className="text-lg text-emerald-700">{formatPrice(total)}</span>
                    </div>
                  </div>

                  {error && (
                    <div className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
                  )}

                  <button
                    className="mt-5 w-full rounded-xl bg-emerald-700 px-4 py-3.5 font-bold text-white transition hover:bg-emerald-800 disabled:opacity-60"
                    disabled={submitting || items.length === 0}
                    type="submit"
                  >
                    {submitting ? 'Đang đặt hàng...' : 'Xác nhận đặt hàng'}
                  </button>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

function InputField({
  label,
  placeholder,
  required,
  type = 'text',
  value,
  onChange,
}: {
  label: string
  placeholder?: string
  required?: boolean
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-stone-700">{label}</label>
      <input
        className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
      />
    </div>
  )
}
