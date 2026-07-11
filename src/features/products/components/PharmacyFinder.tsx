'use client'

import { useEffect, useMemo, useState } from 'react'

type Pharmacy = {
  id: string
  name: string
  address: string
  district: string
  city: string
  distanceKm: number
  openingHours: string
  stock: number
}

// Dữ liệu nhà thuốc demo — tất cả đều còn hàng cho sản phẩm đang xem.
const DEMO_PHARMACIES: Pharmacy[] = [
  {
    id: 'long-chau-le-loi',
    name: 'Nhà thuốc Long Châu',
    address: '123 Lê Lợi',
    district: 'Quận 1',
    city: 'TP. Hồ Chí Minh',
    distanceKm: 1.2,
    openingHours: '07:30 - 22:00',
    stock: 25,
  },
  {
    id: 'pharmacity-nguyen-hue',
    name: 'Nhà thuốc Pharmacity',
    address: '45 Nguyễn Huệ',
    district: 'Quận 1',
    city: 'TP. Hồ Chí Minh',
    distanceKm: 1.8,
    openingHours: '07:00 - 22:30',
    stock: 18,
  },
  {
    id: 'an-khang-cmt8',
    name: 'Nhà thuốc An Khang',
    address: '78 Cách Mạng Tháng 8',
    district: 'Quận 3',
    city: 'TP. Hồ Chí Minh',
    distanceKm: 2.5,
    openingHours: '08:00 - 21:30',
    stock: 30,
  },
  {
    id: 'trung-son-hbt',
    name: 'Nhà thuốc Trung Sơn',
    address: '210 Hai Bà Trưng',
    district: 'Quận 1',
    city: 'TP. Hồ Chí Minh',
    distanceKm: 3.1,
    openingHours: '07:30 - 22:00',
    stock: 12,
  },
  {
    id: 'eco-phan-dang-luu',
    name: 'Nhà thuốc Eco',
    address: '56 Phan Đăng Lưu',
    district: 'Quận Phú Nhuận',
    city: 'TP. Hồ Chí Minh',
    distanceKm: 4.0,
    openingHours: '08:00 - 21:00',
    stock: 22,
  },
]

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .trim()
}

type PharmacyFinderProps = {
  productName: string
}

export default function PharmacyFinder({ productName }: PharmacyFinderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')

  const filteredPharmacies = useMemo(() => {
    const normalizedQuery = normalize(query)

    if (!normalizedQuery) {
      return DEMO_PHARMACIES
    }

    return DEMO_PHARMACIES.filter((pharmacy) =>
      normalize(`${pharmacy.name} ${pharmacy.address} ${pharmacy.district} ${pharmacy.city}`).includes(
        normalizedQuery,
      ),
    )
  }, [query])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      <button
        className="rounded-full bg-brand-50 px-5 py-4 text-lg font-semibold text-brand-700 hover:bg-brand-100"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        Tìm nhà thuốc
      </button>

      {isOpen ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end justify-center bg-stone-900/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={() => setIsOpen(false)}
          role="dialog"
        >
          <div
            className="flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-stone-200 bg-brand-50 px-5 py-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
                  Nhà thuốc còn hàng
                </p>
                <h2 className="mt-1 truncate text-lg font-bold text-stone-900">{productName}</h2>
              </div>
              <button
                aria-label="Đóng"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white text-lg font-bold text-stone-600 transition hover:border-brand-300 hover:text-brand-700"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                ✕
              </button>
            </div>

            <div className="border-b border-stone-100 px-5 py-4">
              <label className="text-sm font-medium text-stone-700" htmlFor="pharmacy-search">
                Tìm theo địa chỉ
              </label>
              <input
                autoComplete="off"
                className="mt-2 w-full rounded-full border border-stone-300 px-4 py-2.5 text-sm text-stone-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                id="pharmacy-search"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Nhập quận, đường hoặc tên nhà thuốc..."
                type="search"
                value={query}
              />
              <p className="mt-2 text-xs text-stone-500">
                {filteredPharmacies.length} nhà thuốc có sẵn hàng
              </p>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {filteredPharmacies.length > 0 ? (
                <ul className="space-y-3">
                  {filteredPharmacies.map((pharmacy) => (
                    <li
                      className="rounded-2xl border border-stone-200 bg-white p-4 transition hover:border-brand-300 hover:shadow-sm"
                      key={pharmacy.id}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-semibold text-stone-900">{pharmacy.name}</p>
                        <span className="shrink-0 rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
                          Còn {pharmacy.stock} sản phẩm
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-stone-600">
                        {pharmacy.address}, {pharmacy.district}, {pharmacy.city}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500">
                        <span>📍 {pharmacy.distanceKm.toFixed(1)} km</span>
                        <span>🕒 {pharmacy.openingHours}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-4 py-8 text-center text-sm text-stone-500">
                  Không tìm thấy nhà thuốc phù hợp với địa chỉ bạn nhập.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
