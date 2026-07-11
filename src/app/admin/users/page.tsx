import { listUsers } from '@/features/users/queries'
import { requireAdmin } from '@/lib/auth'
import UsersManager, { type UserRow } from '@/features/users/components/UsersManager'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  const [admin, rows] = await Promise.all([requireAdmin(), listUsers()])

  return <UsersManager rows={rows as UserRow[]} adminId={admin.userId} />
}
