import type { orderItems, orders } from '@/db/schema'

/** Bản ghi đơn hàng & dòng hàng thô từ DB (Drizzle). */
export type OrderRecord = typeof orders.$inferSelect
export type OrderItemRecord = typeof orderItems.$inferSelect

// Đầu vào tạo đơn hàng (dùng bởi orders/queries.ts và route /api/checkout).
export type CreateOrderInput = {
  userId?: string
  totalAmount: number
  shippingFee: number
  paymentMethod: 'cod' | 'bank_transfer' | 'momo' | 'vnpay'
  shippingAddress: {
    fullName: string
    phone: string
    addressLine: string
    ward?: string
    district?: string
    city: string
  }
  note?: string
  items: Array<{
    productSlug: string
    productName: string
    quantity: number
    price: number
  }>
}
