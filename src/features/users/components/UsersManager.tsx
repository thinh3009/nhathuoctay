'use client'

import { useMemo, useState } from 'react'
import { changeRole, editUser, removeUser, toggleActive } from '@/features/users/actions'
import { USER_ROLES } from '@/features/users/schemas'
import type { UserRole } from '@/features/users/queries'
import CreateUserForm from './CreateUserForm'
import DeleteUserButton from './DeleteUserButton'
import EditUserButton from './EditUserButton'

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Quản trị viên',
  pharmacist: 'Dược sĩ',
  customer: 'Khách hàng',
}

const ROLE_BADGE: Record<UserRole, string> = {
  admin: 'bg-brand-100 text-brand-800',
  pharmacist: 'bg-amber-100 text-amber-700',
  customer: 'bg-stone-100 text-stone-600',
}

export type UserRow = {
  id: string
  email: string
  fullName: string
  phone: string | null
  role: string
  isActive: boolean
  emailVerified: boolean
  createdAt: string | Date
}

export default function UsersManager({ rows, adminId }: { rows: UserRow[]; adminId: string }) {
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'locked'>('all')

  const stats = useMemo(() => {
    const by = { admin: 0, pharmacist: 0, customer: 0 }
    for (const u of rows) by[(u.role as UserRole)] = (by[(u.role as UserRole)] ?? 0) + 1
    return { total: rows.length, ...by, active: rows.filter((u) => u.isActive).length }
  }, [rows])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter((u) => {
      if (roleFilter !== 'all' && u.role !== roleFilter) return false
      if (statusFilter === 'active' && !u.isActive) return false
      if (statusFilter === 'locked' && u.isActive) return false
      if (q && !(`${u.fullName} ${u.email} ${u.phone ?? ''}`.toLowerCase().includes(q))) return false
      return true
    })
  }, [rows, query, roleFilter, statusFilter])

  const statCards = [
    { label: 'Tổng tài khoản', value: stats.total, icon: 'ph-users-three', tone: 'bg-brand-50 text-brand-700' },
    { label: 'Quản trị viên', value: stats.admin, icon: 'ph-shield-star', tone: 'bg-brand-50 text-brand-700' },
    { label: 'Dược sĩ', value: stats.pharmacist, icon: 'ph-first-aid-kit', tone: 'bg-amber-50 text-amber-700' },
    { label: 'Khách hàng', value: stats.customer, icon: 'ph-user', tone: 'bg-stone-100 text-stone-600' },
  ]

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-stone-900">Người dùng</h1>
          <p className="mt-1 text-sm text-stone-500">Quản lý tài khoản, phân quyền và trạng thái truy cập.</p>
        </div>
        <CreateUserForm />
      </div>

      {/* Thống kê nhanh */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statCards.map((c) => (
          <div key={c.label} className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-4">
            <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${c.tone}`}>
              <i className={`ph ${c.icon} text-2xl`} />
            </span>
            <div>
              <p className="text-2xl font-black text-stone-900">{c.value}</p>
              <p className="text-xs font-medium text-stone-500">{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bộ lọc */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2.5">
          <i className="ph ph-magnifying-glass text-lg text-stone-400" />
          <input
            className="w-full border-none bg-transparent text-sm text-stone-800 outline-none placeholder:text-stone-400"
            placeholder="Tìm theo tên, email, số điện thoại…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm font-medium text-stone-700 outline-none focus:border-brand-500"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as 'all' | UserRole)}
        >
          <option value="all">Tất cả vai trò</option>
          {USER_ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
        </select>
        <select
          className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm font-medium text-stone-700 outline-none focus:border-brand-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'locked')}
        >
          <option value="all">Mọi trạng thái</option>
          <option value="active">Đang hoạt động</option>
          <option value="locked">Đã khóa</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-brand-50/60 text-left">
                <th className="px-4 py-3 font-semibold text-stone-600">Người dùng</th>
                <th className="px-4 py-3 font-semibold text-stone-600">Liên hệ</th>
                <th className="px-4 py-3 font-semibold text-stone-600">Vai trò</th>
                <th className="px-4 py-3 font-semibold text-stone-600">Trạng thái</th>
                <th className="px-4 py-3 font-semibold text-stone-600">Ngày tạo</th>
                <th className="px-4 py-3 font-semibold text-stone-600">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.length === 0 ? (
                <tr>
                  <td className="px-4 py-10 text-center text-stone-400" colSpan={6}>Không tìm thấy tài khoản phù hợp.</td>
                </tr>
              ) : filtered.map((user) => {
                const role = user.role as UserRole
                const isSelf = user.id === adminId
                const initial = (user.fullName || user.email).charAt(0).toUpperCase()

                return (
                  <tr className="hover:bg-brand-50/40" key={user.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-800">{initial}</span>
                        <div>
                          <p className="font-semibold text-stone-900">
                            {user.fullName}
                            {isSelf ? <span className="ml-2 rounded-full bg-brand-700 px-2 py-0.5 text-[10px] font-bold text-white">Bạn</span> : null}
                          </p>
                          <p className="text-xs text-stone-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-stone-600">{user.phone ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${ROLE_BADGE[role]}`}>{ROLE_LABELS[role]}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${user.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${user.isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        {user.isActive ? 'Hoạt động' : 'Đã khóa'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stone-500">{new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td className="px-4 py-3">
                      {isSelf ? (
                        <span className="text-xs text-stone-400">Không thể tự sửa</span>
                      ) : (
                        <div className="flex flex-wrap items-center gap-2">
                          <form action={changeRole} className="flex items-center gap-1.5">
                            <input name="id" type="hidden" value={user.id} />
                            <select className="rounded-lg border border-stone-300 px-2 py-1 text-xs outline-none focus:border-brand-500" defaultValue={role} name="role">
                              {USER_ROLES.map((value) => <option key={value} value={value}>{ROLE_LABELS[value]}</option>)}
                            </select>
                            <button className="rounded-lg bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-600 transition hover:bg-brand-100 hover:text-brand-700" type="submit">Lưu</button>
                          </form>

                          <form action={toggleActive}>
                            <input name="id" type="hidden" value={user.id} />
                            <input name="next" type="hidden" value={user.isActive ? 'false' : 'true'} />
                            <button className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${user.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`} type="submit">
                              {user.isActive ? 'Khóa' : 'Mở khóa'}
                            </button>
                          </form>

                          <EditUserButton action={editUser} user={{ id: user.id, fullName: user.fullName, phone: user.phone, email: user.email }} />
                          <DeleteUserButton action={removeUser} userId={user.id} />
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
