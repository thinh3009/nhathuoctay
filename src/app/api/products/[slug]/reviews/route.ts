import { NextResponse } from 'next/server'
import { getProductReviews } from '@/db/queries/catalog'
import { jsonError } from '@/lib/api'

type ProductReviewsRouteProps = {
  params: Promise<{
    slug: string
  }>
}

export async function GET(_: Request, { params }: ProductReviewsRouteProps) {
  const { slug } = await params
  const productReviews = await getProductReviews(slug)

  if (!productReviews) {
    return jsonError(404, 'Product not found')
  }

  return NextResponse.json(productReviews)
}
