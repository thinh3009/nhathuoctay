import { SITE_URL } from '@/config/site'

// Nhúng structured data (schema.org) dạng JSON-LD. Google/AI đọc để hiện rich results
// (sao, giá, breadcrumb) và trích dẫn. Render 1 <script> — đặt ở đâu trong trang cũng được.
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Dữ liệu do server dựng từ DB (không phải input người dùng thô), stringify an toàn.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// JSON-LD yêu cầu URL tuyệt đối. Ảnh trong DB có thể là URL Storage (đã tuyệt đối) hoặc
// đường dẫn tương đối (ảnh demo /demo-products/...) → ghép SITE_URL cho loại tương đối.
export function toAbsoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path
  return `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`
}
