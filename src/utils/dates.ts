// Xử lý/định dạng thời gian dùng chung toàn dự án (Việt Nam).

/**
 * Định dạng ngày sang `dd/MM/yyyy` theo vùng Việt Nam. Trả về chuỗi rỗng khi
 * không có giá trị (bài viết chưa đăng, đơn chưa có mốc thời gian...).
 */
export function formatDate(
  value: Date | string | number | null | undefined,
  options?: Intl.DateTimeFormatOptions,
) {
  if (!value) return ''
  return new Date(value).toLocaleDateString('vi-VN', options)
}
