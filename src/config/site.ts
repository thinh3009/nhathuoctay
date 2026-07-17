export const SITE_NAME = 'Quầy thuốc 16'
export const SITE_DESCRIPTION =
  'Quầy thuốc 16 - Tận tâm, tận lòng. Cung cấp thuốc, thực phẩm chức năng, chăm sóc da và thiết bị y tế chính hãng cho người Việt.'
// Thứ tự ưu tiên:
//  1. NEXT_PUBLIC_SITE_URL — domain thật (kể cả domain riêng), phải set trên Vercel.
//  2. VERCEL_PROJECT_PRODUCTION_URL — Vercel tự cấp = domain production thật (không kèm
//     giao thức). Dùng làm lưới an toàn để KHÔNG bao giờ rơi về placeholder sai domain
//     nếu lỡ quên set biến (1) — canonical/OG/sitemap vẫn trỏ đúng site.
//  3. localhost — chỉ khi chạy dev local.
// Toàn bộ file import SITE_URL đều là server-side (layout, landing, robots, sitemap), nên
// đọc env không-public ở đây an toàn.
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (explicit) return explicit.replace(/\/+$/, '')

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()
  if (vercel) return `https://${vercel}`

  return 'http://localhost:3000'
}

export const SITE_URL = resolveSiteUrl()
export const CONTACT_PHONE = '1900 16 16'
export const CONTACT_EMAIL = 'cskh@quaythuoc16.vn'
