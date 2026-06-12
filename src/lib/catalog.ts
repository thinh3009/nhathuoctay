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

function buildProducts(categorySlug: CategorySlug, seeds: ProductSeed[]) {
  return seeds.map((seed, index) => createProduct(categoryMetaMap[categorySlug], seed, index))
}

const supplementProducts = buildProducts('thuc-pham-chuc-nang', [
  {
    slug: 'omega-3-premium',
    name: 'Omega-3 Premium',
    subCategory: 'Tim mạch',
    benefit: 'Hỗ trợ tim mạch và não bộ',
    description:
      'Dầu cá tinh khiết giàu EPA và DHA cho người cần chăm sóc tim mạch và duy trì sự tập trung mỗi ngày.',
    shortDescription:
      'Bổ sung Omega-3 giúp hỗ trợ tim mạch, mắt và khả năng tập trung trong sinh hoạt hằng ngày.',
    price: 389000,
    badge: 'Bán chạy',
    ingredients: ['EPA 360mg', 'DHA 240mg', 'Dầu cá tinh khiết 1000mg'],
    usage: 'Uống 1 viên, ngày 2 lần sau bữa ăn.',
    unit: 'Hộp',
    manufacturer: 'Nordic Pure Labs',
    countryOfOrigin: 'Na Uy',
    form: 'Viên nang mềm',
    specification: 'Hộp 60 viên',
    shelfLife: '24 tháng',
    ingredientHighlight: 'Mỗi viên chứa EPA 360mg, DHA 240mg.',
  },
  {
    slug: 'vitamin-c-1000mg',
    name: 'Vitamin C 1000mg',
    subCategory: 'Đề kháng',
    benefit: 'Tăng cường đề kháng hằng ngày',
    description:
      'Vitamin C hàm lượng cao kết hợp bioflavonoid giúp hỗ trợ miễn dịch và chống oxy hóa.',
    shortDescription:
      'Phù hợp cho người cần nâng đỡ hệ miễn dịch và muốn bổ sung vitamin C đều đặn.',
    price: 219000,
    badge: 'Mới',
    ingredients: ['Vitamin C 1000mg', 'Citrus bioflavonoids 50mg'],
    usage: 'Uống 1 viên mỗi ngày sau bữa sáng.',
    unit: 'Hộp',
    manufacturer: 'Healthy Plus',
    countryOfOrigin: 'Úc',
    form: 'Viên nén',
    specification: 'Hộp 30 viên',
    shelfLife: '36 tháng',
    ingredientHighlight: 'Mỗi viên chứa Vitamin C 1000mg và bioflavonoid.',
  },
  {
    slug: 'collagen-peptide',
    name: 'Collagen Peptide',
    subCategory: 'Làm đẹp',
    benefit: 'Hỗ trợ da, tóc và móng',
    description:
      'Collagen peptide thủy phân kết hợp biotin và kẽm cho nhu cầu chăm sóc sắc đẹp từ bên trong.',
    shortDescription:
      'Dòng collagen dạng bột cho người muốn nuôi dưỡng làn da và bổ sung dưỡng chất làm đẹp.',
    price: 559000,
    badge: 'Ưu đãi',
    ingredients: ['Marine collagen peptides 5000mg', 'Biotin 2500mcg', 'Zinc 7mg'],
    usage: 'Pha 1 muỗng với 200ml nước, dùng 1 lần mỗi ngày.',
    unit: 'Hộp',
    manufacturer: 'Beauty Nutrition Co.',
    countryOfOrigin: 'Nhật Bản',
    form: 'Bột hòa tan',
    specification: 'Hộp 15 gói',
    shelfLife: '24 tháng',
    ingredientHighlight: 'Mỗi khẩu phần chứa Collagen peptide 5000mg.',
  },
])

const skincareProducts = buildProducts('cham-soc-da', [
  {
    slug: 'gentle-cleanser-b5',
    name: 'Sữa rửa mặt Gentle Cleanser B5',
    subCategory: 'Làm sạch',
    benefit: 'Làm sạch dịu nhẹ, không khô da',
    description: 'Sữa rửa mặt dịu nhẹ với B5 và glycerin phù hợp da nhạy cảm và da thiếu ẩm.',
    shortDescription: 'Làm sạch cơ bản cho da nhạy cảm, giữ cảm giác mềm và ẩm sau khi rửa.',
    price: 245000,
    badge: 'Bán chạy',
    ingredients: ['Panthenol', 'Glycerin', 'Amino acid cleanser'],
    usage: 'Lấy lượng vừa đủ, massage trên da ướt rồi rửa sạch.',
    unit: 'Tuýp',
    manufacturer: 'Skin Lab Studio',
    countryOfOrigin: 'Hàn Quốc',
    form: 'Gel rửa mặt',
    specification: 'Tuýp 150ml',
    shelfLife: '24 tháng',
    ingredientHighlight: 'B5 và glycerin giúp làm sạch mà vẫn giữ độ ẩm tự nhiên.',
  },
  {
    slug: 'niacinamide-10-serum',
    name: 'Serum Niacinamide 10%',
    subCategory: 'Serum',
    benefit: 'Hỗ trợ sáng da và giảm dầu',
    description:
      'Serum niacinamide nồng độ 10% giúp cân bằng dầu, hỗ trợ đều màu da và bề mặt da mịn hơn.',
    shortDescription: 'Tinh chất phù hợp da dầu, lỗ chân lông to và da không đều màu.',
    price: 319000,
    badge: 'Nổi bật',
    ingredients: ['Niacinamide 10%', 'Zinc PCA'],
    usage: 'Thoa 2-3 giọt sau bước làm sạch và toner.',
    unit: 'Chai',
    manufacturer: 'Derma Focus',
    countryOfOrigin: 'Pháp',
    form: 'Tinh chất',
    specification: 'Chai 30ml',
    shelfLife: '24 tháng',
    ingredientHighlight: 'Niacinamide 10% hỗ trợ đều màu da và kiểm soát bã nhờn.',
  },
  {
    slug: 'cica-repair-cream',
    name: 'Kem dưỡng Cica Repair',
    subCategory: 'Dưỡng ẩm',
    benefit: 'Phục hồi và làm dịu da',
    description:
      'Kem dưỡng chứa cica, panthenol và squalane cho da nhạy cảm hoặc sau treatment.',
    shortDescription: 'Kem dưỡng cho da cần phục hồi, khóa ẩm và làm dịu nhanh.',
    price: 355000,
    badge: 'Nổi bật',
    ingredients: ['Centella asiatica', 'Panthenol', 'Squalane'],
    usage: 'Thoa đều sau serum ở bước cuối routine.',
    unit: 'Hũ',
    manufacturer: 'Skin Lab Studio',
    countryOfOrigin: 'Nhật Bản',
    form: 'Kem',
    specification: 'Hũ 50g',
    shelfLife: '24 tháng',
    ingredientHighlight: 'Cica, panthenol và squalane hỗ trợ làm dịu và khóa ẩm.',
  },
])

const deviceProducts = buildProducts('thiet-bi-y-te', [
  {
    slug: 'digital-thermometer-flex',
    name: 'Nhiệt kế điện tử đầu mềm Flex',
    subCategory: 'Nhiệt kế',
    benefit: 'Đo nhiệt độ nhanh và dễ đọc',
    description:
      'Nhiệt kế điện tử đầu mềm với màn hình rõ nét, phù hợp theo dõi tại nhà cho gia đình.',
    shortDescription: 'Thiết bị cơ bản cho tủ thuốc gia đình và nhu cầu chăm sóc trẻ nhỏ.',
    price: 125000,
    badge: 'Thiết yếu',
    ingredients: ['Đầu đo mềm', 'Màn hình LCD'],
    usage: 'Bật thiết bị, đặt đúng vị trí đo và chờ tín hiệu hoàn tất.',
    unit: 'Cái',
    manufacturer: 'CareTech Medical',
    countryOfOrigin: 'Nhật Bản',
    form: 'Thiết bị đo',
    specification: 'Hộp 1 cái',
    shelfLife: '60 tháng',
    ingredientHighlight: 'Đầu đo mềm, thời gian đo nhanh trong vài chục giây.',
  },
  {
    slug: 'blood-pressure-home',
    name: 'Máy đo huyết áp Home',
    subCategory: 'Máy đo huyết áp',
    benefit: 'Theo dõi huyết áp tại nhà',
    description:
      'Máy đo huyết áp bắp tay với màn hình lớn, thao tác một nút và có bộ nhớ lưu kết quả.',
    shortDescription: 'Thiết bị phù hợp cho gia đình và người lớn tuổi cần theo dõi định kỳ.',
    price: 890000,
    badge: 'Nổi bật',
    ingredients: ['Bộ nhớ lưu 60 kết quả', 'Màn hình LCD lớn'],
    usage: 'Quấn vòng bít đúng vị trí, ngồi thẳng và nhấn nút bắt đầu.',
    unit: 'Bộ',
    manufacturer: 'CareTech Medical',
    countryOfOrigin: 'Trung Quốc',
    form: 'Thiết bị điện tử',
    specification: 'Hộp 1 máy + vòng bít',
    shelfLife: '60 tháng',
    ingredientHighlight: 'Lưu bộ nhớ và hiển thị huyết áp, nhịp tim rõ ràng.',
  },
  {
    slug: 'mesh-nebulizer-air',
    name: 'Máy xông khí dung Mesh Air',
    subCategory: 'Máy xông',
    benefit: 'Hỗ trợ xông khí dung tại nhà',
    description:
      'Máy xông khí dung dạng mesh nhỏ gọn, độ ồn thấp và tiện mang theo khi cần.',
    shortDescription:
      'Giải pháp xông khí dung tiện lợi cho gia đình có trẻ nhỏ hoặc người lớn tuổi.',
    price: 1350000,
    badge: 'Cao cấp',
    ingredients: ['Công nghệ mesh', 'Cốc thuốc dung tích tiêu chuẩn'],
    usage: 'Cho dung dịch vào cốc, lắp mặt nạ và bật máy theo hướng dẫn.',
    unit: 'Bộ',
    manufacturer: 'MediAir',
    countryOfOrigin: 'Đức',
    form: 'Thiết bị điện tử',
    specification: 'Hộp 1 máy + phụ kiện',
    shelfLife: '48 tháng',
    ingredientHighlight: 'Công nghệ mesh cho hạt sương mịn, vận hành êm.',
  },
])

const medicineProducts = buildProducts('thuoc', [
  {
    slug: 'paracetamol-500',
    name: 'Paracetamol 500mg',
    subCategory: 'Giảm đau hạ sốt',
    benefit: 'Hỗ trợ giảm đau, hạ sốt',
    description:
      'Sản phẩm mock phục vụ trình diễn giao diện nhà thuốc online với thông tin cơ bản đầy đủ.',
    shortDescription: 'Dữ liệu mô phỏng cho nhóm thuốc giảm đau hạ sốt.',
    price: 32000,
    badge: 'Phổ biến',
    ingredients: ['Paracetamol 500mg'],
    usage: 'Dùng theo hướng dẫn của dược sĩ hoặc bác sĩ.',
    unit: 'Hộp',
    manufacturer: 'PharmaCare',
    countryOfOrigin: 'Việt Nam',
    form: 'Viên nén',
    specification: 'Hộp 10 vỉ x 10 viên',
    shelfLife: '36 tháng',
    ingredientHighlight: 'Mỗi viên chứa Paracetamol 500mg.',
  },
  {
    slug: 'cough-syrup-honey',
    name: 'Siro ho Honey',
    subCategory: 'Ho cảm',
    benefit: 'Hỗ trợ làm dịu họng',
    description:
      'Dữ liệu mock để mô phỏng danh mục thuốc với bố cục chi tiết, review và sản phẩm liên quan.',
    shortDescription: 'Sản phẩm mô phỏng cho nhóm siro ho và cảm.',
    price: 68000,
    badge: 'Mới',
    ingredients: ['Chiết xuất mật ong', 'Thảo dược làm dịu họng'],
    usage: 'Dùng theo hướng dẫn sử dụng trên bao bì.',
    unit: 'Chai',
    manufacturer: 'PharmaCare',
    countryOfOrigin: 'Việt Nam',
    form: 'Siro',
    specification: 'Chai 100ml',
    shelfLife: '24 tháng',
    ingredientHighlight: 'Công thức siro dịu họng mô phỏng cho nhóm ho cảm.',
  },
  {
    slug: 'allergy-relief-10mg',
    name: 'Allergy Relief 10mg',
    subCategory: 'Dị ứng',
    benefit: 'Hỗ trợ giảm triệu chứng dị ứng',
    description:
      'Dữ liệu mock dành cho thử nghiệm giao diện danh mục thuốc, không thay thế thông tin y khoa.',
    shortDescription: 'Mô phỏng một lựa chọn thuộc nhóm thuốc dị ứng.',
    price: 54000,
    badge: 'Tiện dụng',
    ingredients: ['Hoạt chất kháng histamine 10mg'],
    usage: 'Tham khảo hướng dẫn hoặc tư vấn chuyên môn trước khi dùng.',
    unit: 'Hộp',
    manufacturer: 'GlobalMed',
    countryOfOrigin: 'Ấn Độ',
    form: 'Viên nén',
    specification: 'Hộp 2 vỉ x 10 viên',
    shelfLife: '36 tháng',
    ingredientHighlight: 'Mỗi viên chứa hoạt chất kháng histamine 10mg.',
  },
])

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
