'use client'

import { startTransition, useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ALL_SUBCATEGORY_LABEL } from '@/lib/constants'
import type { ProductSearchParams } from '@/lib/schemas'

type CategoryFiltersProps = {
  subCategories: string[]
  selectedSubCategory?: string
  selectedPriceRange: ProductSearchParams['priceRange']
  selectedSort: ProductSearchParams['sort']
  variant?: 'desktop' | 'mobile'
}

const priceOptions = [
  { value: 'all', label: 'Tất cả mức giá' },
  { value: 'under-200', label: 'Dưới 200.000đ' },
  { value: '200-400', label: 'Từ 200.000đ đến 400.000đ' },
  { value: 'over-400', label: 'Trên 400.000đ' },
] as const

const sortOptions = [
  { value: 'featured', label: 'Nổi bật' },
  { value: 'price-asc', label: 'Giá từ thấp đến cao' },
  { value: 'price-desc', label: 'Giá từ cao đến thấp' },
  { value: 'name-asc', label: 'Tên A-Z' },
  { value: 'rating-desc', label: 'Đánh giá cao' },
] as const

type DraftFilters = {
  subCategory: string
  priceRange: ProductSearchParams['priceRange']
  sort: ProductSearchParams['sort']
}

function buildSelectedTags(filters: DraftFilters) {
  const tags: string[] = []

  if (filters.subCategory !== ALL_SUBCATEGORY_LABEL) {
    tags.push(filters.subCategory)
  }

  const selectedPrice = priceOptions.find((item) => item.value === filters.priceRange)
  if (selectedPrice && selectedPrice.value !== 'all') {
    tags.push(selectedPrice.label)
  }

  const selectedSort = sortOptions.find((item) => item.value === filters.sort)
  if (selectedSort && selectedSort.value !== 'featured') {
    tags.push(`Sắp xếp: ${selectedSort.label}`)
  }

  return tags
}

export default function CategoryFilters({
  subCategories,
  selectedSubCategory,
  selectedPriceRange,
  selectedSort,
  variant = 'desktop',
}: CategoryFiltersProps) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)
  const [draftFilters, setDraftFilters] = useState<DraftFilters>({
    subCategory: selectedSubCategory ?? ALL_SUBCATEGORY_LABEL,
    priceRange: selectedPriceRange,
    sort: selectedSort,
  })

  const activeFilters = useMemo<DraftFilters>(
    () => ({
      subCategory: selectedSubCategory ?? ALL_SUBCATEGORY_LABEL,
      priceRange: selectedPriceRange,
      sort: selectedSort,
    }),
    [selectedPriceRange, selectedSort, selectedSubCategory],
  )

  const selectedTags = useMemo(() => buildSelectedTags(activeFilters), [activeFilters])
  const draftTags = useMemo(() => buildSelectedTags(draftFilters), [draftFilters])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setDraftFilters(activeFilters)
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [activeFilters, isOpen])

  function updateQuery(next: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams?.toString() ?? '')

    Object.entries(next).forEach(([key, value]) => {
      if (!value || value === 'all' || value === 'featured' || value === ALL_SUBCATEGORY_LABEL) {
        params.delete(key)
        return
      }

      params.set(key, value)
    })

    params.delete('page')

    startTransition(() => {
      const query = params.toString()
      const nextPath = pathname ?? ''
      router.replace(query ? `${nextPath}?${query}` : nextPath)
    })
  }

  function resetFiltersDesktop() {
    updateQuery({
      subCategory: ALL_SUBCATEGORY_LABEL,
      priceRange: 'all',
      sort: 'featured',
    })
  }

  function resetFiltersMobile() {
    setDraftFilters({
      subCategory: ALL_SUBCATEGORY_LABEL,
      priceRange: 'all',
      sort: 'featured',
    })
  }

  function applyFiltersMobile() {
    updateQuery({
      subCategory: draftFilters.subCategory,
      priceRange: draftFilters.priceRange,
      sort: draftFilters.sort,
    })
    setIsOpen(false)
  }

  function closeDrawer() {
    setDraftFilters(activeFilters)
    setIsOpen(false)
  }

  function renderDesktopSections() {
    return (
      <>
        <div className="mt-5">
          <p className="text-sm font-semibold text-stone-800">Nhóm sản phẩm</p>
          <div className="mt-3 space-y-2">
            {[ALL_SUBCATEGORY_LABEL, ...subCategories].map((subCategory) => (
              <label className="flex items-center gap-2 text-sm text-stone-700" key={subCategory}>
                <input
                  checked={(selectedSubCategory ?? ALL_SUBCATEGORY_LABEL) === subCategory}
                  className="h-4 w-4 border-stone-300 text-emerald-700"
                  name="sub-category-desktop"
                  onChange={() => updateQuery({ subCategory })}
                  type="radio"
                />
                {subCategory}
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-semibold text-stone-800">Mức giá</p>
          <div className="mt-3 space-y-2">
            {priceOptions.map((range) => (
              <label className="flex items-center gap-2 text-sm text-stone-700" key={range.value}>
                <input
                  checked={selectedPriceRange === range.value}
                  className="h-4 w-4 border-stone-300 text-emerald-700"
                  name="price-range-desktop"
                  onChange={() => updateQuery({ priceRange: range.value })}
                  type="radio"
                />
                {range.label}
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-semibold text-stone-800">Sắp xếp</p>
          <select
            className="mt-3 h-10 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-700 shadow-sm outline-none transition focus:border-emerald-500"
            onChange={(event) => updateQuery({ sort: event.target.value })}
            value={selectedSort}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button
          className="mt-6 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          onClick={resetFiltersDesktop}
          type="button"
        >
          Đặt lại bộ lọc
        </button>
      </>
    )
  }

  function renderMobileSections() {
    return (
      <>
        <div className="mt-5">
          <p className="text-sm font-semibold text-stone-800">Nhóm sản phẩm</p>
          <div className="mt-3 space-y-2">
            {[ALL_SUBCATEGORY_LABEL, ...subCategories].map((subCategory) => (
              <label className="flex items-center gap-2 text-sm text-stone-700" key={subCategory}>
                <input
                  checked={draftFilters.subCategory === subCategory}
                  className="h-4 w-4 border-stone-300 text-emerald-700"
                  name="sub-category-mobile"
                  onChange={() => setDraftFilters((current) => ({ ...current, subCategory }))}
                  type="radio"
                />
                {subCategory}
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-semibold text-stone-800">Mức giá</p>
          <div className="mt-3 space-y-2">
            {priceOptions.map((range) => (
              <label className="flex items-center gap-2 text-sm text-stone-700" key={range.value}>
                <input
                  checked={draftFilters.priceRange === range.value}
                  className="h-4 w-4 border-stone-300 text-emerald-700"
                  name="price-range-mobile"
                  onChange={() =>
                    setDraftFilters((current) => ({
                      ...current,
                      priceRange: range.value,
                    }))
                  }
                  type="radio"
                />
                {range.label}
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-semibold text-stone-800">Sắp xếp</p>
          <select
            className="mt-3 h-10 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-700 shadow-sm outline-none transition focus:border-emerald-500"
            onChange={(event) =>
              setDraftFilters((current) => ({
                ...current,
                sort: event.target.value as ProductSearchParams['sort'],
              }))
            }
            value={draftFilters.sort}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </>
    )
  }

  if (variant === 'desktop') {
    return renderDesktopSections()
  }

  return (
    <>
      <button
        className="w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 text-left shadow-sm shadow-emerald-100/60"
        onClick={() => {
          setDraftFilters(activeFilters)
          setIsOpen(true)
        }}
        type="button"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-stone-900">Bộ lọc sản phẩm</p>
              {selectedTags.length > 0 ? (
                <span className="rounded-full bg-emerald-700 px-2 py-0.5 text-[11px] font-bold text-white">
                  {selectedTags.length}
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-xs text-stone-500">
              {selectedTags.length > 0
                ? `${selectedTags.length} lựa chọn đang áp dụng`
                : 'Chọn bộ lọc để thu gọn danh sách'}
            </p>
          </div>
          <span className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white">
            Lọc
          </span>
        </div>

        {selectedTags.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <span
                className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
                key={tag}
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </button>

      <div
        aria-hidden={!isOpen}
        className={`fixed inset-0 z-50 lg:hidden ${
          isOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        <button
          aria-label="Đóng bộ lọc"
          className={`absolute inset-0 bg-emerald-950/40 backdrop-blur-[2px] transition-all duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={closeDrawer}
          type="button"
        />

        <div
          className={`absolute right-0 top-0 h-full w-full max-w-sm overflow-y-auto bg-white px-4 pb-6 pt-5 shadow-2xl transition-all duration-300 ease-out ${
            isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-lg font-bold text-stone-900">Bộ lọc</p>
                {draftTags.length > 0 ? (
                  <span className="rounded-full bg-emerald-700 px-2 py-0.5 text-[11px] font-bold text-white">
                    {draftTags.length}
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-sm text-stone-500">
                Chọn bộ lọc rồi bấm áp dụng để cập nhật danh sách.
              </p>
            </div>
            <button
              className="rounded-full border border-stone-200 px-3 py-2 text-sm font-semibold text-stone-700"
              onClick={closeDrawer}
              type="button"
            >
              Đóng
            </button>
          </div>

          <div className="mt-4 rounded-xl bg-stone-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Đang chọn</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {draftTags.length > 0 ? (
                draftTags.map((tag) => (
                  <span
                    className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700"
                    key={tag}
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-sm text-stone-500">Chưa áp dụng bộ lọc nào.</span>
              )}
            </div>
          </div>

          {renderMobileSections()}

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              className="rounded-xl border border-stone-200 px-4 py-3 text-sm font-semibold text-stone-700"
              onClick={resetFiltersMobile}
              type="button"
            >
              Đặt lại
            </button>
            <button
              className="rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
              onClick={applyFiltersMobile}
              type="button"
            >
              Áp dụng
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
