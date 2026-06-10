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
      'Danh mục chọn sẵn theo tim mạch, đề kháng, xương khớp và làm đẹp để bạn tìm nhanh hơn.',
  },
  {
    slug: 'cham-soc-da',
    label: 'Chăm sóc da',
    heroTitle: 'Sản phẩm chăm sóc da theo chu trình hằng ngày',
    heroDescription:
      'Từ làm sạch, dưỡng ẩm đến chống nắng và serum đặc trị, mọi lựa chọn đều được nhóm sẵn.',
  },
  {
    slug: 'thiet-bi-y-te',
    label: 'Thiết bị y tế',
    heroTitle: 'Thiết bị theo dõi sức khỏe và chăm sóc tại nhà',
    heroDescription:
      'Máy đo, nhiệt kế, máy xông và vật tư cơ bản cho nhu cầu sử dụng gia đình.',
  },
  {
    slug: 'thuoc',
    label: 'Thuốc',
    heroTitle: 'Danh mục thuốc phổ biến cho nhu cầu thông dụng',
    heroDescription:
      'Dữ liệu hiện là mock để hoàn thiện giao diện, phù hợp cho việc duyệt và thử trải nghiệm.',
  },
] as const satisfies ReadonlyArray<{
  slug: CategorySlug
  label: string
  heroTitle: string
  heroDescription: string
}>

export const DEFAULT_CATEGORY_SLUG: CategorySlug = 'thuc-pham-chuc-nang'
export const CART_COOKIE_NAME = 'nutrihome_cart_id'
export const PRODUCTS_PER_PAGE = 20

export const PRODUCT_SORT_OPTIONS = [
  'featured',
  'price-asc',
  'price-desc',
  'name-asc',
  'rating-desc',
] as const

export const PRODUCT_PRICE_RANGES = ['all', 'under-200', '200-400', 'over-400'] as const
