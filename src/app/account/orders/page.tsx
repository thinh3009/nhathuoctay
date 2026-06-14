import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'
import { getOrdersByUserId } from '@/db/queries/users'
import { formatPrice } from '@/lib/catalog'
import { SITE_NAME } from '@/config/site'

const STATUS_LABEL: Record<string, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  processing: 'Đang xử lý',
  shipping: 'Đang giao hàng',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
  refunded: 'Hoàn tiền',
}

const STATUS_CLASS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipping: 'bg-cyan-100 text-cyan-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
  refunded: 'bg-stone-100 text-stone-600',
}

export default async function AccountOrdersPage() {
  const user = await getAuthUser()
  if (!user) redirect('/auth/login')

  const orders = await getOrdersByUserId(user.userId)

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <Link className="text-xl font-black text-emerald-900" href="/">{SITE_NAME}</Link>
          <span className="text-stone-300">/</span>
          <span className="text-stone-600">Đơn hàng của tôi</span>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-stone-900">Đơn hàng của tôi</h1>
          <p className="mt-1 text-stone-500">{orders.length} đơn hàng</p>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 bg-white px-6 py-16 text-center">
            <div className="text-4xl">📦</div>
            <p className="mt-3 text-stone-500">Bạn chưa có đơn hàng nào</p>
            <Link
              className="mt-4 inline-block rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800"
              href="/"
            >
              Bắt đầu mua sắm
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div className="rounded-2xl border border-stone-200 bg-white p-5" key={order.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-bold text-emerald-700">{order.orderNumber}</p>
                    <p className="mt-0.5 text-sm text-stone-500">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_CLASS[order.status] ?? 'bg-stone-100 text-stone-600'}`}>
                    {STATUS_LABEL[order.status] ?? order.status}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between gap-4 border-t border-stone-100 pt-3">
                  <div className="text-sm text-stone-500">
                    Thanh toán: <span className="font-semibold uppercase text-stone-700">{order.paymentMethod}</span>
                  </div>
                  <p className="text-lg font-black text-stone-900">{formatPrice(order.totalAmount)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
