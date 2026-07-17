// Dữ liệu & helper cho storefront "Quầy thuốc 16" — port 1:1 từ design Quay Thuoc 16.dc.html

import type { CSSProperties } from 'react'

export type Cat = 'thuoc' | 'tpcn' | 'thietbi' | 'skincare'

export type Product = {
  id: string
  name: string
  cat: Cat
  brand: string
  uses: string[]
  price: number
  oldPrice?: number
  rating: number
  reviews: number
  unit: string
  badge?: string
  // URL ảnh chính (Supabase Storage hoặc ảnh demo). Trống → vẽ hình trang trí theo danh mục.
  image?: string
  // Link sản phẩm trên sàn khác (admin đặt) → hiện icon ở màn chi tiết. Trống → ẩn.
  shopeeUrl?: string
  tiktokUrl?: string
}

export const products: Product[] = [
  { id: 't1', name: 'Paracetamol 500mg Stella', cat: 'thuoc', brand: 'Stella', uses: ['Giảm đau, hạ sốt'], price: 18000, rating: 4.8, reviews: 1240, unit: 'Hộp 10 vỉ x 10 viên', badge: 'Bán chạy' },
  { id: 't2', name: 'Efferalgan 500mg viên sủi', cat: 'thuoc', brand: 'UPSA', uses: ['Giảm đau, hạ sốt', 'Cảm cúm'], price: 95000, oldPrice: 110000, rating: 4.7, reviews: 860, unit: 'Hộp 16 viên' },
  { id: 't3', name: 'Hapacol 650mg', cat: 'thuoc', brand: 'DHG Pharma', uses: ['Giảm đau, hạ sốt'], price: 32000, rating: 4.6, reviews: 540, unit: 'Hộp 10 vỉ x 10 viên' },
  { id: 't4', name: 'Decolgen Forte trị cảm cúm', cat: 'thuoc', brand: 'UPSA', uses: ['Cảm cúm', 'Hô hấp'], price: 56000, oldPrice: 66000, rating: 4.5, reviews: 430, unit: 'Hộp 25 vỉ x 4 viên', badge: '-15%' },
  { id: 't5', name: 'Berberin 10mg Mekophar', cat: 'thuoc', brand: 'Mekophar', uses: ['Tiêu hóa'], price: 12000, rating: 4.7, reviews: 980, unit: 'Lọ 100 viên', badge: 'Bán chạy' },
  { id: 't6', name: 'Smecta hương cam trị tiêu chảy', cat: 'thuoc', brand: 'Beaufour', uses: ['Tiêu hóa'], price: 78000, rating: 4.6, reviews: 320, unit: 'Hộp 30 gói' },
  { id: 't7', name: 'Oresol 245 bù nước điện giải', cat: 'thuoc', brand: 'Bidiphar', uses: ['Tiêu hóa'], price: 25000, rating: 4.8, reviews: 610, unit: 'Hộp 20 gói' },
  { id: 't8', name: 'Strepsils mật ong chanh', cat: 'thuoc', brand: 'Reckitt', uses: ['Hô hấp'], price: 45000, rating: 4.4, reviews: 270, unit: 'Vỉ 24 viên ngậm' },
  { id: 't9', name: 'Vitamin C 1000mg viên sủi', cat: 'thuoc', brand: 'Myvita', uses: ['Vitamin & khoáng chất', 'Cảm cúm'], price: 65000, oldPrice: 80000, rating: 4.7, reviews: 1500, unit: 'Tuýp 20 viên sủi', badge: '-18%' },
  { id: 't10', name: 'Panadol Extra giảm đau', cat: 'thuoc', brand: 'GSK', uses: ['Giảm đau, hạ sốt'], price: 38000, rating: 4.8, reviews: 2100, unit: 'Hộp 15 vỉ x 8 viên', badge: 'Bán chạy' },
  { id: 's1', name: 'Dầu cá Omega-3 1000mg', cat: 'tpcn', brand: 'Blackmores', uses: ['Tim mạch', 'Vitamin & khoáng chất'], price: 320000, oldPrice: 380000, rating: 4.8, reviews: 920, unit: 'Lọ 200 viên', badge: '-16%' },
  { id: 's2', name: 'Canxi Corbiere ống uống', cat: 'tpcn', brand: 'Sanofi', uses: ['Xương khớp', 'Vitamin & khoáng chất'], price: 110000, rating: 4.6, reviews: 450, unit: 'Hộp 30 ống x 10ml' },
  { id: 's3', name: 'Collagen Adiva dạng nước', cat: 'tpcn', brand: 'Adiva', uses: ['Vitamin & khoáng chất'], price: 540000, rating: 4.5, reviews: 360, unit: 'Hộp 14 lọ', badge: 'Yêu thích' },
  { id: 's4', name: 'Men vi sinh Probio bổ sung lợi khuẩn', cat: 'tpcn', brand: 'Probio', uses: ['Tiêu hóa'], price: 145000, rating: 4.7, reviews: 720, unit: 'Hộp 20 gói' },
  { id: 's5', name: 'Vitamin tổng hợp Centrum Adults', cat: 'tpcn', brand: 'Centrum', uses: ['Vitamin & khoáng chất'], price: 295000, rating: 4.7, reviews: 1100, unit: 'Lọ 100 viên', badge: 'Bán chạy' },
  { id: 's6', name: 'Glucosamine 1500mg bổ khớp', cat: 'tpcn', brand: 'Orihiro', uses: ['Xương khớp'], price: 360000, oldPrice: 420000, rating: 4.6, reviews: 540, unit: 'Túi 360 viên', badge: '-14%' },
  { id: 's7', name: 'Blackmores Bio C 1000mg', cat: 'tpcn', brand: 'Blackmores', uses: ['Vitamin & khoáng chất', 'Cảm cúm'], price: 250000, rating: 4.8, reviews: 880, unit: 'Lọ 62 viên' },
  { id: 'd1', name: 'Máy đo huyết áp bắp tay Omron HEM-7121', cat: 'thietbi', brand: 'Omron', uses: ['Thiết bị đo', 'Tim mạch'], price: 720000, oldPrice: 850000, rating: 4.9, reviews: 640, unit: 'Bảo hành 5 năm', badge: '-15%' },
  { id: 'd2', name: 'Nhiệt kế điện tử đầu mềm Microlife', cat: 'thietbi', brand: 'Microlife', uses: ['Thiết bị đo'], price: 95000, rating: 4.6, reviews: 410, unit: 'Bảo hành 1 năm', badge: 'Bán chạy' },
  { id: 'd3', name: 'Máy đo đường huyết Accu-Chek', cat: 'thietbi', brand: 'Roche', uses: ['Thiết bị đo'], price: 890000, rating: 4.7, reviews: 230, unit: 'Tặng 25 que thử' },
  { id: 'd4', name: 'Khẩu trang y tế 4 lớp (hộp 50 cái)', cat: 'thietbi', brand: 'Nam Anh', uses: ['Hô hấp'], price: 38000, oldPrice: 50000, rating: 4.5, reviews: 1900, unit: 'Hộp 50 cái', badge: '-24%' },
  { id: 'd5', name: 'Máy xông khí dung Omron NE-C101', cat: 'thietbi', brand: 'Omron', uses: ['Thiết bị đo', 'Hô hấp'], price: 680000, rating: 4.7, reviews: 180, unit: 'Bảo hành 3 năm' },
  { id: 'd6', name: 'Nhiệt kế hồng ngoại đo trán', cat: 'thietbi', brand: 'Microlife', uses: ['Thiết bị đo'], price: 250000, oldPrice: 320000, rating: 4.6, reviews: 520, unit: 'Bảo hành 1 năm', badge: '-21%' },
  { id: 'k1', name: 'Kem chống nắng Anessa Perfect UV SPF50+', cat: 'skincare', brand: 'Shiseido', uses: ['Chống nắng'], price: 520000, oldPrice: 580000, rating: 4.8, reviews: 1320, unit: 'Tuýp 60ml', badge: '-10%' },
  { id: 'k2', name: 'Sữa rửa mặt Cetaphil dịu nhẹ', cat: 'skincare', brand: 'Cetaphil', uses: ['Làm sạch da'], price: 185000, rating: 4.7, reviews: 980, unit: 'Chai 250ml', badge: 'Bán chạy' },
  { id: 'k3', name: 'Serum B5 phục hồi La Roche-Posay', cat: 'skincare', brand: 'La Roche-Posay', uses: ['Dưỡng ẩm'], price: 430000, oldPrice: 490000, rating: 4.8, reviews: 760, unit: 'Lọ 30ml', badge: '-12%' },
  { id: 'k4', name: 'Kem dưỡng ẩm CeraVe Moisturizing', cat: 'skincare', brand: 'CeraVe', uses: ['Dưỡng ẩm'], price: 310000, rating: 4.7, reviews: 640, unit: 'Hũ 340g' },
  { id: 'k5', name: 'Gel trị mụn Effaclar Duo+', cat: 'skincare', brand: 'La Roche-Posay', uses: ['Trị mụn'], price: 365000, rating: 4.6, reviews: 520, unit: 'Tuýp 40ml', badge: 'Yêu thích' },
  { id: 'k6', name: 'Nước tẩy trang Bioderma Sensibio', cat: 'skincare', brand: 'Bioderma', uses: ['Làm sạch da'], price: 395000, oldPrice: 450000, rating: 4.8, reviews: 1100, unit: 'Chai 500ml', badge: '-12%' },
]

// Combo do admin tạo (từ DB) truyền xuống storefront. `items` là các sản phẩm thành
// viên với giá hiệu lực (salePrice ?? price) để dựng giá combo.
export type StorefrontCombo = {
  id: string
  title: string
  tag: string
  salePrice: number | null
  items: { slug: string; name: string; price: number }[]
}

export type Review = { name: string; date: string; stars: string; text: string }

export const reviewData: Review[] = [
  { name: 'Minh Anh', date: '12/06/2026', stars: '★★★★★', text: 'Giao hàng nhanh, thuốc chính hãng, đóng gói cẩn thận. Dược sĩ tư vấn rất nhiệt tình.' },
  { name: 'Hữu Phúc', date: '08/06/2026', stars: '★★★★★', text: 'Mua nhiều lần ở Quầy thuốc 16, giá hợp lý, sản phẩm đúng mô tả. Rất hài lòng.' },
  { name: 'Thu Hà', date: '03/06/2026', stars: '★★★★☆', text: 'Sản phẩm tốt, giao đúng hẹn. Mong shop có thêm nhiều chương trình khuyến mãi.' },
]

export type NewsArticle = { id: string; tag: string; title: string; date: string; excerpt: string }

export const newsData: NewsArticle[] = [
  { id: 'n1', tag: 'Mùa dịch', title: '5 cách phòng cảm cúm khi giao mùa', date: '20/06/2026', excerpt: 'Thời tiết thay đổi là lúc virus cảm cúm hoạt động mạnh. Cùng dược sĩ điểm qua 5 thói quen giúp bảo vệ cả gia đình.' },
  { id: 'n2', tag: 'Dinh dưỡng', title: 'Vitamin C: uống bao nhiêu là đủ mỗi ngày?', date: '17/06/2026', excerpt: 'Bổ sung vitamin C đúng cách giúp tăng đề kháng, nhưng dùng quá liều lại gây hại. Liều khuyến nghị là bao nhiêu?' },
  { id: 'n3', tag: 'Chăm sóc da', title: 'Routine chăm sóc da cơ bản cho người mới bắt đầu', date: '14/06/2026', excerpt: 'Làm sạch, dưỡng ẩm, chống nắng — 3 bước nền tảng cho làn da khỏe. Hướng dẫn chọn sản phẩm phù hợp với từng loại da.' },
  { id: 'n4', tag: 'Sức khỏe', title: 'Đo huyết áp tại nhà sao cho đúng cách', date: '10/06/2026', excerpt: 'Hướng dẫn sử dụng máy đo huyết áp và những lưu ý quan trọng để có kết quả chính xác nhất.' },
  { id: 'n5', tag: 'Tiêu hóa', title: 'Men vi sinh có thực sự cần thiết?', date: '06/06/2026', excerpt: 'Lợi khuẩn đường ruột ảnh hưởng thế nào đến sức khỏe và khi nào bạn nên bổ sung men vi sinh.' },
  { id: 'n6', tag: 'Lời khuyên', title: 'Cách bảo quản thuốc đúng tại nhà', date: '02/06/2026', excerpt: 'Nhiệt độ, độ ẩm và ánh sáng đều ảnh hưởng đến chất lượng thuốc. Mẹo sắp xếp tủ thuốc gia đình an toàn.' },
]

export const palette: [string, string][] = [
  ['#e4f4f1', '#00796b'],
  ['#ffe3c4', '#e56a1e'],
  ['#bfe7e0', '#26a69a'],
  ['#f2f4f7', '#48555b'],
]

export function fmt(n: number): string {
  return n.toLocaleString('vi-VN') + 'đ'
}

export function tint(cat: Cat): { bg: string; fg: string } {
  if (cat === 'thuoc') return { bg: '#e4f4f1', fg: '#00796b' }
  if (cat === 'tpcn') return { bg: '#ffe3c4', fg: '#e56a1e' }
  if (cat === 'skincare') return { bg: '#bfe7e0', fg: '#26a69a' }
  return { bg: '#f2f4f7', fg: '#48555b' }
}

export function catLabel(cat: Cat): string {
  return cat === 'thuoc' ? 'Thuốc' : cat === 'tpcn' ? 'Thực phẩm chức năng' : cat === 'skincare' ? 'Chăm sóc da' : 'Thiết bị y tế'
}

// Parse a CSS string into a React style object so markup stays 1:1 với design.
export function s(css: string): CSSProperties {
  const out: Record<string, string> = {}
  for (const rule of css.split(';')) {
    const i = rule.indexOf(':')
    if (i === -1) continue
    const prop = rule.slice(0, i).trim()
    const val = rule.slice(i + 1).trim()
    if (!prop) continue
    let camel = prop.replace(/^-/, '').replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
    // Vendor prefixes need a capitalized first letter in React (Webkit/Moz/O), except -ms-.
    if (prop.startsWith('-') && !prop.startsWith('-ms-')) {
      camel = camel.charAt(0).toUpperCase() + camel.slice(1)
    }
    out[camel] = val
  }
  return out as CSSProperties
}
