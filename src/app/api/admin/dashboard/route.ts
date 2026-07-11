import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { getDashboardData } from '@/features/dashboard/queries'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
// (nhãn danh mục dùng CATEGORY_CONFIG trong getInventoryStats)

// Dữ liệu dashboard cho client tự làm mới (auto 10s + nút refresh). ?days= lọc biểu đồ trạng thái.
export async function GET(request: Request) {
  const user = await getAuthUser()
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Không có quyền.' }, { status: 403 })
  }

  const raw = new URL(request.url).searchParams.get('days')
  const parsed = raw === null ? 30 : Number(raw)
  const days = Number.isFinite(parsed) && parsed >= 0 ? parsed : 30

  try {
    const data = await getDashboardData(days)
    return NextResponse.json(data)
  } catch (error) {
    console.error('[dashboard] error', error)
    return NextResponse.json({ error: 'Không tải được dữ liệu.' }, { status: 500 })
  }
}
