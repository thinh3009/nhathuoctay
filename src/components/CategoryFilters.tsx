'use client'

import { startTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { ProductSearchParams } from '@/lib/schemas'

type CategoryFiltersProps = {
  subCategories: string[]
  selectedSubCategory?: string
  selectedPriceRange: ProductSearchParams['priceRange']
  selectedSort: ProductSearchParams['sort']
}

export default function CategoryFilters({
  subCategories,
  selectedSubCategory,
  selectedPriceRange,
  selectedSort,
}: CategoryFiltersProps) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  function updateQuery(next: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(next).forEach(([key, value]) => {
      if (!value || value === 'all' || value === 'featured' || value === 'Tất cả') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })

    params.delete('page')

    startTransition(() => {
      const query = params.toString()
      router.replace(query ? `${pathname}?${query}` : pathname)
    })
  }

  return (
    <>
      <div className="mt-5">
        <p className="text-sm font-semibold text-slate-800">Nhóm sản phẩm</p>
        <div className="mt-3 space-y-2">
          {subCategories.map((subCategory) => (
            <label className="flex items-center gap-2 text-sm text-slate-700" key={subCategory}>
              <input
                checked={(selectedSubCategory ?? 'Tất cả') === subCategory}
                className="h-4 w-4 border-slate-300 text-cyan-700"
                name="sub-category"
                onChange={() => updateQuery({ subCategory })}
                type="radio"
              />
              {subCategory}
            </label>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm font-semibold text-slate-800">Mức giá</p>
        <div className="mt-3 space-y-2">
          {[
            { value: 'all', label: 'Tất cả mức giá' },
            { value: 'under-200', label: 'Dưới 200.000đ' },
            { value: '200-400', label: 'Từ 200.000đ đến 400.000đ' },
            { value: 'over-400', label: 'Trên 400.000đ' },
          ].map((range) => (
            <label className="flex items-center gap-2 text-sm text-slate-700" key={range.value}>
              <input
                checked={selectedPriceRange === range.value}
                className="h-4 w-4 border-slate-300 text-cyan-700"
                name="price-range"
                onChange={() => updateQuery({ priceRange: range.value })}
                type="radio"
              />
              {range.label}
            </label>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm font-semibold text-slate-800">Sắp xếp</p>
        <select
          className="mt-3 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 shadow-sm"
          onChange={(event) => updateQuery({ sort: event.target.value })}
          value={selectedSort}
        >
          <option value="featured">Nổi bật</option>
          <option value="price-asc">Giá từ thấp đến cao</option>
          <option value="price-desc">Giá từ cao đến thấp</option>
          <option value="name-asc">Tên A-Z</option>
          <option value="rating-desc">Đánh giá cao</option>
        </select>
      </div>

      <button
        className="mt-6 text-sm font-semibold text-cyan-700 hover:text-cyan-800"
        onClick={() => updateQuery({ subCategory: 'Tất cả', priceRange: 'all', sort: 'featured' })}
        type="button"
      >
        Đặt lại bộ lọc
      </button>
    </>
  )
}
