// Đọc giá trị select "Phân loại thuốc" (form admin) về 3 trạng thái lưu DB:
//   'true'  → true  (thuốc kê đơn)
//   'false' → false (thuốc không kê đơn)
//   khác/''  → null  (trống, không phân loại)
export function parsePrescription(value: FormDataEntryValue | null): boolean | null {
  if (value === 'true') return true
  if (value === 'false') return false
  return null
}
