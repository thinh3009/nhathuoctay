import Link from 'next/link'
import { getOrderStats, getAllOrders } from '@/features/orders/queries'
import { formatPrice } from '@/utils/format'

function StatCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div className={`rounded-2xl border p-6 ${color}`}>
      <p className="text-sm font-semibold text-stone-500">{label}</p>
      <p className="mt-2 text-3xl font-black text-stone-900">{value}</p>
      <p className="mt-1 text-xs text-stone-400">{sub}</p>
    </div>
  )
}

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

export default async function AdminDashboard() {
  const [stats, recentOrders] = await Promise.all([
    getOrderStats(),
    getAllOrders(10),
  ])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-stone-900">Dashboard</h1>
        <p className="mt-1 text-stone-500">Tổng quan hoạt động nhà thuốc</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          color="border-emerald-100 bg-emerald-50"
          label="Doanh thu"
          sub="Tổng giá trị đơn hàng"
          value={formatPrice(Number(stats.revenue))}
        />
        <StatCard
          color="border-blue-100 bg-blue-50"
          label="Tổng đơn hàng"
          sub="Tất cả trạng thái"
          value={String(stats.total)}
        />
        <StatCard
          color="border-amber-100 bg-amber-50"
          label="Chờ xử lý"
          sub="Cần xác nhận"
          value={String(stats.pending)}
        />
        <StatCard
          color="border-teal-100 bg-teal-50"
          label="Đã giao"
          sub="Đơn hàng thành công"
          value={String(stats.delivered)}
        />
      </div>

      {/* Quick links */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { href: '/admin/products/new', label: 'Thêm sản phẩm mới', desc: 'Tạo sản phẩm trong danh mục', icon: '＋' },
          { href: '/admin/orders', label: 'Quản lý đơn hàng', desc: 'Xem và cập nhật đơn', icon: '📋' },
          { href: '/admin/categories', label: 'Quản lý danh mục', desc: 'Thêm/sửa danh mục', icon: '🏷️' },
        ].map((item) => (
          <Link
            className="rounded-2xl border border-stone-200 bg-white p-5 transition hover:border-emerald-300 hover:shadow-md"
            href={item.href}
            key={item.href}
          >
            <span className="text-2xl">{item.icon}</span>
            <p className="mt-2 font-bold text-stone-900">{item.label}</p>
            <p className="mt-0.5 text-sm text-stone-500">{item.desc}</p>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-black text-stone-900">Đơn hàng gần đây</h2>
          <Link className="text-sm font-semibold text-emerald-700 hover:underline" href="/admin/orders">
            Xem tất cả →
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
          {recentOrders.length === 0 ? (
            <div className="px-6 py-10 text-center text-stone-400">Chưa có đơn hàng nào</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50 text-left">
                  <th className="px-4 py-3 font-semibold text-stone-600">Mã đơn</th>
                  <th className="px-4 py-3 font-semibold text-stone-600">Khách hàng</th>
                  <th className="px-4 py-3 font-semibold text-stone-600">Tổng tiền</th>
                  <th className="px-4 py-3 font-semibold text-stone-600">Trạng thái</th>
                  <th className="px-4 py-3 font-semibold text-stone-600">Ngày đặt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentOrders.map((order) => (
                  <tr className="hover:bg-stone-50" key={order.id}>
                    <td className="px-4 py-3">
                      <Link className="font-semibold text-emerald-700 hover:underline" href={`/admin/orders/${order.id}`}>
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-stone-700">
                      {order.shippingAddress.fullName}
                      <span className="ml-1 text-stone-400">({order.shippingAddress.phone})</span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-stone-900">{formatPrice(order.totalAmount)}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_CLASS[order.status] ?? 'bg-stone-100 text-stone-600'}`}>
                        {STATUS_LABEL[order.status] ?? order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stone-500">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
