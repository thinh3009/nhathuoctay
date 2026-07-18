'use client'

import { useEffect, useState } from 'react'

// Nút "Xóa" với xác nhận 2 bước (không dùng window.confirm để tránh chặn luồng) — cho phép
// xóa thẳng từ danh sách, không cần vào trang sửa bài. Cùng pattern với DeleteUserButton.
export default function DeleteArticleButton({
  articleId,
  action,
}: {
  articleId: string
  action: (formData: FormData) => void
}) {
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    if (!confirming) return
    const t = setTimeout(() => setConfirming(false), 4000)
    return () => clearTimeout(t)
  }, [confirming])

  if (!confirming) {
    return (
      <button
        className="rounded-lg bg-stone-100 px-3 py-1.5 text-xs font-semibold text-stone-600 hover:bg-red-100 hover:text-red-700"
        onClick={() => setConfirming(true)}
        type="button"
      >
        Xóa
      </button>
    )
  }

  return (
    <form action={action} className="flex items-center gap-1.5">
      <input name="id" type="hidden" value={articleId} />
      <button
        className="rounded-lg bg-red-600 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-red-700"
        type="submit"
      >
        Chắc chắn?
      </button>
      <button
        className="rounded-lg px-2 py-1.5 text-xs font-semibold text-stone-500 hover:bg-stone-100"
        onClick={() => setConfirming(false)}
        type="button"
      >
        Hủy
      </button>
    </form>
  )
}
