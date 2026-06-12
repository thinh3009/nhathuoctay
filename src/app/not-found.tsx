import Link from 'next/link'
import { DEFAULT_CATEGORY_SLUG } from '@/lib/constants'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#f6fbf4] px-4 py-10 text-stone-900">
      <div className="mx-auto max-w-3xl rounded-2xl border border-emerald-100 bg-white p-8 shadow-sm shadow-emerald-100/70">
        <h1 className="text-3xl font-bold">Không tìm thấy nội dung</h1>
        <p className="mt-3 text-stone-600">
          Đường dẫn có thể không còn tồn tại hoặc dữ liệu mock chưa bao gồm mục bạn đang tìm.
        </p>
        <Link
          className="mt-6 inline-block rounded-lg bg-emerald-700 px-4 py-2 font-medium text-white hover:bg-emerald-800"
          href={`/category/${DEFAULT_CATEGORY_SLUG}`}
        >
          Quay lại danh mục mặc định
        </Link>
      </div>
    </main>
  )
}
