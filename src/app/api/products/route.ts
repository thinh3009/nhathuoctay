import { NextResponse } from 'next/server'
import { listProducts } from '@/features/products/queries'
import { jsonError } from '@/lib/api'
import { productListResponseSchema } from '@/lib/schemas'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const result = await listProducts({
    category: searchParams.get('category') ?? undefined,
    subCategory: searchParams.get('subCategory') ?? undefined,
    priceRange: searchParams.get('priceRange') ?? undefined,
    sort: searchParams.get('sort') ?? undefined,
    page: searchParams.get('page') ?? undefined,
    pageSize: searchParams.get('pageSize') ?? undefined,
  })

  if (!result) {
    return jsonError(404, 'Category not found')
  }

  return NextResponse.json(
    productListResponseSchema.parse({
      category: result.category,
      filters: result.filters,
      items: result.items,
      pagination: result.pagination,
    }),
  )
}
