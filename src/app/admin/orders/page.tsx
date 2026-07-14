import { requireAdmin } from '@/lib/auth'
import Link from 'next/link'
import { getAllOrders, updateOrderStatus } from '@/features/orders/queries'
import { formatPrice } from '@/utils/format'

const STATUS_LABEL: Record<string, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  processing: 'Đang xử lý',
  shipping: 'Đang giao',
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

export default async function AdminOrdersPage() {
  await requireAdmin()

  const orders = await getAllOrders(100)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-black text-stone-900">Đơn hàng</h1>
        <p className="mt-1 text-stone-500">{orders.length} đơn hàng</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
        {orders.length === 0 ? (
          <div className="px-6 py-16 text-center text-stone-400">Chưa có đơn hàng nào</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50 text-left">
                  <th className="px-4 py-3 font-semibold text-stone-600">Mã đơn</th>
                  <th className="px-4 py-3 font-semibold text-stone-600">Người nhận</th>
                  <th className="px-4 py-3 font-semibold text-stone-600">SĐT</th>
                  <th className="px-4 py-3 font-semibold text-stone-600">Tổng tiền</th>
                  <th className="px-4 py-3 font-semibold text-stone-600">Thanh toán</th>
                  <th className="px-4 py-3 font-semibold text-stone-600">Trạng thái</th>
                  <th className="px-4 py-3 font-semibold text-stone-600">Ngày đặt</th>
                  <th className="px-4 py-3 font-semibold text-stone-600"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.map((order) => (
                  <tr className="hover:bg-stone-50" key={order.id}>
                    <td className="px-4 py-3">
                      <Link className="font-semibold text-emerald-700 hover:underline" href={`/admin/orders/${order.id}`}>
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-medium text-stone-900">
                      {order.shippingAddress.fullName}
                    </td>
                    <td className="px-4 py-3 text-stone-500">{order.shippingAddress.phone}</td>
                    <td className="px-4 py-3 font-semibold text-stone-900">{formatPrice(order.totalAmount)}</td>
                    <td className="px-4 py-3 text-stone-500 uppercase text-xs font-semibold">
                      {order.paymentMethod}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_CLASS[order.status] ?? 'bg-stone-100 text-stone-600'}`}>
                        {STATUS_LABEL[order.status] ?? order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stone-500">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                        href={`/admin/orders/${order.id}`}
                      >
                        Chi tiết
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
