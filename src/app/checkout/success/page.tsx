import Link from 'next/link'
import { SITE_NAME } from '@/config/site'

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>
}) {
  const { order } = await searchParams

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-brand-50 via-white to-[var(--cream-100)] px-4 text-center">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-100">
            <i className="ph-fill ph-check-circle text-4xl text-brand-600" />
          </div>
        </div>

        <h1 className="text-3xl font-black text-stone-900">Đặt hàng thành công!</h1>
        <p className="mt-3 text-stone-500">
          Cảm ơn bạn đã đặt hàng tại <span className="font-semibold text-brand-700">{SITE_NAME}</span>
        </p>

        {order && (
          <div className="mt-6 rounded-2xl border border-brand-100 bg-brand-50 px-6 py-4">
            <p className="text-sm text-stone-500">Mã đơn hàng</p>
            <p className="mt-1 text-2xl font-black text-accent-700">{order}</p>
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-stone-100 bg-white p-5 text-left">
          <h2 className="mb-3 font-bold text-stone-900">Bước tiếp theo</h2>
          <ul className="space-y-2.5 text-sm text-stone-600">
            <li className="flex items-start gap-2">
              <i className="ph-bold ph-check mt-0.5 text-brand-600" />
              Chúng tôi sẽ xác nhận đơn hàng qua điện thoại trong 1-2 giờ
            </li>
            <li className="flex items-start gap-2">
              <i className="ph-bold ph-check mt-0.5 text-brand-600" />
              Đơn hàng được giao trong 2-4 giờ (nội thành) hoặc 1-3 ngày (ngoại thành)
            </li>
            <li className="flex items-start gap-2">
              <i className="ph-bold ph-check mt-0.5 text-brand-600" />
              Thanh toán khi nhận hàng (COD)
            </li>
          </ul>
        </div>

        <div className="mt-6 flex gap-3">
          <Link
            className="flex-1 rounded-full bg-brand-600 px-4 py-3 text-center font-bold text-white transition hover:bg-brand-700"
            href="/"
          >
            Tiếp tục mua sắm
          </Link>
          <Link
            className="flex-1 rounded-full border border-stone-200 px-4 py-3 text-center font-semibold text-stone-600 transition hover:bg-stone-50"
            href="/account/orders"
          >
            Xem đơn hàng
          </Link>
        </div>
      </div>
    </div>
  )
}
