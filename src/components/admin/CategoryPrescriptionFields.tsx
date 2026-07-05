'use client'

import { useState } from 'react'

type CategoryOption = { slug: string; label: string }

type CategoryPrescriptionFieldsProps = {
  cats: CategoryOption[]
  defaultCategory?: string
  defaultPrescription?: boolean
}

const INPUT_CLASS =
  'w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'

// Ô chọn Danh mục + dropdown "Phân loại thuốc" (kê đơn / không kê đơn).
// Dropdown chỉ hiện khi danh mục đang chọn là "thuoc" — các danh mục khác
// không gửi field này, server action sẽ hiểu là không kê đơn.
export default function CategoryPrescriptionFields({
  cats,
  defaultCategory,
  defaultPrescription = false,
}: CategoryPrescriptionFieldsProps) {
  const [category, setCategory] = useState(defaultCategory ?? cats[0]?.slug ?? '')

  return (
    <>
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-stone-700" htmlFor="categorySlug">
          Danh mục *
        </label>
        <select
          className={INPUT_CLASS}
          id="categorySlug"
          name="categorySlug"
          onChange={(event) => setCategory(event.target.value)}
          required
          value={category}
        >
          {cats.map((cat) => (
            <option key={cat.slug} value={cat.slug}>{cat.label}</option>
          ))}
        </select>
      </div>

      {category === 'thuoc' ? (
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-stone-700" htmlFor="prescriptionRequired">
            Phân loại thuốc *
          </label>
          <select
            className={INPUT_CLASS}
            defaultValue={defaultPrescription ? 'true' : 'false'}
            id="prescriptionRequired"
            name="prescriptionRequired"
            required
          >
            <option value="false">Thuốc không kê đơn</option>
            <option value="true">Thuốc kê đơn</option>
          </select>
          <p className="mt-1.5 text-xs text-stone-500">
            Thuốc kê đơn sẽ được nhắc khách cần có toa của bác sĩ khi mua.
          </p>
        </div>
      ) : null}
    </>
  )
}
