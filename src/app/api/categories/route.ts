import { NextResponse } from 'next/server'
import { getCategoryNavItems } from '@/db/queries/catalog'
import { categoriesResponseSchema } from '@/lib/schemas'

export async function GET() {
  const items = await getCategoryNavItems()

  return NextResponse.json(
    categoriesResponseSchema.parse({
      items,
    }),
  )
}
