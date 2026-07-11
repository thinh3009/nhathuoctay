// Kiểu dữ liệu cho dashboard admin (dùng chung server query ↔ client component).

export type OrderStatus =
  | 'pending' | 'confirmed' | 'processing' | 'shipping' | 'delivered' | 'cancelled' | 'refunded'

export type StatusCount = { status: string; count: number }

export type CategoryProductStat = { slug: string; label: string; count: number; stock: number }

export type InventoryStats = {
  byCategory: CategoryProductStat[]
  totalProducts: number
  activeProducts: number
  totalStock: number
  outOfStock: number
  lowStock: number
  /** SP tồn kho thấp/hết — cảnh báo nhập hàng. */
  lowStockItems: { name: string; stock: number; categoryLabel: string }[]
}

export type RecentOrder = {
  id: string
  orderNumber: string
  status: string
  totalAmount: number
  customerName: string
  customerPhone: string
  createdAt: string
}

export type DashboardData = {
  stats: { revenue: number; total: number; pending: number; delivered: number }
  statusCounts: StatusCount[]
  inventory: InventoryStats
  recentOrders: RecentOrder[]
  /** Khoảng lọc (ngày) áp cho biểu đồ trạng thái đơn — 0 = tất cả. */
  rangeDays: number
  generatedAt: string
}
