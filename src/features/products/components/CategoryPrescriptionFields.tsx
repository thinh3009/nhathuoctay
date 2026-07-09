'use client'

import { useState } from 'react'

type CategoryOption = { slug: string; label: string }

type CategoryPrescriptionFieldsProps = {
  cats: CategoryOption[]
  defaultCategory?: string
  // 3 trạng thái: null/undefined = trống, false = không kê đơn, true = kê đơn.
  defaultPrescription?: boolean | null
}

const INPUT_CLASS =
  'w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'

// Giá trị select "Phân loại thuốc" khớp cách server đọc lại (new/edit product):
//   '' = trống (NULL) · 'false' = không kê đơn · 'true' = kê đơn
function prescriptionValue(v: boolean | null | undefined): '' | 'true' | 'false' {
  if (v === true) return 'true'
  if (v === false) return 'false'
  return ''
}

// Ô chọn Danh mục + dropdown "Phân loại thuốc" (kê đơn / không kê đơn / trống).
// Dropdown luôn hiển thị cho mọi danh mục; mặc định "Trống" để sản phẩm không
// phải thuốc (TPCN, thiết bị…) không bị gán nhãn kê đơn.
export default function CategoryPrescriptionFields({
  cats,
  defaultCategory,
  defaultPrescription,
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

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-stone-700" htmlFor="prescriptionRequired">
          Phân loại thuốc
        </label>
        <select
          className={INPUT_CLASS}
          defaultValue={prescriptionValue(defaultPrescription)}
          id="prescriptionRequired"
          name="prescriptionRequired"
        >
          <option value="">Trống (không phân loại)</option>
          <option value="false">Thuốc không kê đơn</option>
          <option value="true">Thuốc kê đơn</option>
        </select>
        <p className="mt-1.5 text-xs text-stone-500">
          Thuốc kê đơn sẽ được nhắc khách cần có toa của bác sĩ khi mua. Chọn “Trống” cho
          sản phẩm không phải thuốc.
        </p>
      </div>
    </>
  )
}
