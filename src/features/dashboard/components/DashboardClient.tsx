'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { formatPrice } from '@/utils/format'
import type { DashboardData } from '../types'

const STATUS_ORDER = ['pending', 'confirmed', 'processing', 'shipping', 'delivered', 'cancelled', 'refunded'] as const

const STATUS_LABEL: Record<string, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  processing: 'Đang xử lý',
  shipping: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
  refunded: 'Hoàn tiền',
}

const STATUS_HEX: Record<string, string> = {
  pending: '#f59e0b',
  confirmed: '#3b82f6',
  processing: '#8b5cf6',
  shipping: '#06b6d4',
  delivered: '#10b981',
  cancelled: '#ef4444',
  refunded: '#78716c',
}

const STATUS_CLASS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipping: 'bg-cyan-100 text-cyan-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
  refunded: 'bg-stone-100 text-stone-600',
}

const CATEGORY_COLORS = ['#009688', '#F0930D', '#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#14b8a6', '#64748b']

const RANGE_OPTIONS = [
  { days: 7, label: '7 ngày' },
  { days: 30, label: '30 ngày' },
  { days: 90, label: '90 ngày' },
  { days: 0, label: 'Tất cả' },
]

const REFRESH_MS = 10000

export default function DashboardClient({ initial }: { initial: DashboardData }) {
  const [data, setData] = useState<DashboardData>(initial)
  const [days, setDays] = useState<number>(initial.rangeDays)
  const [loading, setLoading] = useState(false)
  const [auto, setAuto] = useState(true)
  const [error, setError] = useState('')
  // Chặn gọi chồng khi DB chậm (interval 10s có thể trùng lần fetch trước).
  const inFlight = useRef(false)

  const load = useCallback(async (d: number, spin = true) => {
    if (inFlight.current) return
    inFlight.current = true
    if (spin) setLoading(true)
    try {
      const res = await fetch(`/api/admin/dashboard?days=${d}`, { cache: 'no-store' })
      if (!res.ok) {
        setError('Không tải được dữ liệu')
        return
      }
      setData(await res.json())
      setError('')
    } catch {
      setError('Lỗi kết nối, sẽ thử lại')
    } finally {
      setLoading(false)
      inFlight.current = false
    }
  }, [])

  // Tự động làm mới mỗi 10s (không hiện spinner để tránh nhấp nháy).
  useEffect(() => {
    if (!auto) return
    const id = setInterval(() => load(days, false), REFRESH_MS)
    return () => clearInterval(id)
  }, [auto, days, load])

  function changeRange(d: number) {
    setDays(d)
    void load(d)
  }

  const updatedAt = new Date(data.generatedAt).toLocaleTimeString('vi-VN')

  return (
    <div>
      {/* Header + điều khiển realtime */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-stone-900">Dashboard</h1>
          <p className="mt-1 text-stone-500">Tổng quan hoạt động nhà thuốc · cập nhật lúc {updatedAt}</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-stone-600">
            <input type="checkbox" checked={auto} onChange={(e) => setAuto(e.target.checked)} className="accent-brand-600" />
            Tự động ({REFRESH_MS / 1000}s)
          </label>
          <button
            type="button"
            onClick={() => load(days)}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-60"
          >
            <i className={`ph ph-arrows-clockwise text-base ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
        </div>
      </div>

      {error ? <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</div> : null}

      {/* ── Section 1: Tổng quan ── */}
      <SectionTitle icon="ph-chart-line-up">Tổng quan</SectionTitle>
      <div className="mb-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard color="border-emerald-100 bg-emerald-50" label="Doanh thu" sub="Tổng giá trị đơn hàng" value={formatPrice(data.stats.revenue)} icon="ph-coins" tone="text-emerald-600" />
        <StatCard color="border-blue-100 bg-blue-50" label="Tổng đơn hàng" sub="Tất cả trạng thái" value={String(data.stats.total)} icon="ph-receipt" tone="text-blue-600" />
        <StatCard color="border-amber-100 bg-amber-50" label="Chờ xử lý" sub="Cần xác nhận" value={String(data.stats.pending)} icon="ph-hourglass-medium" tone="text-amber-600" />
        <StatCard color="border-teal-100 bg-teal-50" label="Đã giao" sub="Đơn hàng thành công" value={String(data.stats.delivered)} icon="ph-check-circle" tone="text-teal-600" />
      </div>

      {/* ── Section 2: Biểu đồ thống kê trạng thái đơn ── */}
      <SectionTitle icon="ph-chart-bar">Biểu đồ thống kê</SectionTitle>
      <div className="mb-9 rounded-2xl border border-stone-200 bg-white p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-bold text-stone-900">Đơn hàng theo trạng thái</h3>
          <div className="inline-flex rounded-xl border border-stone-200 bg-stone-50 p-1">
            {RANGE_OPTIONS.map((r) => (
              <button
                key={r.days}
                type="button"
                onClick={() => changeRange(r.days)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${days === r.days ? 'bg-brand-600 text-white' : 'text-stone-600 hover:bg-white'}`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
        <StatusBarChart counts={data.statusCounts} />
      </div>

      {/* ── Section 3: Thống kê sản phẩm & tồn kho (pie chart) ── */}
      <SectionTitle icon="ph-chart-pie-slice">Thống kê sản phẩm &amp; tồn kho</SectionTitle>
      <div className="mb-9 grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <h3 className="mb-4 font-bold text-stone-900">Sản phẩm theo danh mục</h3>
          <ProductPie categories={data.inventory.byCategory} />
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <h3 className="mb-4 font-bold text-stone-900">Kiểm soát tồn kho</h3>
          <div className="grid grid-cols-2 gap-3">
            <InvChip label="Tổng sản phẩm" value={data.inventory.totalProducts} sub={`${data.inventory.activeProducts} đang bán`} icon="ph-package" tone="bg-brand-50 text-brand-700" />
            <InvChip label="Tổng tồn kho" value={data.inventory.totalStock} sub="đơn vị hàng" icon="ph-stack" tone="bg-sky-50 text-sky-700" />
            <InvChip label="Sắp hết (≤10)" value={data.inventory.lowStock} sub="cần theo dõi" icon="ph-warning" tone="bg-amber-50 text-amber-700" />
            <InvChip label="Hết hàng" value={data.inventory.outOfStock} sub="cần nhập gấp" icon="ph-x-circle" tone="bg-red-50 text-red-600" />
          </div>
          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-400">Cảnh báo nhập hàng</p>
            {data.inventory.lowStockItems.length === 0 ? (
              <p className="rounded-xl bg-emerald-50 px-3 py-3 text-sm font-medium text-emerald-700">Tồn kho ổn định — không có sản phẩm sắp hết.</p>
            ) : (
              <div className="max-h-40 space-y-1.5 overflow-y-auto pr-1">
                {data.inventory.lowStockItems.map((it, i) => (
                  <div key={i} className="flex items-center justify-between gap-2 rounded-lg bg-stone-50 px-3 py-2">
                    <span className="min-w-0 flex-1 truncate text-sm text-stone-700" title={it.name}>{it.name}</span>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${it.stock === 0 ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700'}`}>
                      {it.stock === 0 ? 'Hết hàng' : `Còn ${it.stock}`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Section 4: Đơn hàng gần đây ── */}
      <div className="mb-4 flex items-center justify-between">
        <SectionTitle icon="ph-clock-counter-clockwise" noMargin>Đơn hàng gần đây</SectionTitle>
        <Link className="text-sm font-semibold text-brand-700 hover:underline" href="/admin/orders">Xem tất cả →</Link>
      </div>
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
        {data.recentOrders.length === 0 ? (
          <div className="px-6 py-10 text-center text-stone-400">Chưa có đơn hàng nào</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 bg-brand-50/60 text-left">
                  <th className="px-4 py-3 font-semibold text-stone-600">Mã đơn</th>
                  <th className="px-4 py-3 font-semibold text-stone-600">Khách hàng</th>
                  <th className="px-4 py-3 font-semibold text-stone-600">Tổng tiền</th>
                  <th className="px-4 py-3 font-semibold text-stone-600">Trạng thái</th>
                  <th className="px-4 py-3 font-semibold text-stone-600">Ngày đặt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {data.recentOrders.map((order) => (
                  <tr className="hover:bg-brand-50/40" key={order.id}>
                    <td className="px-4 py-3">
                      <Link className="font-semibold text-brand-700 hover:underline" href={`/admin/orders/${order.id}`}>{order.orderNumber}</Link>
                    </td>
                    <td className="px-4 py-3 text-stone-700">
                      {order.customerName}
                      {order.customerPhone ? <span className="ml-1 text-stone-400">({order.customerPhone})</span> : null}
                    </td>
                    <td className="px-4 py-3 font-semibold text-stone-900">{formatPrice(order.totalAmount)}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_CLASS[order.status] ?? 'bg-stone-100 text-stone-600'}`}>
                        {STATUS_LABEL[order.status] ?? order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stone-500">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function SectionTitle({ icon, children, noMargin }: { icon: string; children: React.ReactNode; noMargin?: boolean }) {
  return (
    <h2 className={`flex items-center gap-2.5 text-lg font-black text-stone-900 ${noMargin ? '' : 'mb-4'}`}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-700"><i className={`ph ${icon} text-lg`} /></span>
      {children}
    </h2>
  )
}

function StatCard({ label, value, sub, color, icon, tone }: { label: string; value: string; sub: string; color: string; icon: string; tone: string }) {
  return (
    <div className={`rounded-2xl border p-5 ${color}`}>
      <div className="flex items-start justify-between">
        <p className="text-sm font-semibold text-stone-500">{label}</p>
        <i className={`ph ${icon} text-2xl ${tone}`} />
      </div>
      <p className="mt-2 text-3xl font-black text-stone-900">{value}</p>
      <p className="mt-1 text-xs text-stone-400">{sub}</p>
    </div>
  )
}

function InvChip({ label, value, sub, icon, tone }: { label: string; value: number; sub: string; icon: string; tone: string }) {
  return (
    <div className="rounded-xl border border-stone-100 bg-white p-3">
      <div className="flex items-center gap-2">
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${tone}`}><i className={`ph ${icon}`} /></span>
        <span className="text-xs font-medium text-stone-500">{label}</span>
      </div>
      <p className="mt-1.5 text-2xl font-black text-stone-900">{value}</p>
      <p className="text-[11px] text-stone-400">{sub}</p>
    </div>
  )
}

function StatusBarChart({ counts }: { counts: { status: string; count: number }[] }) {
  const map = new Map(counts.map((c) => [c.status, c.count]))
  const rows = STATUS_ORDER.map((s) => ({ status: s, count: map.get(s) ?? 0 }))
  const total = rows.reduce((a, r) => a + r.count, 0)
  const max = Math.max(1, ...rows.map((r) => r.count))

  if (total === 0) {
    return <p className="rounded-xl bg-stone-50 px-4 py-8 text-center text-sm text-stone-400">Chưa có đơn hàng trong khoảng thời gian này.</p>
  }

  return (
    <div className="space-y-3">
      {rows.map((r) => (
        <div key={r.status} className="flex items-center gap-3">
          <span className="w-24 shrink-0 text-xs font-medium text-stone-600">{STATUS_LABEL[r.status]}</span>
          <div className="h-7 flex-1 overflow-hidden rounded-lg bg-stone-100">
            <div
              className="flex h-full items-center justify-end rounded-lg px-2 text-xs font-bold text-white transition-all duration-500"
              style={{ width: `${Math.max((r.count / max) * 100, r.count > 0 ? 8 : 0)}%`, backgroundColor: STATUS_HEX[r.status] }}
            >
              {r.count > 0 ? r.count : null}
            </div>
          </div>
          <span className="w-10 shrink-0 text-right text-xs font-semibold text-stone-500">{total > 0 ? Math.round((r.count / total) * 100) : 0}%</span>
        </div>
      ))}
      <p className="pt-1 text-right text-xs text-stone-400">Tổng: {total} đơn</p>
    </div>
  )
}

function ProductPie({ categories }: { categories: { slug: string; label: string; count: number; stock: number }[] }) {
  const total = categories.reduce((a, c) => a + c.count, 0)

  if (total === 0) {
    return <p className="rounded-xl bg-stone-50 px-4 py-10 text-center text-sm text-stone-400">Chưa có sản phẩm nào.</p>
  }

  const size = 180
  const stroke = 34
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const slices = categories.map((c, i) => {
    const prevCount = categories.slice(0, i).reduce((a, x) => a + x.count, 0)
    const len = (c.count / total) * circ
    return {
      color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
      dasharray: `${len} ${circ - len}`,
      dashoffset: -((prevCount / total) * circ),
    }
  })

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
            {slices.map((s, i) => (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth={stroke}
                strokeDasharray={s.dasharray}
                strokeDashoffset={s.dashoffset}
              />
            ))}
          </g>
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black text-stone-900">{total}</span>
          <span className="text-[11px] text-stone-400">sản phẩm</span>
        </div>
      </div>
      <div className="w-full space-y-2">
        {categories.map((c, i) => (
          <div key={c.slug} className="flex items-center gap-2.5 text-sm">
            <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }} />
            <span className="min-w-0 flex-1 truncate text-stone-700" title={c.label}>{c.label}</span>
            <span className="shrink-0 font-semibold text-stone-900">{c.count}</span>
            <span className="w-9 shrink-0 text-right text-xs text-stone-400">{Math.round((c.count / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
