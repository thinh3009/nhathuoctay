// Mã giảm giá dùng chung client ↔ server.
// Client hiển thị & tính tạm ước lượng; server (api/checkout) là nguồn sự thật
// khi tạo đơn — cả hai cùng gọi computeDiscount() nên số tiền luôn khớp.

export type Promo = {
  code: string
  /** Nhãn mô tả hiển thị cho khách. */
  label: string
  /** 'percent' = giảm theo %, 'fixed' = giảm số tiền cố định. */
  type: 'percent' | 'fixed'
  value: number
  /** Đơn hàng tối thiểu (tạm tính) để áp dụng. */
  minSubtotal: number
  /** Giảm tối đa (chỉ áp cho type 'percent'). */
  maxDiscount?: number
}

// Danh sách mã ưu đãi. Nhập không phân biệt hoa/thường.
export const PROMOS: Promo[] = [
  { code: 'QUAY16', label: 'Giảm 10% toàn đơn (tối đa 50.000₫), đơn từ 150.000₫', type: 'percent', value: 10, minSubtotal: 150000, maxDiscount: 50000 },
  { code: 'TANTAM50', label: 'Giảm 50.000₫ cho đơn từ 300.000₫', type: 'fixed', value: 50000, minSubtotal: 300000 },
  { code: 'SUCKHOE', label: 'Giảm 15.000₫ cho đơn từ 100.000₫', type: 'fixed', value: 15000, minSubtotal: 100000 },
]

export function findPromo(code: string): Promo | undefined {
  const c = code.trim().toUpperCase()
  return PROMOS.find((p) => p.code === c)
}

export type DiscountResult = {
  amount: number
  promo?: Promo
  error?: string
}

/** Tính số tiền giảm cho một mã trên tạm tính. amount = 0 nếu không hợp lệ. */
export function computeDiscount(code: string | undefined | null, subtotal: number): DiscountResult {
  if (!code || !code.trim()) return { amount: 0 }
  const promo = findPromo(code)
  if (!promo) return { amount: 0, error: 'Mã giảm giá không tồn tại' }
  if (subtotal < promo.minSubtotal) {
    return {
      amount: 0,
      promo,
      error: `Áp dụng cho đơn từ ${promo.minSubtotal.toLocaleString('vi-VN')}₫`,
    }
  }
  let amount =
    promo.type === 'percent' ? Math.round((subtotal * promo.value) / 100) : promo.value
  if (promo.maxDiscount) amount = Math.min(amount, promo.maxDiscount)
  amount = Math.min(amount, subtotal) // không giảm quá tạm tính
  return { amount, promo }
}
