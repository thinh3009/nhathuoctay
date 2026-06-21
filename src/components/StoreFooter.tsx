import Link from 'next/link'
import { CATEGORY_CONFIG } from '@/lib/constants'
import { SITE_NAME } from '@/config/site'

export default function StoreFooter() {
  return (
    <footer className="mt-8 overflow-hidden rounded-[28px] bg-emerald-950 text-emerald-50 sm:rounded-[32px]">
      {/* Main footer content */}
      <div className="px-6 py-10 sm:px-10 sm:py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-emerald-400">
                Nhà thuốc
              </p>
              <p className="mt-1 text-3xl font-black tracking-tight text-white">
                {SITE_NAME}
              </p>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-7 text-emerald-100/60">
              Cung cấp thực phẩm chức năng, chăm sóc da, thiết bị y tế và thuốc chính hãng với trải nghiệm mua hàng đơn giản, nhanh chóng.
            </p>
            <div className="mt-6 flex gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-800 text-emerald-300 transition hover:bg-emerald-700">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-800 text-emerald-300 transition hover:bg-emerald-700">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <rect height="20" rx="5" stroke="currentColor" strokeWidth="1.8" width="20" x="2" y="2" />
                  <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="17.5" cy="6.5" fill="currentColor" r="1.2" />
                </svg>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
              Danh mục
            </p>
            <nav className="mt-4 space-y-2.5">
              {CATEGORY_CONFIG.map((cat) => (
                <Link
                  className="block text-sm text-emerald-100/60 transition-colors hover:text-emerald-200"
                  href={`/category/${cat.slug}`}
                  key={cat.slug}
                >
                  {cat.label}
                </Link>
              ))}
              <Link
                className="block text-sm text-emerald-100/60 transition-colors hover:text-emerald-200"
                href="/bai-viet"
              >
                Bài viết
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
              Liên hệ
            </p>
            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-3">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.63 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.54 1.2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.74a16 16 0 0 0 6.29 6.29l.92-.85a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" stroke="currentColor" strokeWidth="1.8" />
                </svg>
                <span className="text-sm text-emerald-100/60">0900 123 456</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Z" stroke="currentColor" strokeWidth="1.8" />
                  <path d="m22 6-10 7L2 6" stroke="currentColor" strokeWidth="1.8" />
                </svg>
                <span className="text-sm text-emerald-100/60">support@nutrihome.vn</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M12 6v6l4 2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
                </svg>
                <span className="text-sm text-emerald-100/60">8:00 – 22:00 mỗi ngày</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-emerald-900 px-6 py-4 sm:px-10">
        <p className="text-center text-xs text-emerald-100/40">
          © 2026 {SITE_NAME}. Tất cả quyền được bảo lưu.
        </p>
      </div>
    </footer>
  )
}
