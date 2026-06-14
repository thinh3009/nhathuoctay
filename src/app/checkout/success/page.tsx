import Link from 'next/link'
import { SITE_NAME } from '@/config/site'

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>
}) {
  const { order } = await searchParams

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-4 text-center">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <svg className="h-10 w-10 text-emerald-600" fill="none" viewBox="0 0 24 24">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
              <path d="m9 11 3 3L22 4" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-black text-stone-900">Đặt hàng thành công!</h1>
        <p className="mt-3 text-stone-500">
          Cảm ơn bạn đã đặt hàng tại <span className="font-semibold text-emerald-700">{SITE_NAME}</span>
        </p>

        {order && (
          <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 px-6 py-4">
            <p className="text-sm text-stone-500">Mã đơn hàng</p>
            <p className="mt-1 text-2xl font-black text-emerald-800">{order}</p>
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-stone-100 bg-white p-5 text-left">
          <h2 className="mb-3 font-bold text-stone-900">Bước tiếp theo</h2>
          <ul className="space-y-2.5 text-sm text-stone-600">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-emerald-600">✓</span>
              Chúng tôi sẽ xác nhận đơn hàng qua điện thoại trong 1-2 giờ
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-emerald-600">✓</span>
              Đơn hàng được giao trong 2-4 giờ (nội thành) hoặc 1-3 ngày (ngoại thành)
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-emerald-600">✓</span>
              Thanh toán khi nhận hàng (COD)
            </li>
          </ul>
        </div>

        <div className="mt-6 flex gap-3">
          <Link
            className="flex-1 rounded-xl bg-emerald-700 px-4 py-3 text-center font-bold text-white transition hover:bg-emerald-800"
            href="/"
          >
            Tiếp tục mua sắm
          </Link>
          <Link
            className="flex-1 rounded-xl border border-stone-200 px-4 py-3 text-center font-semibold text-stone-600 transition hover:bg-stone-50"
            href="/account/orders"
          >
            Xem đơn hàng
          </Link>
        </div>
      </div>
    </div>
  )
}
