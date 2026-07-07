# Kiến trúc dự án — Quầy thuốc 16 (nhathuoctay)

> Tài liệu kiến trúc tổng quan. Cập nhật khi thêm bảng, luồng dữ liệu hoặc tính năng lớn.

## 1. Stack & hạ tầng

- **Next.js (App Router)** + React + TypeScript, Tailwind CSS v4.
- **Drizzle ORM** kết nối **Postgres (Supabase)** trực tiếp qua driver `postgres`
  (`DATABASE_URL`, transaction pooler cổng 6543, `prepare:false`). Dùng role `postgres`
  nên **bypass RLS**. App **không** dùng `supabase-js` / Data API.
- **Supabase Storage** (bucket `product-images`, public) lưu ảnh admin upload.
- Deploy trên **Vercel**.

### Bảo mật RLS
- RLS **bật trên toàn bộ bảng, KHÔNG có policy** → chặn REST Data API công khai (anon key
  public) đọc/ghi dữ liệu nhạy cảm. App vẫn chạy vì dùng role postgres.
- **Mọi bảng mới phải `ENABLE ROW LEVEL SECURITY` (no policy)** trong migration.
- Nợ kỹ thuật: `JWT_SECRET` còn fallback hard-code (phải set env trên Vercel).

## 2. Cấu trúc thư mục chính

```
src/
  app/
    (landing)/page.tsx      # Trang chủ: đọc DB (products/news/combos/hero) → QuayThuoc16
    admin/                  # Khu quản trị (requireAdmin), sidebar AdminShell
      products/             # CRUD sản phẩm (+ ProductImageManager)
      combos/               # CRUD combo (ComboBuilder)
      articles/             # CRUD bài viết (ArticleForm + ArticleCoverImage)
      images/               # Quản lý ảnh Storage + dung lượng + ảnh hero
      categories/ orders/ users/
    api/
      admin/product-images/ # POST/DELETE upload ảnh sản phẩm
      admin/hero-images/     # POST/DELETE/PATCH ảnh hero trang chủ
      products/ cart/ auth/ chat/ ...
    bai-viet/               # Blog công khai
  components/
    quaythuoc/              # Storefront SPA "Quầy thuốc 16"
      QuayThuoc16.tsx       # Điều phối màn hình (client)
      use-storefront.ts     # Toàn bộ state/logic + view-model (hub)
      data.ts               # Type + dữ liệu tĩnh fallback
      screens/              # HomeScreen, CategoryScreen, ...
      HeroCarousel.tsx      # Slider ảnh hero trang chủ
    admin/                  # ProductImageManager, CategoryPrescriptionFields
  db/
    schema.ts               # Drizzle schema (nguồn sự thật cấu trúc bảng)
    queries/                # storefront, catalog, orders, articles, storage, cart...
  lib/                      # auth, catalog, productImages, supabaseStorage, prescription...
drizzle/                    # migration SQL (kèm manual-*.sql chạy tay trên Supabase)
```

## 3. Nguồn dữ liệu storefront (trang chủ)

Trang chủ là **SPA state-machine trong 1 route** (`QuayThuoc16`). `(landing)/page.tsx` đọc
DB rồi truyền prop; `useStorefront` fallback dữ liệu tĩnh (`data.ts`) khi prop rỗng.

| Dữ liệu | Query (cache tag `storefront`) | Ghi chú |
|---|---|---|
| Sản phẩm | `getStorefrontProducts()` | Lọc `is_active` (cả sản phẩm lẫn danh mục). `id = slug`. |
| Tin tức | `getStorefrontNews()` | Bài viết `published`. |
| Combo | `getStorefrontCombos()` | Từ bảng `combos`/`combo_items`. **Không còn demo giả** — trống thì ẩn section. |
| Ảnh hero | `getStorefrontHeroImages()` | Từ bảng `hero_images` (active), sắp theo `sort_order`. |

- Data cache: `revalidate=60`; action admin gọi `updateTag(STOREFRONT_CACHE_TAG)` để cập nhật ngay.
- Danh mục & chi tiết sản phẩm: `db/queries/catalog.ts` (lọc `is_active`).
- `sitemap.ts` **vẫn dùng danh sách tĩnh** `@/lib/catalog` (nợ tồn: sản phẩm admin chưa vào sitemap).

## 4. Các bảng chính (xem `src/db/schema.ts`)

- `users`, `user_addresses` — tài khoản (role: customer/admin/pharmacist), địa chỉ.
- `categories` — danh mục (slug PK, `is_active` để ẩn khỏi storefront).
- `products` — sản phẩm. `prescription_required` **nullable 3 trạng thái**:
  `null` = trống/không phân loại · `false` = không kê đơn · `true` = kê đơn.
- `product_reviews`, `articles`, `carts`/`cart_items`, `orders`/`order_items`, `wishlists`.
- `combos` + `combo_items` — combo thuốc admin tạo (thành viên tham chiếu `products.slug`).
  Giá combo = `sale_price` (nếu đặt) hoặc tự tính giảm 85% tổng giá thành viên.
- `hero_images` — ảnh banner hero trang chủ (`storage_path`, `url`, `sort_order`, `is_active`).

## 5. Ảnh & Storage

- Ảnh sản phẩm/hero upload lên bucket `product-images` qua `supabaseStorage.ts`
  (cần `SUPABASE_SERVICE_ROLE_KEY`). Ảnh sản phẩm: prefix `uploads/{key}/`; ảnh hero: prefix `hero/`.
- `/admin/images` đọc thẳng `storage.objects` (role postgres) để liệt kê + tính dung lượng,
  và có tab **Ảnh hero** để thêm/sửa (đổi thứ tự)/xóa ảnh hero.
- Ảnh bài viết (cover): upload từ máy qua `/api/admin/product-images`, lưu URL vào
  `articles.cover_image`. Khuyến nghị 1200×630px.

## 6. Quy ước migration

- Sửa `src/db/schema.ts` (nguồn sự thật) **và** tạo file SQL trong `drizzle/manual-*.sql`
  để chạy tay trên Supabase SQL Editor (kèm `ENABLE ROW LEVEL SECURITY`).
- Không tắt RLS để "sửa nhanh".
