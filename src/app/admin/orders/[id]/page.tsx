import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getOrderById } from '@/features/orders/queries'
import { formatPrice } from '@/utils/format'
import OrderStatusUpdater from '@/features/orders/components/OrderStatusUpdater'

const STATUS_LABEL: Record<string, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  processing: 'Đang xử lý',
  shipping: 'Đang giao hàng',
  delivered: 'Đã giao thành công',
  cancelled: 'Đã hủy',
  refunded: 'Đã hoàn tiền',
}

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = await getOrderById(id)
  if (!order) notFound()

  const { items, ...orderData } = order

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link className="text-sm text-stone-500 hover:text-stone-700" href="/admin/orders">
          ← Đơn hàng
        </Link>
        <h1 className="text-2xl font-black text-stone-900">{orderData.orderNumber}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main info */}
        <div className="space-y-4 lg:col-span-2">
          {/* Items */}
          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <h2 className="mb-4 font-bold text-stone-900">Sản phẩm đặt hàng</h2>
            <div className="divide-y divide-stone-100">
              {items.map((item) => (
                <div className="flex items-start justify-between gap-4 py-3" key={item.id}>
                  <div>
                    <p className="font-semibold text-stone-900">{item.productName}</p>
                    <p className="mt-0.5 text-sm text-stone-500">
                      {formatPrice(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-bold text-stone-900">{formatPrice(item.subtotal)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-stone-200 pt-4">
              <div className="flex justify-between text-sm text-stone-500">
                <span>Phí vận chuyển</span>
                <span>{orderData.shippingFee === 0 ? 'Miễn phí' : formatPrice(orderData.shippingFee)}</span>
              </div>
              <div className="mt-2 flex justify-between font-bold text-stone-900">
                <span>Tổng cộng</span>
                <span className="text-lg text-emerald-700">{formatPrice(orderData.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Shipping address */}
          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <h2 className="mb-3 font-bold text-stone-900">Địa chỉ giao hàng</h2>
            <div className="text-sm text-stone-700 space-y-1">
              <p className="font-semibold">{orderData.shippingAddress.fullName}</p>
              <p>{orderData.shippingAddress.phone}</p>
              <p>{orderData.shippingAddress.addressLine}</p>
              {orderData.shippingAddress.ward && <p>{orderData.shippingAddress.ward}</p>}
              {orderData.shippingAddress.district && <p>{orderData.shippingAddress.district}</p>}
              <p>{orderData.shippingAddress.city}</p>
            </div>
          </div>

          {orderData.note && (
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
              <h2 className="mb-2 font-bold text-amber-900">Ghi chú</h2>
              <p className="text-sm text-amber-800">{orderData.note}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <h2 className="mb-4 font-bold text-stone-900">Cập nhật trạng thái</h2>
            <OrderStatusUpdater currentStatus={orderData.status} orderId={orderData.id} />
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <h2 className="mb-3 font-bold text-stone-900">Thông tin đơn hàng</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-500">Phương thức TT</span>
                <span className="font-semibold uppercase">{orderData.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Trạng thái TT</span>
                <span className={`font-semibold ${orderData.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {orderData.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Ngày đặt</span>
                <span>{new Date(orderData.createdAt).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
