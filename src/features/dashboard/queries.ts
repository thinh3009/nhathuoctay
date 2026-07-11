import 'server-only'
import { gte, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { orders, products, categories } from '@/db/schema'
import { CATEGORY_CONFIG } from '@/lib/constants'
import { getOrderStats, getAllOrders } from '@/features/orders/queries'
import type { DashboardData, InventoryStats, StatusCount } from './types'

// Số đơn theo trạng thái, lọc theo N ngày gần nhất (0 = tất cả) — cho biểu đồ section 2.
export async function getOrderStatusCounts(sinceDays: number): Promise<StatusCount[]> {
  const base = db
    .select({ status: orders.status, count: sql<number>`count(*)::int` })
    .from(orders)
  const rows =
    sinceDays > 0
      ? await base.where(gte(orders.createdAt, new Date(Date.now() - sinceDays * 86400000))).groupBy(orders.status)
      : await base.groupBy(orders.status)
  return rows.map((r) => ({ status: r.status, count: Number(r.count) }))
}

// Thống kê sản phẩm & tồn kho — cho pie chart + cảnh báo nhập hàng (section 3).
export async function getInventoryStats(): Promise<InventoryStats> {
  const [rows, cats] = await Promise.all([
    db
      .select({
        name: products.name,
        categorySlug: products.categorySlug,
        isActive: products.isActive,
        stock: products.stockQuantity,
      })
      .from(products),
    db.select({ slug: categories.slug, label: categories.label }).from(categories),
  ])

  // Nhãn danh mục: ưu tiên nhãn thân thiện tĩnh (CATEGORY_CONFIG), sau đó nhãn DB.
  const labelBySlug = new Map<string, string>(cats.map((c) => [c.slug, c.label]))
  for (const c of CATEGORY_CONFIG) labelBySlug.set(c.slug, c.label)
  const byCat = new Map<string, { count: number; stock: number }>()
  let totalStock = 0
  let outOfStock = 0
  let lowStock = 0
  let activeProducts = 0
  const lowStockItems: InventoryStats['lowStockItems'] = []

  for (const r of rows) {
    const cur = byCat.get(r.categorySlug) ?? { count: 0, stock: 0 }
    cur.count += 1
    cur.stock += r.stock
    byCat.set(r.categorySlug, cur)
    totalStock += r.stock
    if (r.isActive) activeProducts += 1
    if (r.stock === 0) outOfStock += 1
    else if (r.stock <= 10) lowStock += 1
    if (r.stock <= 10) {
      lowStockItems.push({ name: r.name, stock: r.stock, categoryLabel: labelBySlug.get(r.categorySlug) ?? r.categorySlug })
    }
  }

  const byCategory = [...byCat.entries()]
    .map(([slug, v]) => ({ slug, label: labelBySlug.get(slug) ?? slug, count: v.count, stock: v.stock }))
    .sort((a, b) => b.count - a.count)

  lowStockItems.sort((a, b) => a.stock - b.stock)

  return {
    byCategory,
    totalProducts: rows.length,
    activeProducts,
    totalStock,
    outOfStock,
    lowStock,
    lowStockItems: lowStockItems.slice(0, 8),
  }
}

// Gói toàn bộ dữ liệu dashboard trong 1 lần gọi (SSR lần đầu + API làm mới realtime).
export async function getDashboardData(rangeDays: number): Promise<DashboardData> {
  const [stats, statusCounts, inventory, recent] = await Promise.all([
    getOrderStats(),
    getOrderStatusCounts(rangeDays),
    getInventoryStats(),
    getAllOrders(10),
  ])

  return {
    stats: {
      revenue: Number(stats.revenue) || 0,
      total: Number(stats.total) || 0,
      pending: Number(stats.pending) || 0,
      delivered: Number(stats.delivered) || 0,
    },
    statusCounts,
    inventory,
    recentOrders: recent.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      status: o.status,
      totalAmount: o.totalAmount,
      customerName: o.shippingAddress?.fullName ?? o.userFullName ?? '—',
      customerPhone: o.shippingAddress?.phone ?? '',
      createdAt: o.createdAt instanceof Date ? o.createdAt.toISOString() : String(o.createdAt),
    })),
    rangeDays,
    generatedAt: new Date().toISOString(),
  }
}
