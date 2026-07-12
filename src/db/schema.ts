import { relations } from 'drizzle-orm'
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  real,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'
import type { ProductImage } from '@/lib/schemas'

/* ── Users ── */

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  // Định danh đăng nhập: email HOẶC số điện thoại (ít nhất một, ràng buộc ở app + CHECK DB).
  // Cả hai đều unique nhưng nullable — Postgres cho phép nhiều NULL trong cột unique.
  email: text('email').unique(),
  phone: text('phone').unique(),
  passwordHash: text('password_hash').notNull(),
  fullName: text('full_name').notNull(),
  role: text('role', { enum: ['customer', 'admin', 'pharmacist'] }).notNull().default('customer'),
  isActive: boolean('is_active').notNull().default(true),
  emailVerified: boolean('email_verified').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

// Tin nhắn tư vấn giữa khách (đã đăng nhập) và dược sĩ/admin. Mỗi user = 1 hội thoại.
export const chatMessages = pgTable(
  'chat_messages',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    sender: text('sender', { enum: ['user', 'admin'] }).notNull(),
    // Tên người gửi hiển thị trong thông báo (chủ yếu cho tin admin: tên dược sĩ trả lời).
    senderName: text('sender_name'),
    content: text('content').notNull(),
    readByAdmin: boolean('read_by_admin').notNull().default(false),
    readByUser: boolean('read_by_user').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index('chat_messages_user_created_idx').on(t.userId, t.createdAt)],
)

export const userAddresses = pgTable('user_addresses', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  fullName: text('full_name').notNull(),
  phone: text('phone').notNull(),
  addressLine: text('address_line').notNull(),
  ward: text('ward'),
  district: text('district'),
  city: text('city').notNull(),
  isDefault: boolean('is_default').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

/* ── Categories ── */

export const categories = pgTable('categories', {
  slug: text('slug').primaryKey(),
  label: text('label').notNull(),
  heroTitle: text('hero_title').notNull(),
  heroDescription: text('hero_description').notNull(),
  // Ẩn danh mục khỏi storefront (nav, trang danh mục, trang chủ, trang sản phẩm)
  // khi ngừng bán loại hàng đó; admin vẫn thấy và bật lại được.
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

/* ── Products ── */

export const products = pgTable(
  'products',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    slug: text('slug').notNull().unique(),
    categorySlug: text('category_slug')
      .notNull()
      .references(() => categories.slug, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    subCategory: text('sub_category').notNull(),
    benefit: text('benefit').notNull(),
    description: text('description').notNull(),
    shortDescription: text('short_description').notNull(),
    price: integer('price').notNull(),
    salePrice: integer('sale_price'),
    badge: text('badge').notNull(),
    ingredients: jsonb('ingredients').$type<string[]>().notNull(),
    usage: text('usage').notNull(),
    unit: text('unit').notNull(),
    defaultQuantity: integer('default_quantity').notNull(),
    sku: text('sku').notNull(),
    rating: real('rating').notNull(),
    reviewCount: integer('review_count').notNull(),
    commentCount: integer('comment_count').notNull(),
    officialName: text('official_name').notNull(),
    registrationNumber: text('registration_number').notNull(),
    form: text('form').notNull(),
    specification: text('specification').notNull(),
    manufacturer: text('manufacturer').notNull(),
    countryOfOrigin: text('country_of_origin').notNull(),
    shelfLife: text('shelf_life').notNull(),
    ingredientHighlight: text('ingredient_highlight').notNull(),
    images: jsonb('images').$type<ProductImage[]>().notNull(),
    // 3 trạng thái: null = trống (không phân loại), false = không kê đơn, true = kê đơn.
    prescriptionRequired: boolean('prescription_required'),
    isActive: boolean('is_active').notNull().default(true),
    stockQuantity: integer('stock_quantity').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    productSlugUnique: uniqueIndex('product_slug_unique').on(table.slug),
  }),
)

export const productReviews = pgTable('product_reviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  productSlug: text('product_slug')
    .notNull()
    .references(() => products.slug, { onDelete: 'cascade' }),
  author: text('author').notNull(),
  rating: integer('rating').notNull(),
  date: text('date').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  isApproved: boolean('is_approved').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

/* ── Articles (bài viết / blog) ── */

export const articles = pgTable('articles', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  excerpt: text('excerpt').notNull(),
  content: text('content').notNull(),
  coverImage: text('cover_image'),
  category: text('category').notNull().default('Tin sức khỏe'),
  status: text('status', { enum: ['draft', 'published'] }).notNull().default('draft'),
  authorId: uuid('author_id').references(() => users.id, { onDelete: 'set null' }),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

/* ── Cart ── */

export const carts = pgTable('carts', {
  id: uuid('id').defaultRandom().primaryKey(),
  cartToken: text('cart_token').notNull().unique(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const cartItems = pgTable(
  'cart_items',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    cartId: uuid('cart_id')
      .notNull()
      .references(() => carts.id, { onDelete: 'cascade' }),
    productSlug: text('product_slug')
      .notNull()
      .references(() => products.slug, { onDelete: 'cascade' }),
    quantity: integer('quantity').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    cartProductUnique: uniqueIndex('cart_product_unique').on(table.cartId, table.productSlug),
  }),
)

/* ── Orders ── */

type ShippingAddress = {
  fullName: string
  phone: string
  addressLine: string
  ward?: string
  district?: string
  city: string
}

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  orderNumber: text('order_number').notNull().unique(),
  status: text('status', {
    enum: ['pending', 'confirmed', 'processing', 'shipping', 'delivered', 'cancelled', 'refunded'],
  }).notNull().default('pending'),
  totalAmount: integer('total_amount').notNull(),
  shippingFee: integer('shipping_fee').notNull().default(0),
  discountAmount: integer('discount_amount').notNull().default(0),
  paymentMethod: text('payment_method', {
    enum: ['cod', 'bank_transfer', 'momo', 'vnpay'],
  }).notNull().default('cod'),
  paymentStatus: text('payment_status', {
    enum: ['pending', 'paid', 'failed', 'refunded'],
  }).notNull().default('pending'),
  shippingAddress: jsonb('shipping_address').$type<ShippingAddress>().notNull(),
  note: text('note'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const orderItems = pgTable('order_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  productSlug: text('product_slug')
    .notNull()
    .references(() => products.slug),
  productName: text('product_name').notNull(),
  quantity: integer('quantity').notNull(),
  price: integer('price').notNull(),
  subtotal: integer('subtotal').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

/* ── Wishlists ── */

export const wishlists = pgTable(
  'wishlists',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    productSlug: text('product_slug')
      .notNull()
      .references(() => products.slug, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userProductUnique: uniqueIndex('wishlist_user_product_unique').on(table.userId, table.productSlug),
  }),
)

/* ── Combos (combo thuốc do admin tạo) ── */

export const combos = pgTable('combos', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  tag: text('tag').notNull().default('Tiết kiệm'),
  // Giá combo tùy chọn; null = tự tính (giảm 85% tổng giá thành viên).
  salePrice: integer('sale_price'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const comboItems = pgTable(
  'combo_items',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    comboId: uuid('combo_id')
      .notNull()
      .references(() => combos.id, { onDelete: 'cascade' }),
    productSlug: text('product_slug')
      .notNull()
      .references(() => products.slug, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    comboProductUnique: uniqueIndex('combo_product_unique').on(table.comboId, table.productSlug),
  }),
)

/* ── Hero images (ảnh banner trang chủ) ── */

export const heroImages = pgTable('hero_images', {
  id: uuid('id').defaultRandom().primaryKey(),
  // Đường dẫn trong bucket product-images (prefix `hero/`) — để xóa file khi gỡ ảnh.
  storagePath: text('storage_path').notNull(),
  url: text('url').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

// Ảnh tùy biến giao diện trang chủ do admin đặt: mỗi `slot` một ảnh
// ('hero' = banner đầu trang, 'cta' = nền dải kêu gọi, 'logo' = logo header/footer).
export const siteImages = pgTable('site_images', {
  slot: text('slot').primaryKey(),
  storagePath: text('storage_path').notNull(),
  url: text('url').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

/* ── Relations ── */

export const usersRelations = relations(users, ({ many }) => ({
  addresses: many(userAddresses),
  orders: many(orders),
  wishlists: many(wishlists),
  carts: many(carts),
}))

export const userAddressesRelations = relations(userAddresses, ({ one }) => ({
  user: one(users, { fields: [userAddresses.userId], references: [users.id] }),
}))

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}))

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categorySlug],
    references: [categories.slug],
  }),
  reviews: many(productReviews),
  cartItems: many(cartItems),
  orderItems: many(orderItems),
  wishlists: many(wishlists),
}))

export const productReviewsRelations = relations(productReviews, ({ one }) => ({
  product: one(products, {
    fields: [productReviews.productSlug],
    references: [products.slug],
  }),
}))

export const cartsRelations = relations(carts, ({ many, one }) => ({
  items: many(cartItems),
  user: one(users, { fields: [carts.userId], references: [users.id] }),
}))

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, { fields: [cartItems.cartId], references: [carts.id] }),
  product: one(products, { fields: [cartItems.productSlug], references: [products.slug] }),
}))

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  items: many(orderItems),
}))

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, { fields: [orderItems.productSlug], references: [products.slug] }),
}))

export const wishlistsRelations = relations(wishlists, ({ one }) => ({
  user: one(users, { fields: [wishlists.userId], references: [users.id] }),
  product: one(products, { fields: [wishlists.productSlug], references: [products.slug] }),
}))

export const combosRelations = relations(combos, ({ many }) => ({
  items: many(comboItems),
}))

export const comboItemsRelations = relations(comboItems, ({ one }) => ({
  combo: one(combos, { fields: [comboItems.comboId], references: [combos.id] }),
  product: one(products, { fields: [comboItems.productSlug], references: [products.slug] }),
}))
