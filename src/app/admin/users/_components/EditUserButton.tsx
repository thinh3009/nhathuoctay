'use client'

import { useState } from 'react'

type EditableUser = {
  id: string
  fullName: string | null
  phone: string | null
  email: string
}

// Nút "Sửa" + form chỉnh sửa thông tin người dùng (họ tên, SĐT, đặt lại mật khẩu).
// Nhận server action `action` từ trang (Server Component) và submit qua <form action>.
export default function EditUserButton({
  user,
  action,
}: {
  user: EditableUser
  action: (formData: FormData) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        className="rounded-lg bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-600 hover:bg-sky-100 hover:text-sky-700"
        onClick={() => setOpen(true)}
        type="button"
      >
        Sửa
      </button>

      {open ? (
        <div
          aria-labelledby="edit-user-title"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-stone-900/50"
            onClick={() => setOpen(false)}
          />
          <form
            action={action}
            className="relative z-10 w-full max-w-md rounded-2xl border border-stone-200 bg-white p-5 shadow-xl"
            onSubmit={() => setOpen(false)}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-stone-900" id="edit-user-title">
                Sửa người dùng
              </h2>
              <button
                aria-label="Đóng"
                className="text-sm text-stone-400 hover:text-stone-600"
                onClick={() => setOpen(false)}
                type="button"
              >
                Hủy
              </button>
            </div>

            <input name="id" type="hidden" value={user.id} />

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-stone-500" htmlFor={`fullName-${user.id}`}>
                  Họ và tên
                </label>
                <input
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                  defaultValue={user.fullName ?? ''}
                  id={`fullName-${user.id}`}
                  minLength={2}
                  name="fullName"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-stone-500" htmlFor={`phone-${user.id}`}>
                  Số điện thoại
                </label>
                <input
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                  defaultValue={user.phone ?? ''}
                  id={`phone-${user.id}`}
                  name="phone"
                  placeholder="Tùy chọn"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-stone-500" htmlFor={`password-${user.id}`}>
                  Mật khẩu mới
                </label>
                <input
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                  id={`password-${user.id}`}
                  minLength={6}
                  name="password"
                  placeholder="Để trống nếu không đổi"
                  type="password"
                />
              </div>

              <p className="text-xs text-stone-400">Email: {user.email} (không thể đổi)</p>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                className="rounded-xl px-4 py-2 text-sm font-semibold text-stone-500 hover:bg-stone-100"
                onClick={() => setOpen(false)}
                type="button"
              >
                Hủy
              </button>
              <button
                className="rounded-xl bg-emerald-700 px-5 py-2 text-sm font-bold text-white transition hover:bg-emerald-800"
                type="submit"
              >
                Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  )
}
