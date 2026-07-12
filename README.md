# Quầy thuốc 16 — Nhà thuốc trực tuyến

Ứng dụng thương mại điện tử cho nhà thuốc: storefront cho khách mua hàng và khu quản trị (admin)
để quản lý sản phẩm, danh mục, combo, bài viết, đơn hàng, người dùng và hình ảnh.

- **Storefront**: trang chủ SPA "Quầy thuốc 16", danh mục, chi tiết sản phẩm, giỏ hàng, thanh toán,
  blog, đặt thuốc theo toa, tư vấn dược sĩ (gửi tin qua Telegram).
- **Admin** (`/admin`): CRUD sản phẩm/danh mục/combo/bài viết, quản lý đơn hàng, người dùng và
  ảnh (Storage + ảnh hero trang chủ).

---

## 1. Công nghệ

| Lớp | Công nghệ |
|---|---|
| Framework | **Next.js 16 (App Router)** + React 19 + TypeScript |
| UI | Tailwind CSS v4 |
| ORM / DB | **Drizzle ORM** → **Postgres (Supabase)** qua driver `postgres` |
| Xác thực | JWT (`jose`) + cookie phiên, mật khẩu băm bằng `bcryptjs` |
| Validate | **Zod** (schema dùng chung client ↔ server) |
| Lưu trữ ảnh | **Supabase Storage** (bucket `product-images`, public) |
| Tư vấn | Khung "Tư vấn dược sĩ" gửi tin thẳng vào **Telegram bot** (không dùng AI) |
| Bảo vệ server code | `server-only` (chặn import query/DB vào client) |
| Triển khai | Vercel |

**Kết nối DB:** dùng `DATABASE_URL` (Supabase transaction pooler cổng 6543, `prepare:false`), role
`postgres` nên **bypass RLS**. App **không** dùng `supabase-js` / Data API.

---

## 2. Kiến trúc — Feature-Based (mô-đun theo nghiệp vụ)

Mã nguồn tổ chức theo **mô-đun tính năng**: mỗi nghiệp vụ gom trọn logic (đọc, ghi, validate,
kiểu dữ liệu, giao diện) vào một thư mục trong `src/features/`. Trang trong `src/app/` chỉ đóng vai
trò **định tuyến + khung giao diện**, gọi hàm từ feature rồi render.

### Quy tắc phân lớp

| File trong `features/<module>/` | Vai trò | Ràng buộc |
|---|---|---|
| `actions.ts` | **Chỉ mutation** (thêm/sửa/xóa) | Bắt đầu bằng `'use server'`; validate bằng Zod; gọi `requireAdmin()` nếu cần |
| `queries.ts` | **Chỉ đọc dữ liệu** (server-side) | Bắt đầu bằng `import 'server-only'`; không có `'use server'` |
| `schemas.ts` | Zod schema validate dữ liệu | Tái sử dụng ở cả client (bắt lỗi khi gõ) và server |
| `types.ts` | Kiểu TypeScript công khai của feature | Re-export kiểu miền + kiểu suy ra từ schema |
| `components/` | Giao diện chuyên biệt của feature | Client/Server Component riêng của nghiệp vụ đó |

**Nguyên tắc:**
- Trang `page.tsx` giữ **mỏng**: không viết SQL trực tiếp, không nhồi JSX dài — gọi `queries.ts`
  lấy dữ liệu và truyền vào component.
- Mọi file đọc DB đều có `import 'server-only'` để trình biên dịch **chặn** việc lỡ import vào
  Client Component.
- Mọi mutation validate đầu vào bằng Zod trong `actions.ts` trước khi ghi DB.

---

## 3. Cấu trúc thư mục

```
src/
├── app/                          # 1. ROUTING LAYER — chỉ định tuyến & khung giao diện
│   ├── layout.tsx                #   Root layout (gắn chatbot toàn cục)
│   ├── (landing)/page.tsx        #   Trang chủ: đọc DB → storefront SPA
│   ├── category/[categorySlug]/  #   Danh sách sản phẩm theo danh mục
│   ├── product/[slug]/           #   Chi tiết sản phẩm
│   ├── cart/ · checkout/         #   Giỏ hàng & thanh toán
│   ├── bai-viet/ · account/      #   Blog công khai & đơn hàng của tôi
│   ├── auth/                     #   Đăng nhập / đăng ký
│   ├── admin/                    #   Khu quản trị (requireAdmin, AdminShell)
│   │   ├── products/ categories/ combos/ articles/ orders/ users/ images/
│   └── api/                      #   Route handlers (auth, cart, checkout, chat, upload ảnh…)
│
├── features/                     # 2. BUSINESS LOGIC LAYER — trái tim ứng dụng
│   ├── products/                 #   { actions, queries, schemas, types, components/ }
│   ├── categories/               #   { actions, queries, schemas, types }
│   ├── combos/                   #   { actions, queries, schemas, types, components/ }
│   ├── articles/                 #   { actions, queries, types, components/ }
│   ├── orders/                   #   { queries, types, components/ }
│   ├── users/                    #   { actions, queries, schemas, types, components/ }
│   ├── auth/                     #   { components/ } — cấu hình auth nằm ở lib/auth.ts
│   ├── cart/                     #   { queries, types, components/ }
│   ├── chat/                     #   { components/ } — khung tư vấn dược sĩ (gửi Telegram)
│   ├── images/                   #   { queries, storage, types, components/ } — Storage & ảnh hero
│   └── storefront/               #   SPA "Quầy thuốc 16"
│       ├── queries.ts            #     dữ liệu trang chủ (sản phẩm/tin/combo/hero)
│       ├── data.ts               #     type + dữ liệu tĩnh fallback
│       ├── use-storefront.ts     #     hub state/logic của SPA
│       └── components/           #     QuayThuoc16, screens/, cards, header/footer
│
├── components/                   # 3. GLOBAL UI — dùng chung toàn dự án
│   ├── ui/                       #   AnimateIn, MarkdownContent, PaginationControls, QuantitySelector
│   └── layout/                   #   SiteHeader, SiteFooter, AdminShell, AdminLogoutButton
│
├── lib/                          # 4. CONFIG & SHARED — cấu hình + logic miền dùng chung
│   ├── db.ts                     #   Khởi tạo kết nối Drizzle/Postgres (lazy proxy)
│   ├── auth.ts                   #   JWT, phiên đăng nhập, requireAdmin
│   ├── schemas.ts                #   Zod schema hợp đồng dùng chung (product, cart, review…)
│   ├── constants.ts              #   Hằng số danh mục, phân trang, cookie
│   ├── catalog.ts                #   Dữ liệu tĩnh fallback + tiện ích catalog
│   ├── productImages.ts          #   Chuẩn hoá/ dựng URL ảnh sản phẩm
│   ├── prescription.ts           #   Phân loại thuốc kê đơn (3 trạng thái)
│   ├── password.ts               #   Băm/so khớp mật khẩu
│   └── supabaseStorage.ts        #   Tích hợp Supabase Storage (service role)
│
├── utils/                        # 5. HELPERS — hàm tiện ích thuần
│   ├── format.ts                 #   formatPrice (VND)
│   └── dates.ts                  #   formatDate (vi-VN)
│
├── db/                           # Định nghĩa bảng & script CLI
│   ├── schema.ts                 #   Drizzle schema — nguồn sự thật cấu trúc bảng
│   ├── seed.ts · seed-articles.ts
│   └── bootstrap.ts · bootstrap-admin.ts
│
└── middleware.ts                 # Bảo vệ route (chuyển sang "proxy" ở Next mới)

drizzle/                          # Migration SQL (kèm manual-*.sql chạy tay trên Supabase)
```

---

## 4. Nguồn dữ liệu trang chủ (storefront)

Trang chủ là **SPA state-machine trong 1 route** (`QuayThuoc16`). `(landing)/page.tsx` đọc DB rồi
truyền prop; `use-storefront.ts` fallback dữ liệu tĩnh (`data.ts`) khi prop rỗng.

| Dữ liệu | Query (`features/storefront/queries.ts`) | Ghi chú |
|---|---|---|
| Sản phẩm | `getStorefrontProducts()` | Lọc `is_active` (cả sản phẩm lẫn danh mục). `id = slug`. |
| Tin tức | `getStorefrontNews()` | Bài viết `published`. |
| Combo | `getStorefrontCombos()` | Từ bảng `combos`/`combo_items`; trống thì ẩn section. |
| Ảnh hero | `getStorefrontHeroImages()` | Bảng `hero_images` (active), sắp theo `sort_order`. |

- Data cache: `revalidate=60`; action admin gọi `updateTag(STOREFRONT_CACHE_TAG)` để cập nhật ngay.
- Danh mục & chi tiết sản phẩm: `features/products/queries.ts` (lọc `is_active`).

---

## 5. Cơ sở dữ liệu

Bảng chính (xem `src/db/schema.ts`):

- `users`, `user_addresses` — tài khoản (role: customer/admin/pharmacist), địa chỉ.
  Đăng ký/đăng nhập bằng **email HOẶC số điện thoại** (`email`/`phone` đều nullable + unique,
  CHECK bắt buộc có ít nhất một — xem `drizzle/manual-0004-user-email-or-phone.sql`).
- `categories` — danh mục (slug PK, `is_active` để ẩn khỏi storefront).
- `products` — sản phẩm. `prescription_required` **nullable 3 trạng thái**:
  `null` = chưa phân loại · `false` = không kê đơn · `true` = kê đơn.
- `product_reviews`, `articles`, `carts`/`cart_items`, `orders`/`order_items`, `wishlists`.
- `combos` + `combo_items` — combo admin tạo (thành viên tham chiếu `products.slug`).
- `hero_images` — ảnh banner hero trang chủ.

### Bảo mật RLS
- RLS **bật trên toàn bộ bảng, KHÔNG có policy** → chặn REST Data API công khai (anon key) đọc/ghi.
  App vẫn chạy vì dùng role `postgres`.
- **Mọi bảng mới phải `ENABLE ROW LEVEL SECURITY` (no policy)** trong migration.

### Quy ước migration
- Sửa `src/db/schema.ts` (nguồn sự thật) **và** tạo file SQL `drizzle/manual-*.sql` để chạy tay
  trên Supabase SQL Editor (kèm `ENABLE ROW LEVEL SECURITY`). **Không** tắt RLS để "sửa nhanh".

### Ảnh & Storage
- Ảnh sản phẩm/hero upload lên bucket `product-images` qua `lib/supabaseStorage.ts`
  (cần `SUPABASE_SERVICE_ROLE_KEY`). Ảnh sản phẩm prefix `uploads/{key}/`, ảnh hero prefix `hero/`.
- `/admin/images` liệt kê Storage + dung lượng và quản lý ảnh hero.

---

## 6. Cài đặt & chạy

```bash
npm install
cp .env.example .env     # điền biến môi trường (xem mục 7)
npm run dev              # http://localhost:3000
```

### Scripts

| Lệnh | Tác dụng |
|---|---|
| `npm run dev` | Chạy dev server (webpack) |
| `npm run build` / `npm start` | Build & chạy production |
| `npm run lint` | ESLint |
| `npm run db:push` | Đồng bộ schema Drizzle lên DB |
| `npm run db:studio` | Drizzle Studio |
| `npm run db:seed` / `db:bootstrap` | Seed dữ liệu mẫu / khởi tạo |
| `npm run admin:create` | Tạo tài khoản admin (từ `ADMIN_*`) |
| `npm run storage:sync` | Đồng bộ ảnh sản phẩm lên Storage |

---

## 7. Biến môi trường

Xem `.env.example`. Nhóm chính:

- **Database**: `DATABASE_URL`, `POSTGRES_URL*`, `POSTGRES_HOST/USER/PASSWORD/DATABASE`
- **Supabase Storage**: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_JWT_SECRET`
- **Auth**: `SUPABASE_JWT_SECRET` (bí mật ký JWT — **bắt buộc set trên Vercel**)
- **Tư vấn Telegram**: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` (khung "Tư vấn dược sĩ" `/api/chat`)
- **Admin bootstrap**: `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`

> ⚠️ Không commit `.env`. Đảm bảo set đầy đủ biến bí mật trên môi trường triển khai.

---

## 8. Kiểm thử & chất lượng

- `npx tsc --noEmit` — kiểm tra kiểu.
- `npm run lint` — ESLint.
- `npm run build` — build production (xác thực ranh giới `server-only`/client).
- Giao diện responsive: breakpoint `@media (max-width: 768px)` trong `src/app/globals.css` phục vụ
  điện thoại (menu gọn, hero xếp dọc, lưới 2 cột, bộ lọc dạng drawer); desktop dùng layout đầy đủ.
