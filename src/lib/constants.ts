export const CATEGORY_SLUGS = [
  'thuc-pham-chuc-nang',
  'cham-soc-da',
  'thiet-bi-y-te',
  'thuoc',
] as const

export type CategorySlug = (typeof CATEGORY_SLUGS)[number]

export const CATEGORY_CONFIG = [
  {
    slug: 'thuc-pham-chuc-nang',
    label: 'Thực phẩm chức năng',
    heroTitle: 'Giải pháp bổ sung dinh dưỡng theo từng nhu cầu sức khỏe',
    heroDescription:
      'Danh mục chọn sẵn theo tim mạch, đề kháng, làm đẹp và xương khớp để bạn tìm sản phẩm nhanh hơn.',
  },
  {
    slug: 'cham-soc-da',
    label: 'Chăm sóc da',
    heroTitle: 'Sản phẩm chăm sóc da cho routine hằng ngày',
    heroDescription:
      'Từ làm sạch, serum đến dưỡng ẩm phục hồi, mọi lựa chọn đều được nhóm gọn để xem và so sánh dễ hơn.',
  },
  {
    slug: 'thiet-bi-y-te',
    label: 'Thiết bị y tế',
    heroTitle: 'Thiết bị theo dõi sức khỏe và chăm sóc tại nhà',
    heroDescription:
      'Máy đo, nhiệt kế và thiết bị hỗ trợ cơ bản cho gia đình, dễ lựa chọn theo nhu cầu sử dụng thực tế.',
  },
  {
    slug: 'thuoc',
    label: 'Thuốc',
    heroTitle: 'Danh mục thuốc thông dụng cho nhu cầu cơ bản',
    heroDescription:
      'Dữ liệu hiện là mock để hoàn thiện giao diện nhà thuốc online và trải nghiệm xem sản phẩm.',
  },
] as const satisfies ReadonlyArray<{
  slug: CategorySlug
  label: string
  heroTitle: string
  heroDescription: string
}>

export const DEFAULT_CATEGORY_SLUG: CategorySlug = 'thuc-pham-chuc-nang'
export const CART_COOKIE_NAME = 'nhathuoc16_cart'
export const AUTH_COOKIE_NAME = 'nhathuoc16_auth'
export const PRODUCTS_PER_PAGE = 10
export const ALL_SUBCATEGORY_LABEL = 'Tất cả'

export const PRODUCT_SORT_OPTIONS = [
  'featured',
  'price-asc',
  'price-desc',
  'name-asc',
  'rating-desc',
] as const

export const PRODUCT_PRICE_RANGES = ['all', 'under-200', '200-400', 'over-400'] as const
