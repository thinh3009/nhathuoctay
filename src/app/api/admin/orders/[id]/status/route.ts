import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getAuthUser } from '@/lib/auth'
import { updateOrderStatus } from '@/features/orders/queries'

const schema = z.object({
  status: z.enum(['pending', 'confirmed', 'processing', 'shipping', 'delivered', 'cancelled', 'refunded']),
})

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser()
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  await updateOrderStatus(id, parsed.data.status)
  return NextResponse.json({ success: true })
}
