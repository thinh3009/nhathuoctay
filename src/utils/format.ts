// Định dạng số/tiền tệ dùng chung toàn dự án (Việt Nam).

const vndFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
})

/** Định dạng giá tiền sang chuỗi VND, ví dụ `120000` → `120.000 ₫`. */
export function formatPrice(price: number) {
  return vndFormatter.format(price)
}
