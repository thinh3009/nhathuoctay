'use server'

import { redirect } from 'next/navigation'
import { revalidatePath, updateTag } from 'next/cache'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { products } from '@/db/schema'
import { requireAdmin } from '@/lib/auth'
import { parsePrescription } from '@/lib/prescription'
import { parseProductImagesJson } from '@/lib/productImages'
import { STOREFRONT_CACHE_TAG } from '@/features/storefront/queries'
import { productCoreSchema } from './schemas'

// Đọc field text tự do (mặc định chuỗi rỗng).
function text(formData: FormData, key: string): string {
  const value = formData.get(key)
  return typeof value === 'string' ? value : ''
}

export async function createProduct(formData: FormData) {
  await requireAdmin()

  const parsed = productCoreSchema.safeParse({
    name: formData.get('name'),
    categorySlug: formData.get('categorySlug'),
    price: formData.get('price'),
    salePrice: formData.get('salePrice'),
    stockQuantity: formData.get('stockQuantity'),
  })
  if (!parsed.success) return // chặn ghi dữ liệu sai; form không hiển thị lỗi chi tiết

  const { name, categorySlug, price, salePrice, stockQuantity } = parsed.data
  const slug = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')

  // Ảnh admin đã upload lên Storage (JSON từ ProductImageManager). Trống → dùng ảnh demo.
  const images = parseProductImagesJson(formData.get('images'))

  await db.insert(products).values({
    slug: `${slug}-${Date.now()}`,
    categorySlug,
    name,
    subCategory: text(formData, 'subCategory') || name,
    benefit: text(formData, 'benefit'),
    description: text(formData, 'description'),
    shortDescription: text(formData, 'shortDescription'),
    price,
    salePrice,
    badge: text(formData, 'badge') || 'Mới',
    ingredients: [],
    usage: text(formData, 'usage'),
    unit: text(formData, 'unit') || 'hộp',
    defaultQuantity: 1,
    sku: text(formData, 'sku') || `SKU-${Date.now()}`,
    rating: 5.0,
    reviewCount: 0,
    commentCount: 0,
    officialName: name,
    registrationNumber: '',
    form: '',
    specification: '',
    manufacturer: text(formData, 'manufacturer'),
    countryOfOrigin: text(formData, 'countryOfOrigin') || 'Việt Nam',
    shelfLife: '',
    ingredientHighlight: '',
    images,
    isActive: true,
    stockQuantity,
    // 3 trạng thái: 'true' = kê đơn, 'false' = không kê đơn, '' = trống (null).
    prescriptionRequired: parsePrescription(formData.get('prescriptionRequired')),
  })

  revalidatePath('/admin/products')
  updateTag(STOREFRONT_CACHE_TAG) // data cache trang chủ hiển thị sản phẩm mới ngay
  revalidatePath(`/category/${categorySlug}`)
  redirect('/admin/products')
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin()

  const parsed = productCoreSchema.safeParse({
    name: formData.get('name'),
    categorySlug: formData.get('categorySlug'),
    price: formData.get('price'),
    salePrice: formData.get('salePrice'),
    stockQuantity: formData.get('stockQuantity'),
  })
  if (!parsed.success) return

  const { name, categorySlug, price, salePrice, stockQuantity } = parsed.data

  // Ảnh admin đã upload (JSON từ ProductImageManager). Trống → dùng ảnh demo theo danh mục.
  const images = parseProductImagesJson(formData.get('images'))

  await db
    .update(products)
    .set({
      name,
      categorySlug,
      subCategory: text(formData, 'subCategory'),
      benefit: text(formData, 'benefit'),
      shortDescription: text(formData, 'shortDescription'),
      description: text(formData, 'description'),
      price,
      salePrice,
      badge: text(formData, 'badge'),
      usage: text(formData, 'usage'),
      unit: text(formData, 'unit'),
      manufacturer: text(formData, 'manufacturer'),
      countryOfOrigin: text(formData, 'countryOfOrigin'),
      stockQuantity,
      isActive: formData.get('isActive') === 'true',
      // 3 trạng thái: 'true' = kê đơn, 'false' = không kê đơn, '' = trống (null).
      prescriptionRequired: parsePrescription(formData.get('prescriptionRequired')),
      images,
      updatedAt: new Date(),
    })
    .where(eq(products.id, id))

  revalidatePath('/admin/products')
  updateTag(STOREFRONT_CACHE_TAG) // data cache trang chủ cập nhật ngay
  revalidatePath(`/category/${categorySlug}`)
  redirect('/admin/products')
}
