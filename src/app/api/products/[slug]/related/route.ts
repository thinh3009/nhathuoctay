import { NextResponse } from 'next/server'
import { getProductBySlug, getRelatedProducts } from '@/features/products/queries'
import { jsonError } from '@/lib/api'
import { relatedProductsResponseSchema } from '@/lib/schemas'

type ProductRelatedRouteProps = {
  params: Promise<{
    slug: string
  }>
}

export async function GET(_: Request, { params }: ProductRelatedRouteProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return jsonError(404, 'Product not found')
  }

  return NextResponse.json(
    relatedProductsResponseSchema.parse({
      items: await getRelatedProducts(product, 6),
    }),
  )
}
