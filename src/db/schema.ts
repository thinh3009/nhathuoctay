import { relations } from 'drizzle-orm'
import {
  integer,
  jsonb,
  pgTable,
  real,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'

export const categories = pgTable('categories', {
  slug: text('slug').primaryKey(),
  label: text('label').notNull(),
  heroTitle: text('hero_title').notNull(),
  heroDescription: text('hero_description').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

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
    images: jsonb('images').$type<string[]>().notNull(),
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
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const carts = pgTable(
  'carts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    cartToken: text('cart_token').notNull().unique(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
)

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
}))

export const productReviewsRelations = relations(productReviews, ({ one }) => ({
  product: one(products, {
    fields: [productReviews.productSlug],
    references: [products.slug],
  }),
}))

export const cartsRelations = relations(carts, ({ many }) => ({
  items: many(cartItems),
}))

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
  product: one(products, {
    fields: [cartItems.productSlug],
    references: [products.slug],
  }),
}))
