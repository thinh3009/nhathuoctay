import { NextResponse } from 'next/server'
import { getProductBySlug } from '@/db/queries/catalog'
import { jsonError } from '@/lib/api'
import { productSchema } from '@/lib/schemas'

type ProductRouteProps = {
  params: Promise<{
    slug: string
  }>
}

export async function GET(_: Request, { params }: ProductRouteProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return jsonError(404, 'Product not found')
  }

  return NextResponse.json(productSchema.parse(product))
}
