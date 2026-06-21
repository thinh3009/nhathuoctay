import { CATEGORY_CONFIG, DEFAULT_CATEGORY_SLUG, PRODUCTS_PER_PAGE, type CategorySlug } from './constants.ts'
import { buildProductImages } from './productImages.ts'
import {
  categoryNavItemSchema,
  type CategoryNavItem,
  type Product,
  productSchema,
  productSearchParamsSchema,
  type ProductSearchParams,
  type Review,
} from './schemas.ts'

type ProductSeed = {
  slug: string
  name: string
  subCategory: string
  benefit: string
  description: string
  shortDescription: string
  price: number
  badge: string
  ingredients: string[]
  usage: string
  unit: string
  manufacturer: string
  countryOfOrigin: string
  form: string
  specification: string
  shelfLife: string
  ingredientHighlight: string
  rating?: number
  reviewCount?: number
  commentCount?: number
}

type CategoryMeta = CategoryNavItem & {
  prefix: string
}

const categoryMetaMap: Record<CategorySlug, CategoryMeta> = {
  'thuc-pham-chuc-nang': { ...CATEGORY_CONFIG[0], prefix: 'TPCN' },
  'cham-soc-da': { ...CATEGORY_CONFIG[1], prefix: 'CSD' },
  'thiet-bi-y-te': { ...CATEGORY_CONFIG[2], prefix: 'TBYT' },
  thuoc: { ...CATEGORY_CONFIG[3], prefix: 'THUOC' },
}

function createReviews(name: string): Review[] {
  return [
    {
      author: 'Ngọc Anh',
      rating: 5,
      date: '08/06/2026',
      title: 'Dùng đều thấy ổn',
      content: `${name} đóng gói chắc chắn, giao nhanh và dễ dùng trong sinh hoạt hằng ngày.`,
    },
    {
      author: 'Minh Khang',
      rating: 4,
      date: '03/06/2026',
      title: 'Thông tin rõ ràng',
      content:
        'Trang chi tiết ghi đủ thành phần, cách dùng và quy cách nên dễ cân nhắc trước khi mua.',
    },
    {
      author: 'Thanh Vy',
      rating: 5,
      date: '28/05/2026',
      title: 'Phù hợp với nhu cầu',
      content: 'Mình tìm được đúng nhóm sản phẩm đang cần và phần mô tả khá dễ đọc.',
    },
  ]
}

function createProduct(category: CategoryMeta, seed: ProductSeed, index: number): Product {
  return productSchema.parse({
    slug: seed.slug,
    name: seed.name,
    topCategory: category.label,
    topCategorySlug: category.slug,
    subCategory: seed.subCategory,
    benefit: seed.benefit,
    description: seed.description,
    shortDescription: seed.shortDescription,
    price: seed.price,
    badge: seed.badge,
    ingredients: seed.ingredients,
    usage: seed.usage,
    unit: seed.unit,
    defaultQuantity: 1,
    sku: `${category.prefix}-${String(index + 1).padStart(3, '0')}`,
    rating: seed.rating ?? 4.8,
    reviewCount: seed.reviewCount ?? 10,
    commentCount: seed.commentCount ?? 18,
    officialName: `${seed.name} - ${category.label}`,
    registrationNumber: `${7350 + index}/${new Date().getFullYear()}/DKSP`,
    form: seed.form,
    specification: seed.specification,
    manufacturer: seed.manufacturer,
    countryOfOrigin: seed.countryOfOrigin,
    shelfLife: seed.shelfLife,
    ingredientHighlight: seed.ingredientHighlight,
    images: buildProductImages(category.slug, seed.slug),
    reviews: createReviews(seed.name),
  })
}

function buildProducts(categorySlug: CategorySlug, seeds: ProductSeed[], startIndex = 0) {
  return seeds.map((seed, index) => createProduct(categoryMetaMap[categorySlug], seed, startIndex + index))
}

/* ──────────────────────────────────────────────────────────────────────────
 * Dữ liệu sản phẩm thật tham khảo từ nhathuoclongchau.com.vn (tên, giá, đơn vị,
 * thương hiệu). Các trường mô tả/cách dùng/thành phần được sinh tự động theo
 * mẫu — vui lòng đọc kỹ hướng dẫn sử dụng và hỏi dược sĩ trước khi dùng.
 * Mỗi danh mục 20 sản phẩm.
 * ────────────────────────────────────────────────────────────────────────── */

// [tên, giá (VND), đơn vị, nhóm con, thương hiệu, quy cách?, nước sản xuất?]
type ProductRow = [
  name: string,
  price: number,
  unit: string,
  subCategory: string,
  manufacturer: string,
  specification?: string,
  country?: string,
]

const usedSlugs = new Set<string>()

function slugify(value: string): string {
  const base = value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
  return base || 'san-pham'
}

function uniqueSlug(name: string): string {
  const base = slugify(name)
  let slug = base
  let counter = 2
  while (usedSlugs.has(slug)) {
    slug = `${base}-${counter}`
    counter += 1
  }
  usedSlugs.add(slug)
  return slug
}

function deriveForm(name: string, unit: string): string {
  const n = name.toLowerCase()
  if (n.includes('siro') || n.includes('hỗn dịch') || n.includes('dung dịch') || n.includes('dầu')) {
    return 'Dạng lỏng'
  }
  if (n.includes('viên sủi')) return 'Viên sủi'
  if (n.includes('viên nang')) return 'Viên nang'
  if (n.includes('viên') || n.includes('cốm')) return 'Viên/Cốm'
  if (n.includes('kem') || n.includes('gel')) return 'Kem/Gel bôi'
  if (n.includes('máy')) return 'Thiết bị điện tử'
  if (n.includes('nhiệt kế')) return 'Thiết bị đo'
  if (n.includes('que thử') || n.includes('combo')) return 'Que/Bộ thử'
  if (n.includes('xịt')) return 'Dạng xịt'
  if (n.includes('kim') || n.includes('gạc')) return 'Vật tư y tế'
  return unit
}

function rowsToSeeds(rows: ProductRow[]): ProductSeed[] {
  return rows.map(([name, price, unit, subCategory, manufacturer, specification, country], index) => {
    const spec = specification ?? `1 ${unit}`
    return {
      slug: uniqueSlug(name),
      name,
      subCategory,
      benefit: subCategory,
      description:
        `${name} thuộc nhóm ${subCategory}, thương hiệu ${manufacturer}. ` +
        'Sản phẩm tham khảo từ danh mục nhà thuốc; vui lòng đọc kỹ hướng dẫn sử dụng ' +
        'và hỏi ý kiến dược sĩ/bác sĩ trước khi dùng.',
      shortDescription: `${subCategory} — ${manufacturer}. Quy cách: ${spec}.`,
      price,
      badge: 'Chính hãng',
      ingredients: ['Xem chi tiết thành phần trên bao bì sản phẩm'],
      usage: 'Dùng theo hướng dẫn trên bao bì hoặc theo tư vấn của dược sĩ/bác sĩ.',
      unit,
      manufacturer,
      countryOfOrigin: country ?? 'Việt Nam',
      form: deriveForm(name, unit),
      specification: spec,
      shelfLife: '24 tháng',
      ingredientHighlight: `${name} — quy cách ${spec}.`,
      rating: Number((4.5 + (index % 5) / 10).toFixed(1)),
      reviewCount: 12 + (index % 40),
      commentCount: 8 + (index % 30),
    }
  })
}

const SUPPLEMENT_ROWS: ProductRow[] = [
  ['Viên uống bổ sung lợi khuẩn, D-mannose, việt quất Lactobact Intima', 685000, 'Hộp', 'Tiêu hóa', 'Lactobact', 'Hộp 30 viên', 'Đức'],
  ['Cốm vi sinh bổ sung lợi khuẩn đường ruột Lacto Biomin Gold+ New', 149000, 'Hộp', 'Tiêu hóa', 'Biomin', 'Hộp 20 gói x 5g'],
  ['Viên uống bổ gan tăng cường chức năng gan Kanzo Gold', 768000, 'Hộp', 'Gan mật', 'Kanzo', 'Hộp 60 viên'],
  ['Viên uống tăng tuần hoàn não Hoạt Huyết Thông Mạch Gold TW3', 120000, 'Hộp', 'Tim mạch - Não', 'Foripharm', 'Hộp 3 vỉ x 10 viên'],
  ['Viên uống bổ não, giảm rối loạn tiền đình Bổ Não Ích Trí Gold', 210000, 'Hộp', 'Tim mạch - Não', 'Ích Trí', 'Hộp 60 viên'],
  ['Dung dịch hỗ trợ phát triển xương răng cho trẻ D3 Drops DAO Nordic Health', 270000, 'Hộp', 'Mẹ và bé', 'DAO Nordic Health', 'Hộp 10ml', 'Na Uy'],
  ['Siro bổ sung lợi khuẩn cho hệ tiêu hóa Bio Plus Kenko', 560000, 'Hộp', 'Tiêu hóa', 'Kenko', 'Hộp 10 gói x 15g'],
  ['Siro giảm ho, giảm đờm, đau họng Bổ Phế Lábebé', 75000, 'Hộp', 'Hô hấp', 'Lábebé', 'Hộp 120ml'],
  ['Viên uống hỗ trợ tim mạch Omega 3 Power DAO Nordic Health', 264000, 'Hộp', 'Tim mạch - Não', 'DAO Nordic Health', 'Hộp 120 viên', 'Na Uy'],
  ['Viên uống bổ sung canxi, tăng chiều cao cho trẻ NutriGrow Nutrimed', 480000, 'Hộp', 'Xương khớp - Chiều cao', 'Nutrimed', 'Hộp 60 viên'],
  ['Viên uống bổ sung vitamin và khoáng chất Immuvita Easylife', 410000, 'Hộp', 'Vitamin - Khoáng chất', 'Easylife', 'Hộp 100 viên'],
  ['Siro bổ sung canxi & vitamin D3, K2 Canxi-D3-K2 Kingphar', 115000, 'Hộp', 'Xương khớp - Chiều cao', 'Kingphar', 'Hộp 6 vỉ x 5 ống x 5ml'],
  ['Siro bổ sung chất xơ, tăng đề kháng cho trẻ KID GROW Kenko', 480000, 'Hộp', 'Mẹ và bé', 'Kenko', 'Hộp 100ml'],
  ['Viên uống Omega 3 hỗ trợ não, mắt, tim mạch OMEGA 3 PLUS Kenko', 736000, 'Hộp', 'Tim mạch - Não', 'Kenko', 'Hộp 120 viên'],
  ['Viên uống tốt cho não và mắt Omexxel 3-6-9 Premium', 453000, 'Hộp', 'Vitamin - Khoáng chất', 'Excelife', 'Hộp 100 viên', 'Mỹ'],
  ['Viên nhai tăng chiều cao, giảm còi xương Borne Mineral New Nordic', 635000, 'Hộp', 'Xương khớp - Chiều cao', 'New Nordic', 'Hộp 120 viên', 'Đan Mạch'],
  ['Viên uống cho phụ nữ mang thai và cho con bú Brauer Ultra Pure DHA', 578000, 'Hộp', 'Mẹ và bé', 'Brauer', 'Hộp 60 viên', 'Úc'],
  ['Viên sủi bổ sung vitamin Kudos Daily Vitamins Plus Biotin & Ginseng', 118000, 'Tuýp', 'Vitamin - Khoáng chất', 'Kudos', 'Tuýp 20 viên'],
  ['Viên sủi bổ sung vitamin C Kudos Vitamin C 1000mg', 113000, 'Tuýp', 'Đề kháng', 'Kudos', 'Tuýp 20 viên'],
  ['Viên uống cho phụ nữ mang thai và sau sinh Prenatal One Vitamins For Life', 660000, 'Hộp', 'Mẹ và bé', 'Vitamins For Life', 'Hộp 60 viên', 'Mỹ'],
]

const SKINCARE_ROWS: ProductRow[] = [
  ['Nước tắm gội thảo dược cho bé Sachi 250ml', 139000, 'Chai', 'Chăm sóc cơ thể', 'Sachi', 'Chai 250ml'],
  ['Dầu Mù U M.U.U 10ml', 55000, 'Chai', 'Chăm sóc cơ thể', 'M.U.U', 'Chai 10ml'],
  ['Dung dịch vệ sinh phụ nữ dạng bọt Daily Lady Soft 100ml', 81750, 'Chai', 'Vệ sinh cá nhân', 'Daily Lady', 'Chai 100ml'],
  ['Kem bôi dịu da, giảm kích ứng Dr.Ciccarelli S.O.S Pelle 25ml', 176000, 'Tuýp', 'Dưỡng & Serum', 'Dr.Ciccarelli', 'Tuýp 25ml', 'Ý'],
  ['Dung dịch vệ sinh phụ nữ Saforelle Gentle Soothing 250ml', 235000, 'Chai', 'Vệ sinh cá nhân', 'Saforelle', 'Chai 250ml', 'Pháp'],
  ['Dung dịch vệ sinh phụ nữ Saforelle Soin Lavant Doux 100ml', 132000, 'Chai', 'Vệ sinh cá nhân', 'Saforelle', 'Chai 100ml', 'Pháp'],
  ['Gel giảm mụn CeraVe Blemish Control 15ml', 143000, 'Tuýp', 'Trị mụn', 'CeraVe', 'Tuýp 15ml', 'Mỹ'],
  ['Kem chống nắng nâng tông Sắc Ngọc Khang SPF 50+ PA++++ 50g', 195000, 'Hộp', 'Chống nắng', 'Sắc Ngọc Khang', 'Hộp 50g'],
  ['Tinh chất dưỡng ẩm, sáng da Pax Moly Blemish Care 30ml', 222000, 'Chai', 'Dưỡng & Serum', 'Pax Moly', 'Chai 30ml', 'Hàn Quốc'],
  ['Dầu dừa tươi Raw Virgin Coconut Oil Cobote 50ml', 70000, 'Chai', 'Chăm sóc cơ thể', 'Cobote', 'Chai 50ml'],
  ['Sữa rửa mặt thảo dược sáng da Sắc Ngọc Khang 100g', 85000, 'Tuýp', 'Làm sạch', 'Sắc Ngọc Khang', 'Tuýp 100g'],
  ['Gel bôi Decumar Advance THC 20g', 105000, 'Tuýp', 'Trị mụn', 'Decumar', 'Tuýp 20g'],
  ['Gel rửa mặt cho da dầu SVR Sebiaclear Moussant 200ml', 324000, 'Tuýp', 'Làm sạch', 'SVR', 'Tuýp 200ml', 'Pháp'],
  ['Kem dưỡng trắng da 5 in 1 SPF25 Sắc Ngọc Khang HTP 30g', 295000, 'Hộp', 'Dưỡng & Serum', 'Sắc Ngọc Khang', 'Hộp 30g'],
  ['Sữa rửa mặt ngừa mụn On:The Body Rice Heartleaf Acne Cleanser 150ml', 132000, 'Tuýp', 'Làm sạch', 'On:The Body', 'Tuýp 150ml', 'Hàn Quốc'],
  ['Nước tẩy trang cho da mụn JMSolution Derma Care Centella 500ml', 147000, 'Chai', 'Làm sạch', 'JMSolution', 'Chai 500ml', 'Hàn Quốc'],
  ['Nước tẩy trang JMSolution Water Luminous S.O.S Ringer 500ml', 147000, 'Chai', 'Làm sạch', 'JMSolution', 'Chai 500ml', 'Hàn Quốc'],
  ['Gel tẩy tế bào chết Rosette Gommage Clear Peel 180g', 177000, 'Tuýp', 'Dưỡng & Serum', 'Rosette', 'Tuýp 180g', 'Nhật Bản'],
  ['Kem chống nắng nâng tone Reihaku Hatomugi Tone Up UV SPF50+ 70g', 179000, 'Tuýp', 'Chống nắng', 'Hatomugi', 'Tuýp 70g', 'Nhật Bản'],
  ['Sữa rửa mặt ngừa mụn Reihaku Hatomugi Acne Care 130g', 81750, 'Tuýp', 'Làm sạch', 'Hatomugi', 'Tuýp 130g', 'Nhật Bản'],
]

const DEVICE_ROWS: ProductRow[] = [
  ['Nhiệt kế điện tử đo thân nhiệt Fuji DT007', 69000, 'Cái', 'Nhiệt kế', 'Fuji', 'Hộp 1 cái'],
  ['Nhiệt kế hồng ngoại đo trán Yuwell YT-1C', 472000, 'Cái', 'Nhiệt kế', 'Yuwell', 'Hộp 1 cái', 'Trung Quốc'],
  ['Máy đo huyết áp bắp tay Yuwell YE680B', 872000, 'Bộ', 'Máy đo huyết áp', 'Yuwell', 'Hộp 1 máy + vòng bít', 'Trung Quốc'],
  ['Que thử rụng trứng Safefit test (7 cái)', 55000, 'Hộp', 'Que thử', 'Safefit', 'Hộp 7 que'],
  ['Que thử thai Safefit Test dạng bút', 35000, 'Hộp', 'Que thử', 'Safefit', 'Hộp 1 bút'],
  ['Que thử thai HCG Safefit', 13000, 'Hộp', 'Que thử', 'Safefit', 'Hộp 1 que'],
  ['Que thử đường huyết Nipro Premier (25 que)', 205000, 'Hộp', 'Đo đường huyết', 'Nipro', 'Hộp 25 que'],
  ['Combo que thử đường huyết Easy Max (25 cái) + máy đo', 699000, 'Bộ', 'Đo đường huyết', 'Easy Max', 'Hộp 1 máy + 25 que'],
  ['Que thử thai Humasis Hello Baby+ dạng bút', 50000, 'Hộp', 'Que thử', 'Humasis', 'Hộp 1 bút', 'Hàn Quốc'],
  ['Que thử đường huyết Easy Max (25 que)', 169000, 'Hộp', 'Đo đường huyết', 'Easy Max', 'Hộp 25 que'],
  ['Máy đo huyết áp bắp tay Omron HEM 7120', 940000, 'Bộ', 'Máy đo huyết áp', 'Omron', 'Hộp 1 máy + vòng bít', 'Nhật Bản'],
  ['Que thử thai HCG Allisa Traphaco', 15000, 'Hộp', 'Que thử', 'Traphaco', 'Hộp 1 que'],
  ['Gạc răng miệng Sachi cho bé sơ sinh (30 gói)', 110000, 'Hộp', 'Dụng cụ - Vật tư', 'Sachi', 'Hộp 30 gói'],
  ['Kim lấy máu Lancets Medicleen BL-28 (100 cái)', 32000, 'Hộp', 'Dụng cụ - Vật tư', 'Medicleen', 'Hộp 100 cái'],
  ['Đầu kim tiểu đường 32G x 4mm Pic insupen (100 cái)', 200000, 'Hộp', 'Dụng cụ - Vật tư', 'Pic Solution', 'Hộp 100 cái', 'Ý'],
  ['Nước muối sinh lý Fysoline Hypertonique (20 ống x 5ml)', 193000, 'Hộp', 'Xịt mũi - Vệ sinh', 'Fysoline', 'Hộp 20 ống x 5ml', 'Pháp'],
  ['Xịt mũi nano bạc ion Fujisalt 70ml', 45000, 'Chai', 'Xịt mũi - Vệ sinh', 'Fujisalt', 'Chai 70ml'],
  ['Xịt mũi trẻ em Otosan Nasal Spray Baby 20ml', 295000, 'Chai', 'Xịt mũi - Vệ sinh', 'Otosan', 'Chai 20ml', 'Ý'],
  ['Kem bôi giảm đau Voltogel mass 50g', 119000, 'Tuýp', 'Dụng cụ - Vật tư', 'Voltogel', 'Tuýp 50g'],
  ['Dầu gió khuynh diệp Eagle Brand 25ml', 109000, 'Chai', 'Dụng cụ - Vật tư', 'Eagle Brand', 'Chai 25ml', 'Singapore'],
]

const MEDICINE_ROWS: ProductRow[] = [
  ['Thuốc Đại Tràng Trường Phúc', 105000, 'Hộp', 'Tiêu hóa - Gan mật', 'Trường Phúc', 'Hộp 60 viên'],
  ['Thuốc Bổ Gan Trường Phúc', 99000, 'Hộp', 'Tiêu hóa - Gan mật', 'Trường Phúc', 'Hộp 60 viên'],
  ['Viên mật nghệ Cholapan OPC', 49000, 'Hộp', 'Tiêu hóa - Gan mật', 'OPC', 'Hộp 5 vỉ x 10 viên'],
  ['Thuốc Duphalac Abbott', 155000, 'Hộp', 'Tiêu hóa - Gan mật', 'Abbott', 'Hộp 20 gói x 15ml', 'Pháp'],
  ['Thuốc bột pha hỗn dịch Smecta Ipsen', 51000, 'Hộp', 'Tiêu hóa - Gan mật', 'Ipsen', 'Hộp 30 gói', 'Pháp'],
  ['Thuốc Boganic Forte Traphaco', 115000, 'Hộp', 'Tiêu hóa - Gan mật', 'Traphaco', 'Hộp 100 viên'],
  ['Trà Gừng Traphaco', 14000, 'Hộp', 'Tiêu hóa - Gan mật', 'Traphaco', 'Hộp 20 gói'],
  ['Thuốc chống say tàu xe Momvina Hadiphar', 91000, 'Hộp', 'Thần kinh', 'Hadiphar', 'Hộp 25 vỉ x 4 viên'],
  ['Gel bôi da Klenzit MS điều trị mụn trứng cá', 72000, 'Tuýp', 'Trị mụn', 'Galderma', 'Tuýp 15g'],
  ['Viên sủi Berocca bổ sung vitamin và khoáng chất', 195000, 'Tuýp', 'Bổ - Vitamin', 'Bayer', 'Tuýp 10 viên'],
  ['Thuốc Farzincol Pharmedic điều trị thiếu kẽm', 45000, 'Hộp', 'Bổ - Vitamin', 'Pharmedic', 'Hộp 10 vỉ x 10 viên'],
  ['Viên sủi Efferalgan 500mg giảm đau, hạ sốt', 72000, 'Hộp', 'Giảm đau - Hạ sốt', 'UPSA', 'Hộp 4 vỉ x 4 viên', 'Pháp'],
  ['Thuốc Clorpheniramin 4mg DHG điều trị viêm mũi dị ứng', 28000, 'Hộp', 'Dị ứng', 'DHG Pharma', 'Hộp 10 vỉ x 20 viên'],
  ['Men vi sinh Enterogermina 2 tỷ/5ml', 95000, 'Hộp', 'Tiêu hóa - Gan mật', 'Sanofi', 'Hộp 2 vỉ x 10 ống', 'Ý'],
  ['Thuốc Telfast HD 180mg Sanofi', 132000, 'Hộp', 'Dị ứng', 'Sanofi', 'Hộp 1 vỉ x 10 viên'],
  ['Viên nhai Kremil-S United điều trị đau dạ dày', 82000, 'Hộp', 'Tiêu hóa - Gan mật', 'United', 'Hộp 10 vỉ x 10 viên'],
  ['Thuốc Eugica MEGA We care giảm ho, cảm', 60000, 'Hộp', 'Ho - Cảm', 'Mega We Care', 'Hộp 10 vỉ x 10 viên'],
  ['Kem Differin Galderma điều trị mụn trứng cá', 320000, 'Tuýp', 'Trị mụn', 'Galderma', 'Tuýp 30g', 'Pháp'],
  ['Hỗn dịch Gaviscon Dual Action trị trào ngược', 175000, 'Hộp', 'Tiêu hóa - Gan mật', 'Reckitt', 'Hộp 12 gói x 10ml', 'Anh'],
  ['Thuốc ho Prospan Engelhard', 95000, 'Chai', 'Ho - Cảm', 'Engelhard', 'Chai 100ml', 'Đức'],
]

const supplementProducts = buildProducts('thuc-pham-chuc-nang', rowsToSeeds(SUPPLEMENT_ROWS))
const skincareProducts = buildProducts('cham-soc-da', rowsToSeeds(SKINCARE_ROWS))
const deviceProducts = buildProducts('thiet-bi-y-te', rowsToSeeds(DEVICE_ROWS))
const medicineProducts = buildProducts('thuoc', rowsToSeeds(MEDICINE_ROWS))

export const categoryNavItems = categoryNavItemSchema.array().parse(CATEGORY_CONFIG)
export const products = productSchema.array().parse([
  ...supplementProducts,
  ...skincareProducts,
  ...deviceProducts,
  ...medicineProducts,
])

export const commitments = [
  'Sản phẩm chính hãng, rõ nguồn gốc',
  'Tư vấn miễn phí theo nhu cầu sức khỏe',
  'Giao hàng toàn quốc trong 2-4 ngày',
]

export function formatPrice(price: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(price)
}

export function getCategoryBySlug(slug: string) {
  return categoryNavItems.find((item) => item.slug === slug)
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug)
}

export function getRelatedProducts(product: Product, limit = 4) {
  return products
    .filter((item) => item.slug !== product.slug && item.topCategorySlug === product.topCategorySlug)
    .sort((left, right) => {
      const leftScore = left.subCategory === product.subCategory ? 0 : 1
      const rightScore = right.subCategory === product.subCategory ? 0 : 1

      if (leftScore !== rightScore) {
        return leftScore - rightScore
      }

      return right.rating - left.rating
    })
    .slice(0, limit)
}

export function getCategoryProducts(categorySlug: string) {
  return products.filter((product) => product.topCategorySlug === categorySlug)
}

export function listProducts(rawParams: Partial<Record<keyof ProductSearchParams, unknown>>) {
  const params = productSearchParamsSchema.parse(rawParams)
  const category = getCategoryBySlug(params.category ?? DEFAULT_CATEGORY_SLUG)

  if (!category) {
    return null
  }

  const categoryProducts = getCategoryProducts(category.slug)
  const filteredProducts = categoryProducts
    .filter((product) => {
      if (params.subCategory && params.subCategory !== 'Tất cả' && product.subCategory !== params.subCategory) {
        return false
      }

      if (params.priceRange === 'under-200') {
        return product.price < 200000
      }

      if (params.priceRange === '200-400') {
        return product.price >= 200000 && product.price <= 400000
      }

      if (params.priceRange === 'over-400') {
        return product.price > 400000
      }

      return true
    })
    .sort((left, right) => {
      switch (params.sort) {
        case 'price-asc':
          return left.price - right.price
        case 'price-desc':
          return right.price - left.price
        case 'name-asc':
          return left.name.localeCompare(right.name, 'vi')
        case 'rating-desc':
          return right.rating - left.rating
        default:
          return right.rating - left.rating
      }
    })

  const total = filteredProducts.length
  const totalPages = Math.max(1, Math.ceil(total / params.pageSize))
  const page = Math.min(params.page, totalPages)
  const startIndex = (page - 1) * params.pageSize
  const items = filteredProducts.slice(startIndex, startIndex + params.pageSize)

  return {
    category,
    filters: {
      subCategories: ['Tất cả', ...new Set(categoryProducts.map((product) => product.subCategory))],
    },
    items,
    pagination: {
      page,
      pageSize: params.pageSize ?? PRODUCTS_PER_PAGE,
      total,
      totalPages,
    },
    selected: {
      ...params,
      page,
    },
    suggestedProducts: categoryProducts
      .filter((product) => !items.some((item) => item.slug === product.slug))
      .sort((left, right) => right.rating - left.rating)
      .slice(0, 4),
  }
}
