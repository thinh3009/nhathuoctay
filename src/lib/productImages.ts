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

// Tiền tố thư mục cho ảnh admin tải lên Supabase Storage (client-safe hằng số dùng chung).
export const UPLOAD_PREFIX = 'uploads'

// Loại ảnh được phép upload + phần mở rộng tương ứng (dùng chung client & server:
// client build `accept` + chặn sớm, server validate lại).
export const EXTENSION_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
}

export const ACCEPTED_IMAGE_MIME = Object.keys(EXTENSION_BY_MIME).join(',')

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024 // 5MB / ảnh

// Kiểm tra một đường dẫn trong bucket có phải ảnh admin tải lên không.
// Dùng chung cho isUploadedImage, cờ deletable ở /admin/images và validate DELETE route.
export function isUploadedPath(storagePath: string) {
  return storagePath.startsWith(`${UPLOAD_PREFIX}/`)
}

// Nhãn + kind gợi ý cho từng khe ảnh admin tải lên (theo thứ tự upload).
const ADMIN_IMAGE_SLOTS: Array<{ kind: ProductImageKind; label: string }> = [
  { kind: 'front', label: 'Ảnh chính' },
  { kind: 'angle', label: 'Góc nghiêng' },
  { kind: 'info', label: 'Thông tin' },
]

export function isUploadedImage(image: ProductImage) {
  return isUploadedPath(image.storagePath)
}

// Nhãn/kind cho ảnh thứ index (dùng khi admin thêm ảnh mới trong trình quản lý ảnh).
export function getAdminImageSlot(index: number) {
  const slot = ADMIN_IMAGE_SLOTS[index] ?? {
    kind: 'info' as ProductImageKind,
    label: `Ảnh ${index + 1}`,
  }
  return slot
}

// Dựng ProductImage cho ảnh vừa upload lên Storage.
export function buildUploadedProductImage(
  storagePath: string,
  publicUrl: string,
  index: number,
): ProductImage {
  const slot = getAdminImageSlot(index)
  return productImageSchema.parse({
    kind: slot.kind,
    label: slot.label,
    storagePath,
    fallbackSrc: publicUrl,
    src: publicUrl,
  })
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

// Parse chuỗi JSON ảnh từ input ẩn của ProductImageManager (dùng trong server action).
export function parseProductImagesJson(raw: unknown): ProductImage[] {
  if (typeof raw !== 'string' || raw.trim() === '') {
    return []
  }
  try {
    const parsed = productImageSchema.array().safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : []
  } catch {
    return []
  }
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
      // Ảnh admin tải lên Storage: luôn dựng public URL từ storagePath (bất kể fallback).
      if (isUploadedImage(parsed.data)) {
        const publicUrl = buildPublicProductImageUrl(parsed.data.storagePath)
        return productImageSchema.parse({
          ...parsed.data,
          src: publicUrl ?? parsed.data.src,
        })
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
