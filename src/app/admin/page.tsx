import { requireAdmin } from '@/lib/auth'
import { getDashboardData } from '@/features/dashboard/queries'
import DashboardClient from '@/features/dashboard/components/DashboardClient'

// Dữ liệu realtime: SSR lần đầu, client tự làm mới (auto 10s + nút "Làm mới").
export const dynamic = 'force-dynamic'

const DEFAULT_RANGE_DAYS = 30

export default async function AdminDashboard() {
  await requireAdmin()
  const initial = await getDashboardData(DEFAULT_RANGE_DAYS)
  return <DashboardClient initial={initial} />
}
