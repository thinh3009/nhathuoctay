import type { CategorySlug } from './constants.ts'
import { productImageSchema, type Product, type ProductImage } from './schemas.ts'

export const PRODUCT_IMAGE_BUCKET = 'product-images'

type ProductImageKind = ProductImage['kind']

type ProductImageAsset = {
  kind: ProductImageKind
  label: string
  sourceFile: string
  targetFileName: string
}

const sharedAssets = {
  supplementFront: 'medicine-1.jpg',
  supplementAngle: 'medicine-2.jpg',
  skincareFront: 'skincare-1.jpg',
  skincareAngle: 'skincare-2.jpg',
  skincareDetail: 'skincare-3.jpg',
  deviceFront: 'device-1.jpg',
  deviceAngle: 'device-2.jpg',
  medicineFront: 'medicine-1.jpg',
  medicineAngle: 'medicine-2.jpg',
} as const

const fallbackImageAssetsByCategory: Record<CategorySlug, ProductImageAsset[]> = {
  'thuc-pham-chuc-nang': [
    {
      kind: 'front',
      label: 'Ảnh chính',
      sourceFile: sharedAssets.supplementFront,
      targetFileName: 'front.jpg',
    },
    {
      kind: 'angle',
      label: 'Góc nghiêng',
      sourceFile: sharedAssets.supplementAngle,
      targetFileName: 'angle.jpg',
    },
    {
      kind: 'info',
      label: 'Thông tin',
      sourceFile: sharedAssets.supplementFront,
      targetFileName: 'info.jpg',
    },
  ],
  'cham-soc-da': [
    {
      kind: 'front',
      label: 'Ảnh chính',
      sourceFile: sharedAssets.skincareFront,
      targetFileName: 'front.jpg',
    },
    {
      kind: 'angle',
      label: 'Góc nghiêng',
      sourceFile: sharedAssets.skincareAngle,
      targetFileName: 'angle.jpg',
    },
    {
      kind: 'info',
      label: 'Thông tin',
      sourceFile: sharedAssets.skincareDetail,
      targetFileName: 'info.jpg',
    },
  ],
  'thiet-bi-y-te': [
    {
      kind: 'front',
      label: 'Ảnh chính',
      sourceFile: sharedAssets.deviceFront,
      targetFileName: 'front.jpg',
    },
    {
      kind: 'angle',
      label: 'Góc nghiêng',
      sourceFile: sharedAssets.deviceAngle,
      targetFileName: 'angle.jpg',
    },
    {
      kind: 'info',
      label: 'Thông tin',
      sourceFile: sharedAssets.deviceFront,
      targetFileName: 'info.jpg',
    },
  ],
  thuoc: [
    {
      kind: 'front',
      label: 'Ảnh chính',
      sourceFile: sharedAssets.medicineFront,
      targetFileName: 'front.jpg',
    },
    {
      kind: 'angle',
      label: 'Góc nghiêng',
      sourceFile: sharedAssets.medicineAngle,
      targetFileName: 'angle.jpg',
    },
    {
      kind: 'info',
      label: 'Thông tin',
      sourceFile: sharedAssets.medicineFront,
      targetFileName: 'info.jpg',
    },
  ],
}

const productImageAssets: Record<string, ProductImageAsset[]> = {
  'omega-3-premium': [
    {
      kind: 'front',
      label: 'Ảnh chính',
      sourceFile: sharedAssets.supplementFront,
      targetFileName: 'front.jpg',
    },
    {
      kind: 'angle',
      label: 'Góc nghiêng',
      sourceFile: sharedAssets.supplementAngle,
      targetFileName: 'angle.jpg',
    },
    {
      kind: 'info',
      label: 'Thông tin',
      sourceFile: 'omega-3-premium-info.svg',
      targetFileName: 'info.svg',
    },
  ],
  'vitamin-c-1000mg': [
    {
      kind: 'front',
      label: 'Ảnh chính',
      sourceFile: sharedAssets.supplementAngle,
      targetFileName: 'front.jpg',
    },
    {
      kind: 'angle',
      label: 'Góc nghiêng',
      sourceFile: sharedAssets.supplementFront,
      targetFileName: 'angle.jpg',
    },
    {
      kind: 'info',
      label: 'Thông tin',
      sourceFile: 'vitamin-c-1000mg-info.svg',
      targetFileName: 'info.svg',
    },
  ],
  'collagen-peptide': [
    {
      kind: 'front',
      label: 'Ảnh chính',
      sourceFile: sharedAssets.supplementFront,
      targetFileName: 'front.jpg',
    },
    {
      kind: 'angle',
      label: 'Góc nghiêng',
      sourceFile: sharedAssets.supplementAngle,
      targetFileName: 'angle.jpg',
    },
    {
      kind: 'info',
      label: 'Thông tin',
      sourceFile: 'collagen-peptide-info.svg',
      targetFileName: 'info.svg',
    },
  ],
  'gentle-cleanser-b5': [
    {
      kind: 'front',
      label: 'Ảnh chính',
      sourceFile: sharedAssets.skincareFront,
      targetFileName: 'front.jpg',
    },
    {
      kind: 'angle',
      label: 'Góc nghiêng',
      sourceFile: sharedAssets.skincareAngle,
      targetFileName: 'angle.jpg',
    },
    {
      kind: 'info',
      label: 'Thông tin',
      sourceFile: sharedAssets.skincareDetail,
      targetFileName: 'info.jpg',
    },
  ],
  'niacinamide-10-serum': [
    {
      kind: 'front',
      label: 'Ảnh chính',
      sourceFile: sharedAssets.skincareAngle,
      targetFileName: 'front.jpg',
    },
    {
      kind: 'angle',
      label: 'Góc nghiêng',
      sourceFile: sharedAssets.skincareDetail,
      targetFileName: 'angle.jpg',
    },
    {
      kind: 'info',
      label: 'Thông tin',
      sourceFile: sharedAssets.skincareFront,
      targetFileName: 'info.jpg',
    },
  ],
  'cica-repair-cream': [
    {
      kind: 'front',
      label: 'Ảnh chính',
      sourceFile: sharedAssets.skincareDetail,
      targetFileName: 'front.jpg',
    },
    {
      kind: 'angle',
      label: 'Góc nghiêng',
      sourceFile: sharedAssets.skincareFront,
      targetFileName: 'angle.jpg',
    },
    {
      kind: 'info',
      label: 'Thông tin',
      sourceFile: sharedAssets.skincareAngle,
      targetFileName: 'info.jpg',
    },
  ],
  'digital-thermometer-flex': [
    {
      kind: 'front',
      label: 'Ảnh chính',
      sourceFile: sharedAssets.deviceFront,
      targetFileName: 'front.jpg',
    },
    {
      kind: 'angle',
      label: 'Góc nghiêng',
      sourceFile: sharedAssets.deviceAngle,
      targetFileName: 'angle.jpg',
    },
    {
      kind: 'info',
      label: 'Thông tin',
      sourceFile: 'digital-thermometer-flex-info.svg',
      targetFileName: 'info.svg',
    },
  ],
  'blood-pressure-home': [
    {
      kind: 'front',
      label: 'Ảnh chính',
      sourceFile: sharedAssets.deviceAngle,
      targetFileName: 'front.jpg',
    },
    {
      kind: 'angle',
      label: 'Góc nghiêng',
      sourceFile: sharedAssets.deviceFront,
      targetFileName: 'angle.jpg',
    },
    {
      kind: 'info',
      label: 'Thông tin',
      sourceFile: 'blood-pressure-home-info.svg',
      targetFileName: 'info.svg',
    },
  ],
  'mesh-nebulizer-air': [
    {
      kind: 'front',
      label: 'Ảnh chính',
      sourceFile: sharedAssets.deviceFront,
      targetFileName: 'front.jpg',
    },
    {
      kind: 'angle',
      label: 'Góc nghiêng',
      sourceFile: sharedAssets.deviceAngle,
      targetFileName: 'angle.jpg',
    },
    {
      kind: 'info',
      label: 'Thông tin',
      sourceFile: 'mesh-nebulizer-air-info.svg',
      targetFileName: 'info.svg',
    },
  ],
  'paracetamol-500': [
    {
      kind: 'front',
      label: 'Ảnh chính',
      sourceFile: sharedAssets.medicineFront,
      targetFileName: 'front.jpg',
    },
    {
      kind: 'angle',
      label: 'Góc nghiêng',
      sourceFile: sharedAssets.medicineAngle,
      targetFileName: 'angle.jpg',
    },
    {
      kind: 'info',
      label: 'Thông tin',
      sourceFile: 'paracetamol-500-info.svg',
      targetFileName: 'info.svg',
    },
  ],
  'cough-syrup-honey': [
    {
      kind: 'front',
      label: 'Ảnh chính',
      sourceFile: sharedAssets.medicineAngle,
      targetFileName: 'front.jpg',
    },
    {
      kind: 'angle',
      label: 'Góc nghiêng',
      sourceFile: sharedAssets.medicineFront,
      targetFileName: 'angle.jpg',
    },
    {
      kind: 'info',
      label: 'Thông tin',
      sourceFile: 'cough-syrup-honey-info.svg',
      targetFileName: 'info.svg',
    },
  ],
  'allergy-relief-10mg': [
    {
      kind: 'front',
      label: 'Ảnh chính',
      sourceFile: sharedAssets.medicineFront,
      targetFileName: 'front.jpg',
    },
    {
      kind: 'angle',
      label: 'Góc nghiêng',
      sourceFile: sharedAssets.medicineAngle,
      targetFileName: 'angle.jpg',
    },
    {
      kind: 'info',
      label: 'Thông tin',
      sourceFile: 'allergy-relief-10mg-info.svg',
      targetFileName: 'info.svg',
    },
  ],
}

function buildPublicProductImageUrl(storagePath: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL

  if (!supabaseUrl) {
    return null
  }

  return `${supabaseUrl}/storage/v1/object/public/${PRODUCT_IMAGE_BUCKET}/${storagePath}`
}

function buildFallbackPath(sourceFile: string) {
  return `/demo-products/${sourceFile}`
}

export function buildProductStoragePath(
  categorySlug: CategorySlug,
  productSlug: string,
  targetFileName: string,
) {
  return `${categorySlug}/${productSlug}/${targetFileName}`
}

export function getProductImageAssets(productSlug: string) {
  return productImageAssets[productSlug] ?? []
}

// Nhãn + kind cho 3 khe ảnh mà admin nhập tay (theo thứ tự).
const ADMIN_IMAGE_SLOTS: Array<{ kind: ProductImageKind; label: string }> = [
  { kind: 'front', label: 'Ảnh chính' },
  { kind: 'angle', label: 'Góc nghiêng' },
  { kind: 'info', label: 'Thông tin' },
]

// Đánh dấu ảnh admin dán URL bằng storagePath 'external-*' để normalize giữ nguyên src.
export const EXTERNAL_IMAGE_PREFIX = 'external'

function isExternalImage(image: ProductImage) {
  return image.storagePath.startsWith(EXTERNAL_IMAGE_PREFIX)
}

// Tạo ProductImage[] từ danh sách URL admin nhập (bỏ ô trống). Tối đa 3 ảnh.
export function buildExternalProductImages(urls: Array<string | null | undefined>): ProductImage[] {
  return urls
    .map((url) => (typeof url === 'string' ? url.trim() : ''))
    .filter((url) => url.length > 0)
    .slice(0, ADMIN_IMAGE_SLOTS.length)
    .map((url, index) => {
      const slot = ADMIN_IMAGE_SLOTS[index]
      return productImageSchema.parse({
        kind: slot.kind,
        label: slot.label,
        storagePath: `${EXTERNAL_IMAGE_PREFIX}-${index}`,
        fallbackSrc: url,
        src: url,
      })
    })
}

// Lấy lại danh sách URL admin đã nhập (để prefill form sửa). Trả mảng 3 phần tử.
export function getExternalImageUrls(rawImages: unknown): string[] {
  const rawList = Array.isArray(rawImages) ? rawImages : []
  const urls = rawList
    .map((raw) => productImageSchema.safeParse(raw))
    .filter((parsed) => parsed.success && isExternalImage(parsed.data))
    .map((parsed) => (parsed.success ? parsed.data.src : ''))

  return [urls[0] ?? '', urls[1] ?? '', urls[2] ?? '']
}

export function buildProductImages(categorySlug: CategorySlug, productSlug: string): ProductImage[] {
  const assets = getProductImageAssets(productSlug)
  // Chỉ sản phẩm có ảnh được khai báo (đã upload lên Supabase) mới dùng URL remote.
  // Sản phẩm dùng ảnh fallback (vd: sản phẩm mẫu) trỏ thẳng ảnh demo local để tránh lỗi 400.
  const usingFallback = assets.length === 0
  const assetList = usingFallback ? fallbackImageAssetsByCategory[categorySlug] : assets

  return assetList.map((asset) => {
    const storagePath = buildProductStoragePath(categorySlug, productSlug, asset.targetFileName)
    const fallbackSrc = buildFallbackPath(asset.sourceFile)
    const remoteSrc = usingFallback ? null : buildPublicProductImageUrl(storagePath)

    return productImageSchema.parse({
      kind: asset.kind,
      label: asset.label,
      storagePath,
      fallbackSrc,
      src: remoteSrc ?? fallbackSrc,
    })
  })
}

export function normalizeProductImages(
  categorySlug: CategorySlug,
  productSlug: string,
  rawImages: unknown,
) {
  const rawList = Array.isArray(rawImages) ? rawImages : []
  const manifest = buildProductImages(categorySlug, productSlug)
  // Sản phẩm dùng ảnh fallback (không khai báo asset, chưa upload Supabase) phải giữ ảnh local.
  const usingFallback = getProductImageAssets(productSlug).length === 0

  if (rawList.length === 0) {
    return manifest
  }

  if (typeof rawList[0] === 'string') {
    return manifest.map((image, index) =>
      productImageSchema.parse({
        ...image,
        label: typeof rawList[index] === 'string' ? rawList[index] : image.label,
      }),
    )
  }

  return rawList.map((rawImage, index) => {
    const parsed = productImageSchema.safeParse(rawImage)

    if (parsed.success) {
      // Ảnh admin dán URL: giữ nguyên src, không dựng lại từ Supabase storage.
      if (isExternalImage(parsed.data)) {
        return parsed.data
      }

      const remoteSrc = usingFallback ? null : buildPublicProductImageUrl(parsed.data.storagePath)

      return productImageSchema.parse({
        ...parsed.data,
        src: remoteSrc ?? parsed.data.fallbackSrc,
      })
    }

    return manifest[index] ?? manifest[0]
  })
}

export function getPrimaryProductImage(product: Product) {
  return product.images[0] ?? null
}

export function getProductImageSrc(image: ProductImage) {
  return image.src
}

export function getProductImageUploadTasks(categorySlug: CategorySlug, productSlug: string) {
  return getProductImageAssets(productSlug).map((asset) => ({
    productSlug,
    categorySlug,
    kind: asset.kind,
    label: asset.label,
    sourceFile: asset.sourceFile,
    targetFileName: asset.targetFileName,
    storagePath: buildProductStoragePath(categorySlug, productSlug, asset.targetFileName),
    contentType: asset.targetFileName.endsWith('.svg') ? 'image/svg+xml' : 'image/jpeg',
  }))
}

export function getAllProductImageUploadTasks(products: Array<Pick<Product, 'slug' | 'topCategorySlug'>>) {
  return products.flatMap((product) => getProductImageUploadTasks(product.topCategorySlug, product.slug))
}
