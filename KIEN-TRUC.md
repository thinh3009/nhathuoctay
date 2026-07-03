# Kiến trúc chức năng — Website Nhà thuốc 16

Tài liệu mô tả kiến trúc chức năng của website thương mại điện tử **Nhà thuốc 16** —
một nhà thuốc online bán thuốc, thực phẩm chức năng, sản phẩm chăm sóc da và thiết bị
y tế, kèm trợ lý chatbot tra cứu thuốc bằng AI.

---

## 1. Tổng quan công nghệ

| Lớp | Công nghệ |
|-----|-----------|
| Web framework | **Next.js 16** (App Router, React 19, Server Components) |
| Ngôn ngữ | TypeScript |
| Giao diện | Tailwind CSS 4 |
| Cơ sở dữ liệu | **PostgreSQL trên Supabase** truy cập qua **Drizzle ORM** (driver `postgres`, `prepare:false` để tương thích transaction pooler) |
| Hosting | **Vercel** (Next.js) + **Supabase** (Postgres, Storage ảnh sản phẩm) |
| Xác thực | JWT (`jose`) lưu trong cookie `httpOnly`, mật khẩu băm bằng `bcryptjs` |
| Validation | `zod` |
| Nội dung bài viết | Markdown render bằng `react-markdown` + `remark-gfm` |
| Chatbot | Route handler `/api/chat` dùng **Anthropic SDK (`@anthropic-ai/sdk`)** với tool-use |

Hệ thống là **một service Next.js duy nhất** (chatbot đã được port từ FastAPI sang
route handler nội bộ để đồng nhất codebase):

```
┌─────────────────────────────────────────────┐
│  Next.js app (cổng 3000)                     │
│  - Storefront + Admin                        │
│  - API routes nội bộ (gồm /api/chat)         │
│  - Chatbot: Claude tool-use (search_drugs)   │
│  - Drizzle ORM ──────────────────┐           │
└──────────────────────────────────┼───────────┘
                                    ▼
                  ┌─────────────────────────────────┐
                  │         PostgreSQL (chung)       │
                  └─────────────────────────────────┘
```

Chatbot không nhân bản dữ liệu mà query thẳng bảng `products` qua Drizzle, nên kết
quả luôn cập nhật.

> Thư mục `chatbot-api/` (service FastAPI cũ) đã được thay thế và **có thể xóa**.

---

## 2. Cấu trúc thư mục chính

```
src/
├── app/                      # App Router – routes & pages
│   ├── (landing)/            # Trang chủ (route group, layout riêng)
│   ├── product/[slug]/       # Trang chi tiết sản phẩm
│   ├── category/[categorySlug]/  # Trang danh mục + lọc/sắp xếp
│   ├── cart/                 # Giỏ hàng
│   ├── checkout/             # Đặt hàng + trang success
│   ├── account/orders/       # Lịch sử đơn của khách
│   ├── auth/                 # Đăng nhập / đăng ký
│   ├── bai-viet/             # Blog/tin sức khỏe (list + [slug])
│   ├── admin/                # Khu quản trị (CMS)
│   └── api/                  # API routes nội bộ (REST)
├── components/               # Component dùng chung (ProductCard, ReviewSection…)
│   ├── SiteHeader.tsx        # Header dùng chung (khớp trang chủ, điều hướng route thật)
│   ├── SiteFooter.tsx        # Footer dùng chung (khớp trang chủ)
│   ├── AuthMenu.tsx          # Menu tài khoản dùng chung (gọi /api/auth/me, login/logout)
│   ├── quaythuoc/            # Storefront trang chủ (QuayThuoc16 – client SPA)
│   └── DrugChatbot.tsx       # Widget chatbot (client) gọi same-origin /api/chat
├── db/                       # Schema, client, queries, seed/bootstrap scripts
│   ├── schema.ts             # Định nghĩa toàn bộ bảng + quan hệ (Drizzle)
│   └── queries/              # Hàm truy vấn theo domain
├── lib/                      # auth, cart, catalog, password, schemas, constants
├── config/                   # site.ts, redirects.ts
├── middleware.ts             # Redirect rules (auth middleware đang tắt)
└── storage/                  # Đồng bộ ảnh sản phẩm

chatbot-api/                  # Service Python độc lập
├── main.py                   # FastAPI app + vòng lặp agentic streaming
├── drug_search.py            # Tool search_drugs → query PostgreSQL
└── requirements.txt
```

---

## 3. Mô hình dữ liệu (`src/db/schema.ts`)

Các bảng chính và quan hệ:

| Bảng | Vai trò | Quan hệ |
|------|---------|---------|
| `users` | Tài khoản (role: `customer` / `admin` / `pharmacist`) | 1–n addresses, orders, carts, wishlists |
| `user_addresses` | Sổ địa chỉ giao hàng | n–1 user |
| `categories` | 4 danh mục (slug làm khóa chính) | 1–n products |
| `products` | Sản phẩm + thông tin dược (số đăng ký, nhà SX, kê đơn…) | n–1 category; 1–n reviews/cartItems/orderItems |
| `product_reviews` | Đánh giá sản phẩm | n–1 product (theo `slug`) |
| `articles` | Bài viết/blog (Markdown, `draft`/`published`) | n–1 author (user) |
| `carts` | Giỏ hàng (gắn `cart_token`, có thể chưa đăng nhập) | 1–n cartItems |
| `cart_items` | Dòng giỏ hàng (unique theo cart + product) | n–1 cart, product |
| `orders` | Đơn hàng (status, payment, địa chỉ JSON) | 1–n orderItems |
| `order_items` | Dòng đơn — **lưu giá tại thời điểm đặt** | n–1 order, product |
| `wishlists` | Sản phẩm yêu thích (unique user + product) | n–1 user, product |

Điểm thiết kế đáng chú ý:
- **`products.slug` được dùng làm khóa ngoại** ở nhiều bảng (cart_items, order_items,
  reviews, wishlists) thay vì `id`, thuận tiện cho URL và truy vấn.
- `orders.shippingAddress` và `products.images`/`ingredients` lưu dạng **JSONB** có
  kiểu hóa TypeScript qua `$type<>()`.
- `order_items` **snapshot** `productName`, `price`, `subtotal` để đơn cũ không đổi
  khi giá sản phẩm thay đổi.
- Giỏ hàng dùng `cart_token` (cookie) nên **khách vãng lai vẫn thêm vào giỏ được**;
  `userId` nullable, gắn khi đăng nhập.
- `products` có thêm `sale_price` (giá giảm, nullable), `is_active` (ẩn/hiện),
  `stock_quantity`, `prescription_required`.
- **DB là nguồn dữ liệu chính cho sản phẩm.** Trang danh mục/chi tiết đọc qua
  `db/queries/catalog.ts`, **lọc theo `is_active`** (đã bỏ cơ chế allowlist slug tĩnh
  cũ). Trang chủ đọc qua `db/queries/storefront.ts`. `productSchema` (`lib/schemas.ts`)
  đã được **nới lỏng** cho các field mô tả (cho phép rỗng) để sản phẩm admin nhập tối
  thiểu vẫn hiển thị được.

---

## 4. Phân hệ chức năng

### 4.1 Storefront (khách hàng)

- **Trang chủ** `(landing)/` — storefront SPA `QuayThuoc16` (client component: home,
  category, search, product, cart demo). **Đọc sản phẩm từ DB** qua
  `getStorefrontProducts()` (`db/queries/storefront.ts`) rồi truyền vào qua prop; map
  `category_slug` → enum `cat` và `salePrice` → giá gạch. Có `opengraph-image`,
  `sitemap`, `robots` cho SEO.
  > ⚠️ Hiện đặt `export const dynamic = 'force-dynamic'` để sản phẩm admin thêm hiện
  > ngay — mỗi request query lại DB. Nên đổi sang `revalidate = 60` + `revalidatePath('/')`
  > trong action tạo/sửa sản phẩm để cache HTML mà vẫn tươi.
  > **Lưu ý:** `sitemap.ts` vẫn dùng danh sách sản phẩm tĩnh (`@/lib/catalog`) → sản phẩm
  > admin thêm chưa vào sitemap; nên chuyển sang query DB.
- **Danh mục** `category/[categorySlug]` — danh sách sản phẩm với **lọc** (sub-category,
  khoảng giá) và **sắp xếp** (`featured`, giá tăng/giảm, tên, rating); phân trang
  `PRODUCTS_PER_PAGE = 10`.
- **Chi tiết sản phẩm** `product/[slug]` — hero ảnh, thông tin dược, đánh giá
  (`ReviewSection`), **sản phẩm liên quan**, nút thêm vào giỏ, có `loading.tsx`.
- **Giỏ hàng** `cart/` — chỉnh số lượng, xóa dòng, hiển thị tạm tính.
- **Thanh toán** `checkout/` — nhập địa chỉ, chọn phương thức (`cod` / `bank_transfer`
  / `momo` / `vnpay`), tạo đơn → trang `checkout/success`.
- **Tài khoản** `account/orders` — xem lịch sử đơn của mình.
- **Blog** `bai-viet/` và `bai-viet/[slug]` — tin sức khỏe viết bằng Markdown.
- **Chatbot** `DrugChatbot.tsx` — widget nổi gọi same-origin `/api/chat` để tra cứu sản phẩm.
- **Header/Footer đồng bộ** — mọi trang storefront (category, product, cart, bài viết,
  account/orders) dùng chung `SiteHeader`/`SiteFooter` khớp giao diện trang chủ
  (`QuayThuoc16`). `StoreHeader`/`StoreFooter` cũ (thương hiệu "NutriHome") đã bị gỡ bỏ.
  Checkout giữ header tối giản riêng để tập trung luồng thanh toán.
- **Đăng nhập/tài khoản** — `AuthMenu` gắn trên `SiteHeader` và header trang chủ:
  chưa đăng nhập hiện "Đăng nhập" (`/auth/login`); đã đăng nhập hiện dropdown
  (Đơn hàng, Trang quản trị nếu là admin, Đăng xuất).

### 4.2 Khu quản trị (`/admin`)

Dashboard CMS, sidebar điều hướng (`src/app/admin/layout.tsx`):

| Mục | Chức năng |
|-----|-----------|
| Dashboard | Tổng quan |
| Sản phẩm | CRUD sản phẩm (`new`, `[id]/edit`) |
| Danh mục | Quản lý category |
| Đơn hàng | Danh sách + chi tiết `[id]`, **cập nhật trạng thái** đơn |
| Bài viết | CRUD bài viết (dùng server actions trong `articles/actions.ts`) |
| Người dùng | Danh sách + **tạo user** (form `CreateUserForm`) |

Layout admin **chặn truy cập ở server**: `getAuthUser()` → nếu không phải `admin`
thì `redirect('/')`.

### 4.3 Chatbot tra cứu thuốc (`/api/chat`)

- **Kiến trúc tool-use (function calling)** chứ không phải RAG/vector DB — phù hợp
  catalog nhỏ, dữ liệu luôn mới.
- `POST /api/chat` (`src/app/api/chat/route.ts`) nhận lịch sử hội thoại, chạy **vòng
  lặp agentic có streaming**: Claude (`claude-opus-4-8`, adaptive thinking, effort
  medium) tự gọi công cụ `search_drugs` khi cần, tối đa 6 vòng để tránh lặp vô hạn.
  Chạy trên Node runtime, `maxDuration = 60`.
- `src/db/queries/drugSearch.ts` chạy `ILIKE` trên nhiều cột (tên, công dụng, thành
  phần…) qua **Drizzle**, chỉ lấy sản phẩm `isActive`, sắp theo `rating`, giới hạn 8.
- **System prompt** ràng buộc an toàn: chỉ giới thiệu sản phẩm có trong kết quả,
  nhắc thuốc kê đơn, không chẩn đoán bệnh, luôn kèm khuyến cáo tham khảo dược sĩ.
- Frontend (`DrugChatbot.tsx`) gọi **same-origin** `/api/chat`, đọc **text stream**
  bằng `response.body.getReader()` (không còn CORS, không còn service Python riêng).
- Cần biến môi trường `ANTHROPIC_API_KEY`.

> Có thể nâng lên RAG/pgvector sau này chỉ bằng cách thay thân hàm
> `searchDrugs`, phần còn lại giữ nguyên.

---

## 5. Xác thực & phân quyền (`src/lib/auth.ts`)

- Đăng nhập/đăng ký qua API routes (`api/auth/{login,register,logout,me}`); mật khẩu
  băm `bcryptjs` (`lib/password.ts`).
- Phát hành **JWT (HS256, hạn 7 ngày)** bằng `jose`, lưu trong cookie `httpOnly`,
  `sameSite=lax`, `secure` ở production (`AUTH_COOKIE_NAME = nhathuoc16_auth`).
- `getAuthUser()` đọc & verify token từ cookie; `requireAdmin()` ép quyền admin trong
  server action/API.
- **Phân quyền hiện thực thi ở tầng layout/route (server)**, không qua middleware.

### 5.1 Bảo mật tầng database — Supabase RLS

App kết nối Postgres **trực tiếp bằng role `postgres`** (connection string), role này
**bypass RLS** nên toàn quyền đọc/ghi. App **không** dùng `supabase-js` / Data API.

Vì Supabase tự expose một **REST Data API công khai** (PostgREST) mở bằng **anon key**
(anon key là public, nằm trong `NEXT_PUBLIC_SUPABASE_ANON_KEY`), nếu **RLS tắt** thì bất
kỳ ai cũng đọc/ghi được mọi bảng qua API đó — kể cả `users` (email + `password_hash`),
`orders`, `user_addresses`.

✅ **Đã bật RLS trên toàn bộ 11 bảng** (`alter table … enable row level security`), **không
thêm policy nào** → Data API công khai bị chặn hoàn toàn (trả 0 dòng), còn app vẫn chạy
bình thường vì role `postgres` bypass RLS. Đã kiểm chứng: anon key không đọc được dữ liệu,
app đọc `products`/`users` bình thường.

> ⚠️ **Nợ kỹ thuật / cần xử lý trước production:**
> - `middleware.ts` đang **tắt auth middleware**, chỉ còn xử lý redirect; việc bảo vệ
>   `/admin` và `/account` dựa hoàn toàn vào kiểm tra trong layout/route.
> - Server action ghi dữ liệu của admin (vd `createProduct` trong `admin/products/new`)
>   **chưa gọi `requireAdmin()`** — chỉ layout chặn truy cập trang; nên thêm kiểm tra
>   quyền ngay trong mỗi action.
> - `JWT_SECRET` có **giá trị mặc định hard-code** (`lib/auth.ts`) — bắt buộc đặt biến
>   môi trường `JWT_SECRET` riêng khi deploy (có thể tái dùng `SUPABASE_JWT_SECRET`).
> - Khóa nhạy cảm (`ANTHROPIC_API_KEY`, DB password, `SUPABASE_SERVICE_ROLE_KEY`) nếu đã
>   lộ cần **revoke và thay mới**.

### 5.2 Biến môi trường (Vercel + local)

| Biến | Dùng ở | Ghi chú |
|------|--------|---------|
| `DATABASE_URL` | runtime app | Transaction pooler **cổng 6543** (`prepare:false`) |
| `POSTGRES_URL_NON_POOLING` | migrate/seed local | Direct connection **cổng 5432** (không cần trên Vercel) |
| `JWT_SECRET` | auth | **Phải đặt** trên Vercel; tránh dùng giá trị mặc định |
| `ANTHROPIC_API_KEY` | `/api/chat` | Chatbot |
| `NEXT_PUBLIC_SUPABASE_*` | (không dùng trong code) | Do tích hợp Supabase↔Vercel thêm; app không cần |

---

## 6. Tầng API nội bộ (Next.js Route Handlers — `src/app/api`)

| Nhóm | Endpoint | Chức năng |
|------|----------|-----------|
| Catalog | `products`, `products/[slug]`, `products/[slug]/related`, `categories` | Đọc sản phẩm/danh mục |
| Review | `products/[slug]/reviews` | Đánh giá sản phẩm |
| Cart | `cart`, `cart/items`, `cart/items/[productSlug]` | Thao tác giỏ hàng theo `cart_token` |
| Checkout | `checkout` | Tạo đơn từ giỏ (validate `zod`, tính phí ship) |
| Auth | `auth/login`, `auth/register`, `auth/logout`, `auth/me` | Phiên đăng nhập |
| Admin | `admin/orders/[id]/status`, `admin/users` | Cập nhật đơn, quản lý user |

**Logic nghiệp vụ tiêu biểu — `api/checkout`:**
1. Validate payload bằng `zod` (địa chỉ, phương thức thanh toán).
2. Lấy giỏ theo `cart_token`; chặn nếu giỏ trống.
3. **Đọc lại giá hiện tại từ DB** (không tin giá client gửi).
4. Tính `subtotal`; **miễn phí ship nếu ≥ 500.000đ**, ngược lại 30.000đ.
5. `createOrder()` ghi đơn + dòng đơn (snapshot giá), trả `orderNumber`.

---

## 7. Quy ước & cấu hình

- **Hằng số nghiệp vụ** tập trung ở `src/lib/constants.ts`: danh sách category, tên
  cookie, số sản phẩm/trang, các tùy chọn sắp xếp & khoảng giá.
- **Thông tin site** ở `src/config/site.ts` (tên, mô tả, URL, liên hệ); **redirect**
  ở `src/config/redirects.ts`.
- Truy vấn DB gom theo domain trong `src/db/queries/` (`catalog`, `cart`, `orders`,
  `users`, `articles`).
- **Scripts vận hành** (`package.json`):
  - `db:push` / `db:studio` — Drizzle Kit
  - `db:bootstrap`, `db:seed`, `seed-articles` — khởi tạo & nạp dữ liệu
  - `admin:create` (`bootstrap-admin.ts`) — tạo tài khoản admin đầu tiên
  - `storage:sync` — đồng bộ ảnh sản phẩm

---

## 8. Luồng dữ liệu tiêu biểu

**Mua hàng:**
```
Khách duyệt category/product → AddToCartButton → POST /api/cart/items
   → cart_items (gắn cart_token)
Checkout → POST /api/checkout → đọc giá từ DB, tính phí ship
   → createOrder → orders + order_items → /checkout/success
Admin → /admin/orders/[id] → cập nhật status qua /api/admin/orders/[id]/status
```

**Hỏi chatbot:**
```
DrugChatbot (client) → POST /api/chat (same-origin)
   → route handler: Claude gọi tool search_drugs → searchDrugs() query PostgreSQL (products)
   → stream câu trả lời tiếng Việt về client (đọc dần qua reader)
```

---

*Tài liệu này phản ánh trạng thái hiện tại của mã nguồn (Phase 1 MVP). Khi bật lại auth
middleware, thay khóa bí mật, hoặc nâng cấp chatbot lên RAG, hãy cập nhật các mục tương ứng.*

*Cập nhật gần nhất (07/2026): kết nối Supabase + deploy Vercel; trang chủ đọc sản phẩm
từ DB; thêm menu đăng nhập (`AuthMenu`); sửa hiển thị sản phẩm do admin tạo (bỏ allowlist
tĩnh, lọc `is_active`, nới `productSchema`); **bật RLS toàn bộ bảng** để chặn Data API công khai.*
