import { revalidatePath } from 'next/cache'
import { listUsers, setUserActive, updateUserRole, type UserRole } from '@/db/queries/users'
import { requireAdmin } from '@/lib/auth'
import CreateUserForm from './_components/CreateUserForm'

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Quản trị viên',
  pharmacist: 'Dược sĩ',
  customer: 'Khách hàng',
}

const ROLE_BADGE: Record<UserRole, string> = {
  admin: 'bg-emerald-100 text-emerald-700',
  pharmacist: 'bg-sky-100 text-sky-700',
  customer: 'bg-stone-100 text-stone-600',
}

const ROLE_VALUES: UserRole[] = ['customer', 'pharmacist', 'admin']

async function changeRole(formData: FormData) {
  'use server'
  const admin = await requireAdmin()
  const id = String(formData.get('id') ?? '')
  const role = String(formData.get('role') ?? '') as UserRole
  // Không cho tự đổi role của chính mình (tránh tự khóa quyền admin).
  if (!id || id === admin.userId || !ROLE_VALUES.includes(role)) {
    return
  }
  await updateUserRole(id, role)
  revalidatePath('/admin/users')
}

async function toggleActive(formData: FormData) {
  'use server'
  const admin = await requireAdmin()
  const id = String(formData.get('id') ?? '')
  const next = String(formData.get('next') ?? '') === 'true'
  // Không cho tự khóa tài khoản của chính mình.
  if (!id || id === admin.userId) {
    return
  }
  await setUserActive(id, next)
  revalidatePath('/admin/users')
}

export default async function AdminUsersPage() {
  const [admin, rows] = await Promise.all([requireAdmin(), listUsers()])

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-stone-900">Người dùng</h1>
          <p className="mt-1 text-stone-500">{rows.length} tài khoản</p>
        </div>
        <CreateUserForm />
      </div>

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50 text-left">
                <th className="px-4 py-3 font-semibold text-stone-600">Người dùng</th>
                <th className="px-4 py-3 font-semibold text-stone-600">Liên hệ</th>
                <th className="px-4 py-3 font-semibold text-stone-600">Vai trò</th>
                <th className="px-4 py-3 font-semibold text-stone-600">Trạng thái</th>
                <th className="px-4 py-3 font-semibold text-stone-600">Ngày tạo</th>
                <th className="px-4 py-3 font-semibold text-stone-600">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {rows.map((user) => {
                const role = user.role as UserRole
                const isSelf = user.id === admin.userId

                return (
                  <tr className="hover:bg-stone-50" key={user.id}>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-stone-900">
                        {user.fullName}
                        {isSelf ? (
                          <span className="ml-2 rounded-full bg-emerald-700 px-2 py-0.5 text-[10px] font-bold text-white">
                            Bạn
                          </span>
                        ) : null}
                      </p>
                      <p className="text-xs text-stone-400">{user.email}</p>
                    </td>
                    <td className="px-4 py-3 text-stone-600">{user.phone ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${ROLE_BADGE[role]}`}>
                        {ROLE_LABELS[role]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          user.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {user.isActive ? 'Hoạt động' : 'Đã khóa'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stone-500">
                      {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-3">
                      {isSelf ? (
                        <span className="text-xs text-stone-400">Không thể tự sửa</span>
                      ) : (
                        <div className="flex flex-wrap items-center gap-2">
                          <form action={changeRole} className="flex items-center gap-1.5">
                            <input name="id" type="hidden" value={user.id} />
                            <select
                              className="rounded-lg border border-stone-300 px-2 py-1 text-xs outline-none focus:border-emerald-500"
                              defaultValue={role}
                              name="role"
                            >
                              {ROLE_VALUES.map((value) => (
                                <option key={value} value={value}>
                                  {ROLE_LABELS[value]}
                                </option>
                              ))}
                            </select>
                            <button
                              className="rounded-lg bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-600 hover:bg-emerald-100 hover:text-emerald-700"
                              type="submit"
                            >
                              Lưu
                            </button>
                          </form>

                          <form action={toggleActive}>
                            <input name="id" type="hidden" value={user.id} />
                            <input name="next" type="hidden" value={user.isActive ? 'false' : 'true'} />
                            <button
                              className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                                user.isActive
                                  ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              }`}
                              type="submit"
                            >
                              {user.isActive ? 'Khóa' : 'Mở khóa'}
                            </button>
                          </form>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
