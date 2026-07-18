# CLAUDE.md — Bộ nhớ làm việc của AI cho dự án "Quầy thuốc 16"

> **File này dành cho AI (Claude Code) đọc đầu mỗi phiên để nắm dự án và làm tiếp, không phải
> tài liệu marketing.** Quy tắc bắt buộc:
> 1. **Đầu phiên**: đọc hết file này trước khi làm gì khác — đặc biệt mục 10 "Nợ kỹ thuật & việc
>    còn dang dở" và mục 11 "Nhật ký phiên làm việc" (entry mới nhất nằm trên cùng) để biết trạng
>    thái thật của repo (có thể khác code cũ trong đầu bạn).
> 2. **Cuối phiên** (sau khi hoàn thành/tạm dừng một việc): thêm một entry mới lên đầu mục 11, cập
>    nhật mục 10 nếu phát sinh/giải quyết nợ kỹ thuật, và sửa các mục kiến trúc (1-9) nếu code đã
>    đổi khác thông tin ghi ở đó. Đừng để file này trôi khỏi thực tế — nó là nguồn sự thật duy nhất
>    giữa các phiên.
> 3. Không có review/test nào tự chạy — nếu bạn sửa code, tự chạy `npx tsc --noEmit` / `npm run
>    lint` / `npm run build` trước khi coi là xong (xem mục 9).

---

## 1. Dự án là gì

**Quầy thuốc 16** — thương mại điện tử cho nhà thuốc. Hai phần:
- **Storefront**: SPA trang chủ "Quầy thuốc 16" (1 route, state machine, xem mục 4), danh mục,
  chi tiết sản phẩm, giỏ hàng, thanh toán, blog, đặt thuốc theo toa, khung "Tư vấn dược sĩ" (chat
  2 chiều với admin, cần đăng nhập — mục 8).
- **Admin** (`/admin`): CRUD sản phẩm/danh mục/combo/bài viết, đơn hàng, người dùng, ảnh (Storage +
  hero trang chủ), trả lời tư vấn (`/admin/chat`).

Người dùng chính (chủ repo) giao tiếp bằng tiếng Việt — giữ commit message, comment code, và mục
log bên dưới bằng tiếng Việt cho nhất quán với phần còn lại của repo.

---

## 2. Công nghệ

| Lớp | Công nghệ |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| UI | Tailwind CSS v4 (một số component dùng inline style qua helper `s()`) |
| ORM / DB | Drizzle ORM → Postgres (Supabase) qua driver `postgres` |
| Xác thực | JWT (`jose`) + cookie phiên, mật khẩu băm bằng `bcryptjs` |
| Validate | Zod (schema dùng chung client ↔ server) |
| Lưu trữ ảnh | Supabase Storage (bucket `product-images`, public) |
| Tư vấn | Chat 2 chiều khách ↔ dược sĩ, lưu DB (`chat_messages`) + polling; Telegram chỉ báo tin mới. Không dùng AI |
| Bảo vệ server code | `server-only` (chặn import query/DB vào Client Component) |
| Icon | Phosphor Icons (CDN, 3 weight, nạp trong `app/layout.tsx`) + sprite `public/icons.svg` cho icon thương hiệu nhiều màu |
| Triển khai | Vercel |

**Kết nối DB:** `DATABASE_URL` (Supabase transaction pooler cổng 6543, `prepare:false`), role
`postgres` → **bypass RLS**. App **không** dùng `supabase-js` / Data API để đọc/ghi dữ liệu nghiệp
vụ (Storage thì có dùng service role, xem mục 6).

---

## 3. Kiến trúc — Feature-Based

Mỗi nghiệp vụ gom trọn logic vào `src/features/<module>/`. Trang trong `src/app/` chỉ **định
tuyến + khung giao diện** — gọi hàm từ feature rồi render, không viết SQL/JSX dài trực tiếp.

| File trong `features/<module>/` | Vai trò | Ràng buộc |
|---|---|---|
| `actions.ts` | Chỉ mutation (thêm/sửa/xóa) | Bắt đầu `'use server'`; validate Zod; gọi `requireAdmin()` nếu là thao tác admin |
| `queries.ts` | Chỉ đọc dữ liệu (server-side) | Bắt đầu `import 'server-only'`; **không** có `'use server'` |
| `schemas.ts` | Zod schema | Dùng chung client (bắt lỗi khi gõ) và server |
| `types.ts` | Kiểu TS công khai của feature | Re-export kiểu miền + kiểu suy ra từ schema |
| `components/` | UI riêng của feature | Client/Server Component |

Đã xác minh (2026-07-17): `requireAdmin()` **đã** được gọi trong `actions.ts` của products,
categories, users, combos, articles — không còn là action mở public như ghi nhận cũ.

`src/middleware.ts` **cố ý tắt auth** (chỉ làm redirect tĩnh từ `config/redirects.ts`) — bảo vệ
`/admin` và mutation dựa vào `requireAdmin()` gọi trong từng action/route, **không** dựa vào
middleware. Nếu định "bật lại" middleware, đọc kỹ trước — có thể là quyết định có chủ đích chứ
không phải việc dang dở.

---

## 4. Cấu trúc thư mục

```
src/
├── app/                # ROUTING — chỉ định tuyến & khung giao diện
│   ├── layout.tsx           # Root layout: gắn khung Tư vấn dược sĩ toàn cục + nạp Phosphor icons
│   ├── (landing)/page.tsx   # Trang chủ: đọc DB → truyền prop cho SPA storefront
│   ├── category/[categorySlug]/ · product/[slug]/
│   ├── cart/ · checkout/ · bai-viet/ · account/ · auth/
│   ├── admin/                # requireAdmin + AdminShell
│   │   └── products/ categories/ combos/ articles/ orders/ users/ images/ chat/
│   ├── api/                  # Route handlers: auth, cart, checkout, chat, admin/chat, upload ảnh…
│   └── sitemap.ts            # ⚠️ vẫn đọc `lib/catalog` TĨNH — xem mục 10
│
├── features/            # BUSINESS LOGIC — trái tim ứng dụng
│   ├── products/ categories/ combos/ articles/ orders/ users/   # actions+queries+schemas+types+components
│   ├── auth/             # components/ — cấu hình auth thật ở lib/auth.ts
│   ├── cart/ chat/ images/ siteImages/ dashboard/
│   └── storefront/       # SPA "Quầy thuốc 16"
│       ├── queries.ts        # dữ liệu trang chủ (sản phẩm/tin/combo/hero) — server-only
│       ├── data.ts           # type Product/News/... + dữ liệu tĩnh fallback
│       ├── use-storefront.ts # hub state/logic của toàn SPA (client)
│       └── components/       # QuayThuoc16 (root), screens/, cards, header/footer
│
├── components/           # GLOBAL UI dùng chung
│   ├── ui/                   # Logo (ảnh cứng public/logo_brand.svg), AnimateIn, MarkdownContent, PaginationControls, QuantitySelector
│   └── layout/                # SiteHeader, SiteFooter, AdminShell, AdminLogoutButton (đều gắn chuông tư vấn)
│
├── lib/                   # CONFIG & SHARED
│   ├── db.ts auth.ts schemas.ts constants.ts catalog.ts productImages.ts prescription.ts password.ts supabaseStorage.ts promos.ts provinces.ts
├── config/                # redirects.ts, site.ts (SITE_URL…)
├── utils/                 # format.ts (formatPrice VND), dates.ts (formatDate vi-VN)
├── db/                    # schema.ts (nguồn sự thật cấu trúc bảng), seed*.ts, bootstrap*.ts
└── middleware.ts          # chỉ redirect tĩnh (auth tắt cố ý — xem mục 3)

drizzle/                  # Migration SQL — manual-*.sql PHẢI chạy tay trên Supabase SQL Editor
public/                   # logo_brand.svg, favicon.svg, icons.svg (sprite), demo-products/
```

---

## 5. Nguồn dữ liệu trang chủ (storefront SPA)

Trang chủ là **SPA state-machine trong 1 route** (`QuayThuoc16`). `(landing)/page.tsx` đọc DB rồi
truyền prop; `use-storefront.ts` fallback dữ liệu tĩnh (`data.ts`) khi prop rỗng.

| Dữ liệu | Query (`features/storefront/queries.ts`) | Ghi chú |
|---|---|---|
| Sản phẩm | `getStorefrontProducts()` | Lọc `is_active` (sản phẩm lẫn danh mục). `id = slug`. Có `shopeeUrl`/`tiktokUrl` (mục 10). |
| Tin tức | `getStorefrontNews()` | Bài viết `published`. |
| Combo | `getStorefrontCombos()` | Từ bảng `combos`/`combo_items`; trống → ẩn section (không còn demo giả). |
| Ảnh hero | `getStorefrontHeroImages()` | Bảng `hero_images`, sắp `sort_order`. |

- Cache: `revalidate=60`; action admin gọi `updateTag(STOREFRONT_CACHE_TAG)` để cập nhật ngay.
- Danh mục & chi tiết sản phẩm (route riêng, không phải SPA): `features/products/queries.ts`
  (lọc `is_active`).
- Trang chủ **vẽ placeholder CSS** cho ảnh (không load `<img>`); trang danh mục/chi tiết dùng
  `next/image` thật.

---

## 6. Cơ sở dữ liệu

Bảng chính (nguồn sự thật: `src/db/schema.ts`):

- `users`, `user_addresses` — role customer/admin/pharmacist. Đăng ký/đăng nhập bằng **email HOẶC
  số điện thoại** (`email`/`phone` nullable + unique, CHECK ≥1 trong hai —
  `drizzle/manual-0004-user-email-or-phone.sql`).
- `categories` — slug PK, `is_active` để ẩn khỏi storefront.
- `products` — `prescription_required` **nullable 3 trạng thái**: `null`=chưa phân loại ·
  `false`=không kê đơn · `true`=kê đơn. Có cột link sàn khác (mục 10).
- `product_reviews`, `articles` (có `source_url` nullable — link bài gốc khi tạo tự động qua
  đồng bộ RSS, dùng để chống trùng, `manual-0008-articles-source-url.sql`), `carts`/`cart_items`,
  `orders`/`order_items`, `wishlists`.
- `combos` + `combo_items` — thành viên tham chiếu `products.slug`.
- `hero_images` — banner hero trang chủ (carousel nếu ≥2 ảnh).
- `site_images` — ảnh CTA admin đặt (KHÔNG còn slot logo — logo là ảnh cứng, mục 7).
- `chat_messages` — tư vấn 2 chiều (mục 8). Cột: `user_id`, `sender('user'|'admin')`,
  `sender_name`, `content`, `read_by_admin`, `read_by_user`, `created_at`. 1 user = 1 hội thoại.
  Migration `manual-0005-chat-messages.sql` + `manual-0006-chat-sender-name.sql`.

### RLS
RLS **bật trên toàn bộ bảng, KHÔNG có policy** → chặn REST Data API công khai (anon key) đọc/ghi.
App vẫn chạy vì dùng role `postgres` trực tiếp (mục 2). **Mọi bảng mới phải
`ENABLE ROW LEVEL SECURITY` (no policy)** trong migration. Đừng tắt RLS để "sửa nhanh" — nếu về
sau có ai thêm `supabase-js` (anon/authenticated key) thì query sẽ trả rỗng cho tới khi viết policy,
đó là hành vi **đúng và cố ý**, không phải bug.

### Quy ước migration
Sửa `src/db/schema.ts` **và** tạo `drizzle/manual-XXXX-mô-tả.sql` để chạy tay trên Supabase SQL
Editor (kèm `ENABLE ROW LEVEL SECURITY`). `npm run db:push` chỉ đồng bộ schema Drizzle — các file
`manual-*.sql` **không** tự chạy, phải copy vào SQL Editor thủ công (xem mục 10 nếu quên chạy).

### Đồng bộ tin tức (RSS) — `/admin/articles`
Nút "Đồng bộ tin tức (RSS)" (`syncNewsFromRssAction` trong `features/articles/actions.ts`) fetch
danh sách feed ở `src/lib/rss.ts` (`HEALTH_RSS_FEEDS` — sửa/thêm nguồn tại đây), tạo bài viết
**luôn ở trạng thái `draft`** (không bao giờ tự đăng — nội dung chỉ là tóm tắt RSS + link nguồn,
đăng nguyên văn là vi phạm bản quyền, admin phải tự viết lại). Chống trùng bằng `articles.source_url`
(`getArticleBySourceUrl`). Chỉ là nút bấm thủ công, **chưa có cron** tự động định kỳ.

---

## 7. Ảnh & Storage

- Ảnh sản phẩm/hero upload lên bucket `product-images` qua `lib/supabaseStorage.ts` (cần
  `SUPABASE_SERVICE_ROLE_KEY`). Prefix: sản phẩm `uploads/{key}/`, hero `hero/`.
- `/admin/images` liệt kê Storage + dung lượng, quản lý ảnh hero/CTA (tab "Ảnh hero" gồm
  HeroManager + AppearanceManager nhúng).
- **Logo** là ảnh cứng `public/logo_brand.svg` (`components/ui/Logo.tsx`) — dùng ở header, footer,
  checkout; **không** đổi qua admin (đã gỡ slot logo khỏi AppearanceManager).
- **Favicon** (icon tab trình duyệt): `src/app/favicon.ico` (copy từ `public/logo_brand_icon.ico`,
  2026-07-17 (8)) — dùng **file convention** của Next App Router, tự sinh `<link rel="icon">`,
  KHÔNG khai báo trong `metadata.icons` của `layout.tsx`. Muốn đổi favicon → thay chính file
  `src/app/favicon.ico` (trình duyệt cache favicon rất dai, phải Ctrl+F5 / xoá cache mới thấy đổi).
  `public/favicon.svg` cũ **không được tham chiếu ở đâu** (favicon.ico convention thắng).
- Icon giao diện: Phosphor Icons (CDN). Icon thương hiệu nhiều màu: sprite `public/icons.svg`
  (`<use href="/icons.svg#id" />`). Có 2 file rời `public/icons8-shopee.svg` /
  `icons8-tiktok.svg` **chưa dùng ở đâu trong src** — xem mục 10.

> **AI đọc ảnh sản phẩm tự điền form (vision-fill / OpenRouter) đã BỊ GỠ HẲN (2026-07-18 (4))** —
> theo yêu cầu không phụ thuộc OpenRouter. Không còn `ProductVisionFill.tsx`, `lib/openrouter.ts`,
> route `/api/admin/products/vision-fill`, biến `OPENROUTER_*`. Nếu thấy tài liệu/code cũ nhắc nút
> "📷 Chụp ảnh & tự động điền" → đã lỗi thời.

---

## 8. Tư vấn dược sĩ (chat 2 chiều + thông báo)

Nút bác sĩ 🩺 nổi góc phải (`features/chat/components/DrugChatbot.tsx`, gắn toàn cục trong
`app/layout.tsx`) — chat 2 chiều lưu DB, **không dùng AI**:

- Bắt buộc đăng nhập mới gửi được. Tên người gửi lấy từ tài khoản (server, không tin client).
- Khách gửi → lưu `chat_messages` (sender=`user`); có `TELEGRAM_*` thì báo Telegram cho dược sĩ.
- Admin trả lời tại `/admin/chat` (`ChatInbox.tsx`): cột trái danh sách hội thoại + badge chưa đọc,
  cột phải khung trả lời. Tin lưu sender=`admin`.
- **Xóa hội thoại**: nút "Xóa hội thoại" ở header khung chat đang mở (xác nhận 2 bước, tự thu lại
  sau 4s) → `DELETE /api/admin/chat/[userId]` → `deleteConversation()` (`features/chat/queries.ts`)
  xóa **toàn bộ** tin nhắn của user đó, **không thể hoàn tác** (dọn bớt dữ liệu cũ, tiết kiệm bộ
  nhớ DB). Không phải soft-delete.
- Cập nhật bằng **polling** (không websocket): khách 5s, admin thread 4s, danh sách hội thoại 8s.
- Chuông thông báo (mở bảng thông báo, không mở thẳng chat):
  - Khách: `ChatNotifyBell` trong `SiteHeader`/`HomeHeader` (chỉ khi đã đăng nhập), poll 15s. Bấm
    dòng → phát event `qt:open-consult` để mở khung chat.
  - Admin: `AdminChatBell` trong `AdminShell`, poll 10s. Bấm dòng → `/admin/chat?u=<userId>`.
- **Đặt thuốc theo toa** (`RxModal.tsx`, mở qua `openRx()` trong `use-storefront.ts`, hoặc URL
  `/?rx=1`) **cũng đi qua pipeline chat này** — không phải luồng/bảng riêng. Bắt buộc đăng nhập
  (cùng pattern 3 trạng thái `undefined`/`null`/object như `DrugChatbot`, check `/api/auth/me` khi
  modal mở, nghe `qt:auth-changed`). Gửi → `POST /api/prescriptions` (upload ảnh lên Storage prefix
  `prescriptions/{userId}/` qua `uploadPrescriptionImage()` trong `lib/supabaseStorage.ts`, dựng
  `content` = tiêu đề + SĐT + URL ảnh) → `addChatMessage()` y hệt tin chat thường (sender=`user`)
  → hiện trong `/admin/chat` như 1 tin nhắn bình thường, không có UI xem toa riêng. Rate limit
  riêng (6/phút, thấp hơn chat chữ vì tốn tài nguyên upload hơn).
- `notifyTelegramChat()` (`features/chat/telegram.ts`) và `createRateLimiter()`/`getClientIp()`
  (`lib/rateLimit.ts`) dùng chung giữa `/api/chat` và `/api/prescriptions` — sửa 1 nơi áp dụng cả
  hai.

### Route API

| Route | Vai trò |
|---|---|
| `POST /api/chat` | Khách gửi tin (auth) → lưu DB + báo Telegram |
| `GET /api/chat?after=` | Khách lấy tin (polling) + đánh dấu tin dược sĩ đã đọc |
| `GET /api/chat/notifications` | Số tin chưa đọc + tin dược sĩ trả lời (chuông khách) |
| `GET /api/admin/chat` | Danh sách hội thoại (admin) |
| `GET /api/admin/chat/[userId]` | Xem thread + đánh dấu đã đọc (admin) |
| `POST /api/admin/chat/[userId]` | Dược sĩ trả lời |
| `GET /api/admin/chat/unread` | Tổng tin khách chưa đọc (chuông admin) |

Đọc/ghi gom trong `features/chat/queries.ts` (server-only). Cần `TELEGRAM_BOT_TOKEN`/
`TELEGRAM_CHAT_ID` để có thông báo (thiếu vẫn chạy, chỉ mất thông báo).

---

## 9. Cài đặt, scripts, biến môi trường, kiểm thử

```bash
npm install
cp .env.example .env     # điền biến môi trường bên dưới
npm run dev               # http://localhost:3000
```

| Lệnh | Tác dụng |
|---|---|
| `npm run dev` | Dev server (webpack) |
| `npm run dev:turbo` | Dev server (turbopack) |
| `npm run build` / `npm start` | Build & chạy production |
| `npm run lint` | ESLint |
| `npm run db:push` | Đồng bộ `src/db/schema.ts` lên DB (KHÔNG chạy `manual-*.sql`, xem mục 6) |
| `npm run db:studio` | Drizzle Studio |
| `npm run db:seed` / `db:bootstrap` | Seed dữ liệu mẫu / khởi tạo |
| `npm run admin:create` | Tạo tài khoản admin (từ `ADMIN_*`) |
| `npm run storage:sync` | Đồng bộ ảnh sản phẩm lên Storage |

**Biến môi trường chính** (xem `.env.example` đầy đủ):
- Database: `DATABASE_URL`, `POSTGRES_URL*`, `POSTGRES_HOST/USER/PASSWORD/DATABASE`
- Supabase Storage: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Auth**: `JWT_SECRET` (ưu tiên) hoặc `SUPABASE_JWT_SECRET` (fallback, biến tích hợp
  Supabase↔Vercel tự thêm) — `lib/auth.ts` đọc `JWT_SECRET ?? SUPABASE_JWT_SECRET`. **Thiếu cả
  hai ở production → throw ngay khi ký/verify JWT** (dev local có fallback riêng, không throw).
  Đổi secret = mọi phiên đăng nhập cũ bị vô hiệu.
- Tư vấn Telegram: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`
- Admin bootstrap: `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`
- ~~AI đọc ảnh sản phẩm: `OPENROUTER_*`~~ **ĐÃ GỠ (2026-07-18 (4))** — không còn dùng OpenRouter.

> ⚠️ Không commit `.env`. Đảm bảo set đủ biến bí mật (đặc biệt `JWT_SECRET`) trên Vercel trước
> deploy.

**Trước khi coi một thay đổi là "xong":**
```bash
npx tsc --noEmit    # kiểm tra kiểu
npm run lint        # ESLint
npm run build       # xác thực ranh giới server-only/client + build production thật
```
Responsive: breakpoint `@media (max-width: 768px)` trong `src/app/globals.css` (menu gọn, hero
xếp dọc, lưới 2 cột, bộ lọc dạng drawer di động); desktop dùng layout đầy đủ.

---

## 10. Nợ kỹ thuật & việc còn dang dở (cập nhật khi phát hiện/giải quyết)

- ~~**`sitemap.ts` đọc `lib/catalog` TĨNH**~~ **ĐÃ SỬA (2026-07-17 (9))**: `src/app/sitemap.ts`
  giờ `async`, đọc DB qua `getStorefrontProducts()` + `getCategoryNavItems()` (lọc `is_active`) +
  `listPublishedArticles()` (bài viết trước đây thiếu hẳn khỏi sitemap, nay đã có). Không còn nợ.
- ~~**2 file ảnh rời chưa dùng**: `public/icons8-shopee.svg`, `public/icons8-tiktok.svg`~~ **ĐÃ
  DÙNG (2026-07-17)**: mục "Cũng có bán trên" ở cả `ProductScreen.tsx` (SPA storefront) và
  `ProductDetailHero.tsx` (route chi tiết) giờ render 2 file này qua `<img>` (badge tròn nền trắng,
  viền mảnh) thay cho icon Phosphor generic `ph-shopping-bag-open`/`ph-music-notes`. Không còn nợ.
- **Middleware auth tắt cố ý** (`src/middleware.ts`) — bảo vệ dựa vào `requireAdmin()` per-action.
  Nếu có ai đề xuất "bật lại middleware", xác nhận đây không phải việc dang dở bị bỏ quên trước
  khi động vào.
- **JWT_SECRET bắt buộc ở production** (từ 2026-07-12) — kiểm tra đã set trên Vercel trước mỗi
  lần deploy có thay đổi liên quan auth.
- **RSS sync là nút bấm thủ công** (`/admin/articles`), chưa có cron tự động định kỳ — nếu muốn
  tự động hoá cần thêm Vercel Cron hoặc tương tự (chưa làm).
- ~~**Tính năng AI đọc ảnh sản phẩm (vision-fill)**~~ **ĐÃ GỠ HẲN (2026-07-18 (4))** — không còn
  nợ; toàn bộ code + biến `OPENROUTER_*` đã xóa (xem entry (4)).
- **Đã test thật "Đồng bộ tin tức (RSS)" qua trình duyệt (2026-07-17, xem log dev server)**: bấm
  1 lần đầu tiên tạo **110 bài nháp** (= 60 VnExpress + 50 Sức khỏe & Đời sống, đúng vì DB chưa có
  bài nào trước đó nên không có gì bị dedup). **110 bài nháp này đang nằm thật trong DB** —
  vào `/admin/articles` để duyệt/xóa bớt/viết lại. Lần bấm tiếp theo sẽ dedup đúng theo
  `source_url`, chỉ thêm bài thật sự mới.
- `drizzle/manual-0008-articles-source-url.sql` **đã được chạy** trên Supabase (suy ra từ việc
  insert 110 bài kèm `source_url` thành công, không lỗi thiếu cột) — tick xong, không còn là nợ.
- **`RxModal.tsx` ("Đặt thuốc theo toa") trước 2026-07-17 (3) chỉ là UI mockup** — form thu ảnh +
  SĐT nhưng `submitRx()` cũ không gửi đi đâu cả, chỉ đóng modal. Đã nối vào backend thật (xem mục
  8) — nếu thấy code cũ/tài liệu cũ nào nhắc "đặt thuốc theo toa" mà không match mô tả ở mục 8,
  đó là thông tin lỗi thời, tin theo mục 8.
- **Chữ ký lỗi cache/worker dev hỏng**: nếu 1 route trả 500 với `Error: Jest worker encountered N
  child process exceptions, exceeding retry limit` (stack chỉ nằm trong `jest-worker/index.js` →
  `ChildProcessWorker._onExit`, KHÔNG có frame code app), hoặc route đó recompile bị treo — đó là
  **worker render dev crash do `.next` hỏng**, KHÔNG phải bug code. Cách phân biệt nhanh: route khác
  tương tự (vd `/admin/products/new`) vẫn 200, code `tsc`/`lint` sạch, dữ liệu route đó hợp lệ. Khắc
  phục: kill hết `next dev` (+`start-server.js`) của project → xóa `.next` → `npm run dev` lại. Đã
  gặp & xử lý đúng cách này cho `/admin/products/[id]/edit` (2026-07-17 (7)).
- **Bài học vận hành (đừng lặp lại)**: KHÔNG chạy `npm run build` trong lúc có `npm run dev` khác
  (kể cả của user, không phải mình khởi động) đang chạy trên cùng thư mục — cả hai dùng chung
  `.next/` và build sẽ làm treo cứng dev server đang chạy (không phải lỗi "Manifest file is empty"
  nhẹ như trước, mà treo hẳn, phải kill + xóa `.next` + khởi động lại mới hết). Trước khi chạy
  `npm run build` để verify, luôn kiểm tra có tiến trình `next dev` nào đang chạy không
  (`Get-CimInstance Win32_Process -Filter "Name='node.exe'"` trong PowerShell) — nếu có, cân nhắc
  hỏi user trước hoặc chỉ dùng `npx tsc --noEmit` + `npm run lint` để verify thay vì build đầy đủ.

---

## 11. Nhật ký phiên làm việc

> Entry mới nhất **trên cùng**. Mỗi entry: ngày, việc đã làm, trạng thái (xong/dang dở/đã revert),
> việc tiếp theo nếu có. Lịch sử commit đầy đủ xem `git log --oneline`.

### 2026-07-18 (5) — Sửa soft-404 (bỏ loading.tsx) + rate limit login/register
- **Soft-404 (đã sửa)**: `/product|/category|/bai-viet` với slug sai giờ trả **HTTP 404 thật**
  (trước trả 200 → hại SEO). **Root cause tìm được qua reproduce local** (`npm run build && next start`,
  KHÔNG đoán): `loading.tsx` ở segment tạo Suspense boundary → Next **flush shell 200 sớm** rồi mới
  stream, nên `notFound()` (chạy trong lúc stream) không đổi được status. Thử `notFound()` trong
  `generateMetadata` KHÔNG cứu được vì Next 16 **stream metadata** (kể cả cho Googlebot UA — đã test).
  ⇒ **Fix = BỎ `loading.tsx`** của các route dùng `notFound()`:
  - Đã xóa: `product/[slug]/loading.tsx`, `category/[categorySlug]/loading.tsx`,
    `bai-viet/[slug]/loading.tsx`, **và `bai-viet/loading.tsx`** (segment CHA cascade Suspense
    xuống `[slug]`, nên phải xóa cả nó — chỉ xóa loading con là chưa đủ, `[slug]` vẫn 200).
  - **⚠️ ĐỪNG THÊM LẠI `loading.tsx` cho 3 route chi tiết này** — sẽ tái diễn soft-404. Đánh đổi:
    mất skeleton khi điều hướng client-side (bù lại render <0.5s nhờ sin1; SSR lần đầu vốn không có
    skeleton). Nếu muốn skeleton lại, phải giải quyết vụ status trước (vd tách notFound ra tầng
    không stream) chứ không phải thêm loading.tsx.
  - **Bonus fix `category` 500**: `listProducts` parse `category` bằng Zod enum → slug lạ THROW
    ZodError (500) trước khi `if (!result) notFound()` bắt. Đã thêm guard `getCategoryBySlug()` →
    `notFound()` **trước** `listProducts` trong `category/[categorySlug]/page.tsx`.
  - `generateMetadata` của 3 trang cũng đổi `return {title:'Không tìm thấy…'}` → `notFound()`
    (phòng thủ tầng metadata, tuy không tự đủ). Đã verify: slug sai→404, slug đúng→200 cả 3 (local).
- **Rate limit auth (mới)**: tái dùng `createRateLimiter`/`getClientIp` (`lib/rateLimit.ts`) —
  `/api/auth/login` **10 lần/phút/IP** (chống brute-force), `/api/auth/register` **5 lần/phút/IP**
  (chống tạo tài khoản hàng loạt) → trả **429** khi vượt. Verify local: login 10×401 rồi 429,
  register 5×400 rồi 429. Best-effort in-memory per-instance (không tuyệt đối multi-instance, đủ
  chặn spam thô); nếu cần chặt hơn dùng Vercel WAF.
- **Verify**: `npx tsc --noEmit` (build) + `npm run lint` sạch; reproduce đầy đủ bằng `next start`
  local (DB Supabase). Chưa test lại trên production tại thời điểm ghi (deploy ngay sau).

### 2026-07-18 (4) — Deploy tính năng phiên 17/07 + gỡ hẳn vision-fill + review Notion
- **Deploy các tính năng chưa commit** (commit `175f9ac`, push `main` → Vercel auto-deploy): RSS
  sync, đặt thuốc theo toa (`/api/prescriptions`), xóa hội thoại tư vấn, nút xóa bài viết, logo
  Shopee/TikTok, favicon, module chung `telegram.ts`/`rateLimit.ts`/`rss.ts`, `manual-0008` sql,
  `docker-compose.yml`, `docs/test-plan.md`. Live giờ đã có đủ (trước chỉ có tới commit SEO).
- **GỠ HẲN tính năng AI đọc ảnh tự điền SP (vision-fill/OpenRouter)** theo yêu cầu user (không muốn
  phụ thuộc OpenRouter): xóa `lib/openrouter.ts`, `ProductVisionFill.tsx`, route
  `/api/admin/products/vision-fill` (cả thư mục), biến `OPENROUTER_*` trong `.env`+`.env.example`,
  bỏ import + `<ProductVisionFill/>` khỏi `admin/products/new` + `[id]/edit`. Xác nhận live:
  `/api/admin/products/vision-fill` → **404**. Mục 7/9/10 đã cập nhật.
- **Verify**: `npx tsc --noEmit` (sau khi xóa `.next` để bỏ type cache cũ) + `npm run lint` +
  `npm run build` sạch. Smoke-test live sau deploy: trang chủ/SP/bài/giỏ **200**, `/api/prescriptions`
  POST không auth **401**, `/admin/articles` chưa login **307**, favicon **200**, region vẫn **sin1**.
- **Bug xác nhận trên production**: **soft-404** — `/product|/category|/bai-viet` với slug sai trả
  **HTTP 200** thay vì 404 (trước chỉ nghi ở dev, nay chắc chắn còn trên prod). Chưa sửa — đã cập
  nhật vào Notion.
- **Review Notion "Web nhà thuốc development"** (Projects DB): tick 4 mục go-live đã xong
  (DATABASE_URL→Supabase, regions sin1, commit favicon, quyết bỏ dữ liệu local) + đánh dấu 2 mục
  vision-fill VÔ HIỆU. **Việc còn tồn (chưa xử lý)** — xem mục kế tiếp trong báo cáo/Notion: soft-404;
  rate limit login/register/checkout (đề xuất Vercel WAF); thu hồi quyền tức thì (requireAdmin đối
  chiếu DB); cookie cart thiếu `secure`; validate UUID order status; `next@latest` (CVE); self-host
  Phosphor Icons; ISR product/category; OG images; `NEXT_PUBLIC_SITE_URL`=domain thật; Pharmacy
  schema + NAP thật (chờ địa chỉ/SĐT thật); RSS cron; middleware→proxy (Next 16 deprecation).

### 2026-07-18 (3) — Fix perf Vercel: ép function region sin1 (Singapore) + deploy + test live
- **Nguyên nhân gốc xác nhận từ header live** (`X-Vercel-Id: hkg1::iad1::…` + `Cache-Control:
  no-store`): function chạy **iad1 (US East)** trong khi Supabase ở **ap-southeast-1 (Singapore)**
  → mỗi query DB vượt Thái Bình Dương. Data Cache (`unstable_cache revalidate:60`) đã có sẵn nên
  không phải thêm; vấn đề thuần là **region function**.
- **Fix**: thêm `vercel.json` `{"regions":["sin1"]}`. **Commit CHỈ `vercel.json`** (`75011c9`) rồi
  push `main` → Vercel auto-deploy. Cố ý KHÔNG đẩy ~30 file tính năng chưa commit của các phiên
  2026-07-17 (RSS, vision-fill, đặt thuốc theo toa, xóa hội thoại, favicon…) — chúng vẫn nằm local
  chưa lên GitHub/live. **Live hiện = commit SEO `b27dfcf` + `vercel.json`**, KHÔNG có các tính năng đó.
- **Kết quả đo thật** (`nhathuoctay-vk8d.vercel.app`): trước = cold ~2.9s / warm ~0.75s;
  sau khi lên sin1 = **TTFB 0.33–0.64s** (mọi route chính 0.3–0.9s). Xác nhận `X-Vercel-Id` giờ là
  `hkg1::sin1::…`.
- **Đã test live các tính năng chính** (HTTP + WebFetch nội dung, KHÔNG có Chrome DevTools MCP —
  đúng như ghi chú cũ "Chrome extension không kết nối"): trang chủ / danh mục / **chi tiết SP (render
  đúng tên + giá 210k + nút Chọn mua + review)** / danh sách + **chi tiết bài viết (đủ thân bài)** /
  giỏ hàng / thanh toán / `/auth/login` + `/auth/register` đều **200**; `/admin` chưa đăng nhập →
  **307 về `/`** (requireAdmin chặn đúng); `GET /api/chat` + `/api/auth/me` chưa đăng nhập → **401**;
  `sitemap.xml` + `robots.txt` **200**. Đã mở URL trong trình duyệt thật của user.
- **VIỆC CÒN TỒN (quan trọng)**: (1) ~30 file tính năng phiên trước vẫn **chưa deploy** — user cần
  quyết review + push riêng khi sẵn sàng (một số cần env production: `OPENROUTER_API_KEY` thật cho
  vision-fill; migration `manual-0008` đã chạy trên Supabase nên RSS an toàn). (2) Chưa test luồng
  **add-to-cart/checkout/đăng nhập thật** qua trình duyệt (cần session) — user tự xác nhận trên tab
  vừa mở. (3) `Cache-Control: no-store` vẫn còn (trang đọc searchParams) — region fix đã đủ nhanh nên
  chưa cần đụng ISR/cache HTML; cân nhắc sau nếu muốn tối ưu thêm.

### 2026-07-18 (2) — Gỡ Postgres local Docker, trả DB về Supabase để deploy Vercel
- **Lý do**: kết thúc giai đoạn dev với DB local, chuẩn bị deploy lại lên Vercel + Supabase.
- **Đã làm**: `docker compose down -v` (xóa container `nhathuoctay-pg` + network + **volume
  `nhathuoctay_nhathuoctay_pgdata`**) và `docker rmi postgres:17`. User đã xác nhận **coi mọi
  thay đổi ghi ở DB local là bỏ** — Supabase (bản dump lúc 2026-07-18 (1)) là nguồn thật. Các
  volume `authentik_*` của stack khác không đụng tới.
- **`.env` ĐÃ ĐỔI LẠI**: `DATABASE_URL` giờ trỏ **Supabase transaction pooler** (cổng 6543) cho cả
  local dev lẫn production. Dòng local `localhost:5433` được comment lại làm tuỳ chọn dev offline
  (bật lại `docker compose up -d` + đổi DATABASE_URL nếu cần). ⇒ Cảnh báo "biến kết nối mục 2/6
  không còn đúng" của entry (1) **nay đã hết** — app đọc Supabase như mô tả gốc ở mục 2/6.
- **Verify**: query thật qua driver `postgres` (prepare:false) tới pooler → OK, đếm đúng
  **81 SP · 4 danh mục · 107 bài**. Không còn tiến trình `next dev` nào chạy (đã kiểm bằng
  Get-CimInstance). `docker-compose.yml` giữ lại làm tài liệu tuỳ chọn dev offline.
- **Trước khi deploy Vercel** (nhắc lại, chưa làm trong phiên này): đảm bảo set đủ env trên Vercel
  — đặc biệt `DATABASE_URL` (pooler 6543), `JWT_SECRET`/`SUPABASE_JWT_SECRET`, `SUPABASE_SERVICE_
  ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_URL`. Vấn đề gốc khiến phải chuyển local (function iad1 ↔
  Supabase Singapore gây cold-start 504 + không cache HTML) **vẫn còn nguyên** — nếu deploy lại mà
  chưa xử lý region/cache thì hiện tượng chậm/504 sẽ tái diễn. Checklist ở Notion "Web nhà thuốc
  development".

### 2026-07-18 (1) — DB local qua Docker (tạm thay Supabase khi phát triển)
- **Lý do**: web deploy trên Vercel load chậm/lỗi. Chẩn đoán (đo thật trên
  `nhathuoctay-vk8d.vercel.app`): request cold **TTFB 301s → HTTP 504 Gateway Timeout**; warm
  TTFB 0.7–3s. Nguyên nhân: (1) function Vercel ở **iad1 (US East)** trong khi Supabase ở
  **ap-southeast-1 (Singapore)** → mỗi query vượt Thái Bình Dương; (2) **không cache HTML** (mọi
  trang `no-store`, `force-dynamic` + landing đọc searchParams) → mọi request boot function; (3)
  3 CSS Phosphor render-blocking từ unpkg. User quyết định: **tạm dựng Postgres local**, ổn định
  rồi deploy lại.
- **Đã làm**: thêm `docker-compose.yml` (postgres:17, cổng host **5433**, volume
  `nhathuoctay_pgdata`). Dump `public` schema từ Supabase (`pg_dump --no-owner --no-privileges
  --schema=public`, 15 bảng, 297KB) → restore vào local (chỉ lỗi vô hại "schema public already
  exists"). Verify dữ liệu về đủ: **81 SP · 4 danh mục · 107 bài viết · 4 users · 4 đơn · 11 chat**.
- **`.env` ĐÃ ĐỔI**: `DATABASE_URL` giờ trỏ `postgres://postgres:postgres@localhost:5433/postgres`
  (dòng Supabase pooler được comment ngay dưới để bật lại khi deploy). ⚠️ **Các biến kết nối ở
  mục 2/6 nói "Supabase pooler" giờ KHÔNG còn đúng với runtime local** — app đang đọc DB local.
  **Storage ảnh vẫn dùng Supabase** (NEXT_PUBLIC_SUPABASE_URL + SERVICE_ROLE_KEY không đổi) — upload
  ảnh khi dev vẫn ghi lên Supabase Storage thật.
- **Cảnh báo quan trọng cho phiên sau**: DB local giờ là 1 nhánh riêng. Dữ liệu ghi khi dev
  (sản phẩm/bài/chat mới) **chỉ nằm ở local**, KHÔNG tự đồng bộ về Supabase. Trước khi go-live phải
  quyết: sync local→Supabase hay coi thay đổi local là tạm bỏ. Checklist go-live đã ghi ở Notion
  (page "Web nhà thuốc development").
- Dev server đang chạy nền ở localhost:3000 (đã nối DB local). Bật DB: `docker compose up -d`.

### 2026-07-17 (9) — Sửa SEO C1–C3 (từ audit code-level qua /seo)
- Chạy audit SEO mức source (chưa có domain live). Phát hiện 3 lỗi chặn + nhiều mục High/Medium
  (chi tiết trong hội thoại). Đã sửa 3 lỗi Critical:
- **C1 — `SITE_URL` placeholder `https://domain.com`** (`src/config/site.ts`): đổi sang
  `resolveSiteUrl()` với thứ tự ưu tiên `NEXT_PUBLIC_SITE_URL` → `VERCEL_PROJECT_PRODUCTION_URL`
  (Vercel tự cấp, làm lưới an toàn) → `http://localhost:3000` (dev). Không còn nguy cơ canonical/
  OG/sitemap trỏ về `domain.com` nếu quên set env. **Vẫn nên set `NEXT_PUBLIC_SITE_URL` = domain
  riêng trên Vercel** để dùng đúng custom domain thay vì URL `*.vercel.app`.
- **C2 — trang chi tiết sản phẩm không có metadata** (`src/app/product/[slug]/page.tsx`): thêm
  `generateMetadata` (title=tên SP, description từ shortDescription/benefit/description,
  `alternates.canonical`, OG kèm ảnh đầu tiên) — theo đúng pattern trang bài viết đã có. Trước đó
  mọi trang sản phẩm dùng chung title mặc định, vô hình với search.
- **C3 — sitemap tĩnh** (`src/app/sitemap.ts`): xem mục 10, đã đọc DB. Bài viết nay có trong sitemap.
- **H1 — trang danh mục không có metadata + faceted nav sinh URL trùng** (`src/app/category/
  [categorySlug]/page.tsx`): thêm `generateMetadata` (title/description theo danh mục) +
  **canonical GOM `?subCategory/priceRange/sort` về URL sạch, chỉ giữ `?page`** → chặn index bloat
  từ bộ lọc/sắp xếp. Trang phân trang >1 có title "… — Trang N" + canonical tự trỏ.
- **H3 — robots cho crawl mọi thứ** (`src/app/robots.ts`): thêm `disallow` `/admin`, `/account`,
  `/checkout`, `/cart`, `/auth`, `/api` (không phải lớp bảo mật — chỉ tiết kiệm crawl budget +
  tránh index trang riêng tư).
- **H2 — JSON-LD structured data (phần không cần NAP)**: component tái dùng
  `src/components/ui/JsonLd.tsx` (+`toAbsoluteUrl`); `Organization`+`WebSite` toàn cục trong
  `layout.tsx`; `Product`+`Offer`+`AggregateRating`(chỉ khi `reviewCount>0`)+`BreadcrumbList` ở
  trang sản phẩm; `Article`+`BreadcrumbList` ở trang bài viết. **TẠM chưa làm `Pharmacy`/
  LocalBusiness** (bắt buộc địa chỉ thật) + chưa thêm telephone/email vào schema — user sẽ bổ sung
  NAP sau. Đã note toàn bộ việc còn tồn đọng (gồm cả nợ mục 10: next CVE, vision-fill rate limit,
  RSS cron) vào **Notion → page "Web nhà thuốc development"** (Projects DB).
- Verify: `npx tsc --noEmit` + `npm run lint` sạch (KHÔNG chạy `build` — bài học mục 10). **Chưa
  xem tận mắt sitemap.xml/metadata/robots.txt/JSON-LD qua trình duyệt** — cần deploy hoặc dev có DB.
  Còn lại (Pharmacy schema, OG images, self-host icons, ISR sản phẩm) → xem Notion.

### 2026-07-17 (8) — Đặt favicon (icon tab trình duyệt) từ logo_brand_icon.ico
- Trước đó **không có favicon nào được cấu hình**: `layout.tsx` không có `metadata.icons`, `src/app/`
  không có file `favicon.ico`/`icon.*` → trình duyệt hiện icon mặc định (user báo "chưa thấy đổi").
- Copy `public/logo_brand_icon.ico` → `src/app/favicon.ico` (Next App Router file convention, tự
  sinh `<link rel="icon">`). Verify trên dev: `GET /favicon.ico` → 200 `image/x-icon`; head trang
  chủ có `<link rel="icon" href="/favicon.ico?...">`. Ghi chi tiết ở mục 7.
- Lưu ý cho user: favicon bị trình duyệt cache rất dai — phải Ctrl+F5 / xoá cache mới thấy đổi.

### 2026-07-17 (7) — Chẩn đoán lỗi "Jest worker" ở trang sửa sản phẩm (cache dev hỏng)
- Triệu chứng user báo: vào `/admin/products/[id]/edit` → 500 `Jest worker encountered 2 child
  process exceptions, exceeding retry limit`.
- Đã chẩn đoán (không đoán mò): đăng nhập admin thật qua `curl`, tái hiện 500 trên **2 id khác
  nhau**; `/admin/products/new` (dùng chung phần lớn component) vẫn **200**; query DB xác nhận cả 2
  sản phẩm có `category_slug` hợp lệ (thuộc 4 key chuẩn) + `images` đúng schema → **loại** giả
  thuyết crash ở `normalizeProductImages`. Stack chỉ nằm trong `jest-worker` (crash tầng process),
  ép recompile thì treo. ⇒ Kết luận: **`.next`/worker dev hỏng**, không phải bug code.
- Khắc phục: kill `next dev` + `start-server.js` của project (giữ máy user không còn tiến trình
  next nào), xóa `.next`, `npm run dev` lại. Sau restart: cả 2 route edit **200**, HTML có đúng
  "Sửa sản phẩm" + "Link Shopee". Đã ghi chữ ký lỗi này vào mục 10 để lần sau nhận ra ngay.
- Dev server hiện đang chạy nền (tôi khởi động lại) ở http://localhost:3000.

### 2026-07-17 (6) — Thay icon Shopee/TikTok generic bằng logo thương hiệu thật
- Mục "Cũng có bán trên:" (hiện khi sản phẩm có `shopeeUrl`/`tiktokUrl` gắn từ admin) trước đây
  dùng badge tròn nền màu (Shopee cam `#EE4D2D`, TikTok đen `#010101`) + icon Phosphor generic
  (`ph-shopping-bag-open`, `ph-music-notes`) — không phải logo thật của sàn.
- Đổi sang render logo thương hiệu thật `public/icons8-shopee.svg` / `public/icons8-tiktok.svg`
  qua `<img>` (kèm `eslint-disable @next/next/no-img-element` theo pattern sẵn có), đặt trong badge
  tròn **nền trắng viền mảnh** (`var(--neutral-200)` / `border-stone-200`) để logo màu đọc rõ.
  Sửa 2 nơi hiển thị: `features/storefront/components/screens/ProductScreen.tsx` (SPA, dùng `s()`)
  và `features/products/components/ProductDetailHero.tsx` (route chi tiết, dùng Tailwind). Admin
  form (`admin/products/new` + `[id]/edit`) không đổi — chỉ là 2 field text nhập link.
- Đã verify: `npx tsc --noEmit` + `npm run lint` sạch. **Chưa xem tận mắt qua trình duyệt** — user
  tự mở 1 sản phẩm có gắn link Shopee/TikTok để xác nhận logo hiện đúng, đẹp.

### 2026-07-17 (5) — Nối "Đặt thuốc theo toa" vào backend thật (bắt buộc đăng nhập)
- Phát hiện `RxModal.tsx` trước đây là **UI mockup thuần** — không lưu/gửi dữ liệu đi đâu (xem
  mục 10). Đã nối thật theo đúng yêu cầu user: bắt buộc đăng nhập, gửi xong đi qua **cùng pipeline
  chat thường** (không bảng/route riêng ngoài 1 route nhận upload).
- File mới: `src/app/api/prescriptions/route.ts` (POST, auth-gate, rate-limit 6/phút, validate ảnh,
  upload Storage, `addChatMessage`, báo Telegram); `src/features/chat/telegram.ts` (tách
  `notifyTelegramChat` dùng chung, trước đó chỉ nằm riêng trong `/api/chat/route.ts`);
  `src/lib/rateLimit.ts` (tách `createRateLimiter`/`getClientIp` dùng chung).
- Sửa: `lib/supabaseStorage.ts` (+`uploadPrescriptionImage`, prefix `prescriptions/{userId}/`);
  `app/api/chat/route.ts` (dùng lại 2 module chung thay vì code trùng lặp — hành vi không đổi, đã
  test lại 401 vẫn đúng sau refactor); `features/storefront/use-storefront.ts` (+`rxFile`,
  `rxMember`, `sendingRx` vào state; `onRxFile` lưu cả File object; `submitRx` giờ async, gọi
  `/api/prescriptions` thật, theo đúng pattern `placeOrder()` đã có); `RxModal.tsx` (gate đăng nhập
  3 trạng thái y hệt `DrugChatbot`, đăng nhập xong quay lại `/?rx=1` để tự mở lại modal — tái dùng
  cơ chế `params.rx` đã có sẵn từ trước).
- **Sự cố tự gây ra và đã xử lý**: chạy `npm run build` trong lúc dev server (của user) đang chạy
  → treo cứng dev server (không phải lỗi nhẹ như "Manifest file is empty" lần trước). Đã kill toàn
  bộ tiến trình liên quan, xóa `.next`, khởi động lại — hết treo, đã verify lại đầy đủ. **Đã ghi
  thành bài học ở mục 10** — đừng lặp lại việc build trong lúc dev server (kể cả của người khác)
  đang chạy.
- Đã verify: `npx tsc --noEmit` + `npm run lint` + `npm run build` sạch; `curl` xác nhận trang chủ
  200, `/?rx=1` render đúng modal, `POST /api/prescriptions` không auth → 401 đúng thông báo,
  `POST /api/chat` không auth vẫn → 401 (refactor không phá hành vi cũ). **Chưa tự gửi 1 toa thuốc
  thật** (cần đăng nhập thật qua trình duyệt + ảnh thật) — user tự test giúp: mở `/?rx=1` (hoặc
  bấm "Đặt thuốc theo toa" ở header/footer/trang chủ) lúc chưa đăng nhập → phải thấy màn hình yêu
  cầu đăng nhập; đăng nhập xong quay lại tự mở modal; gửi ảnh + SĐT → kiểm tra `/admin/chat` có tin
  nhắn mới dạng "📋 Yêu cầu đặt thuốc theo toa..." kèm link ảnh.

### 2026-07-17 (4) — Xóa hội thoại tư vấn + code review bảo mật
- **Code review bảo mật** cho 3 việc thêm ở entry (2)/(3): không có lỗi Critical. 2 điểm Important
  đã ghi nhận (chưa fix, để user quyết định): (a) `next@16.2.2` đang dính nhiều CVE High đã có bản
  vá (`npm audit`), không liên quan diff nhưng ảnh hưởng câu hỏi "an toàn vận hành chưa" — nên
  `npm install next@latest` (giữ `^16`) trước khi deploy; (b) route
  `/api/admin/products/vision-fill` chưa có rate limit — admin gọi lặp lại sẽ tốn tiền OpenRouter
  không giới hạn, nên thêm cap đơn giản.
- **Xóa hội thoại tư vấn**: nút "Xóa hội thoại" trong `ChatInbox.tsx` (header khung chat đang mở,
  xác nhận 2 bước) → `DELETE /api/admin/chat/[userId]` (mới) → `deleteConversation()` trong
  `features/chat/queries.ts` (mới) — xóa cứng toàn bộ `chat_messages` của user đó, không thể hoàn
  tác. Không cần migration (không đổi schema, chỉ thêm hàm xóa + route + nút).
- Đã kiểm tra (không đánh giá được tự động vì đây là dữ liệu chat thật của khách, không tự bấm xóa
  thử): `npx tsc --noEmit` + `npm run lint` sạch; `curl` GET `/admin/chat` (đăng nhập admin thật)
  → 200, không lỗi runtime. **Chưa tự bấm nút xóa thật** — user tự test trên hội thoại rác/test
  trước khi tin dùng trên hội thoại thật.
- Đã tắt dev server tôi tự chạy trước đó theo yêu cầu; phát hiện user có 1 tiến trình `npm run dev`
  **riêng** (không phải do tôi khởi động) đang chiếm cổng 3000 — nếu sau này thấy code đổi mà
  không lên, kiểm tra xem có tiến trình `next dev` nào khác đang chạy song song không (`Get-CimInstance
  Win32_Process -Filter "Name='node.exe'"` trong PowerShell) trước khi nghi ngờ code sai.

### 2026-07-17 (3) — Nút xóa bài viết ngay ở danh sách
- Thêm `features/articles/components/DeleteArticleButton.tsx` (client, xác nhận 2 bước "Xóa" →
  "Chắc chắn?"/"Hủy", tự thu lại sau 4s — copy nguyên pattern `DeleteUserButton.tsx` đã có sẵn cho
  users, không phải pattern mới) và gắn vào cột "Thao tác" ở `admin/articles/page.tsx`, dùng lại
  `deleteArticleAction` đã có sẵn — không cần vào trang sửa bài mới xóa được.
- **Phát hiện qua log dev server**: user đã tự bấm thử "Đồng bộ tin tức (RSS)" và nút xóa (ở trang
  sửa bài) thật trong lúc phiên trước đang chạy — xem entry (2) bên dưới đã cập nhật lại phần "chưa
  test được" thành đã test thật + phát hiện migration `manual-0008` **đã được chạy**.
- **Sự cố dev server đã gặp và xử lý**: sau khi thêm `DeleteArticleButton.tsx`, `GET /admin/articles`
  báo `500 Error: Manifest file is empty` (lỗi cache webpack dev-mode, không phải lỗi code — có thể
  do nhiều request/HMR chạy đồng thời lúc user và tôi cùng test). Xử lý: kill process `next dev`,
  xóa thư mục `.next`, chạy lại `npm run dev` — hết lỗi. **Nếu gặp lại lỗi "Manifest file is
  empty"**: thử xóa `.next` + restart dev server trước khi nghi code sai.
- Đã chạy lại `npx tsc --noEmit` + `npm run lint` sạch sau khi thêm nút xóa.

### 2026-07-17 (2) — Đồng bộ tin tức RSS + AI đọc ảnh sản phẩm (OpenRouter)
- **Tính năng 1 — RSS**: thêm `articles.source_url` (`db/schema.ts` +
  `drizzle/manual-0008-articles-source-url.sql`, **chưa chạy tay trên Supabase**, xem mục 10),
  `src/lib/rss.ts` (fetch/parse 2 feed VnExpress Sức khỏe + Sức khỏe & Đời sống qua `rss-parser`),
  `syncNewsFromRssAction` trong `features/articles/actions.ts` (luôn tạo `draft`, dedup theo
  `source_url`), nút + banner kết quả ở `admin/articles/page.tsx`. Cài thêm dep `rss-parser`.
- **Tính năng 2 — vision-fill**: `src/lib/openrouter.ts` (`analyzeProductImage`, gọi OpenRouter
  chat completions với ảnh, model đọc từ `OPENROUTER_VISION_MODEL`), route
  `api/admin/products/vision-fill/route.ts`, component `ProductVisionFill.tsx` (gắn vào
  `admin/products/new` + `[id]/edit`) — set giá trị DOM trực tiếp vào input uncontrolled cùng
  form, không đụng field giá/tồn kho/danh mục/kê đơn. Thêm `OPENROUTER_API_KEY` +
  `OPENROUTER_VISION_MODEL` vào `.env.example`.
- Đã chạy `npx tsc --noEmit` + `npm run lint` + `npm run build` sạch (build ra đủ route mới:
  `/api/admin/products/vision-fill`). Đã tự kiểm tra thêm (không cần Chrome extension):
  script độc lập gọi thẳng `rss-parser` với 2 URL feed thật → cả 2 fetch/parse OK (60 + 50 item);
  `curl` login admin thật (DB Supabase thật) rồi POST `/api/admin/products/vision-fill` với ảnh
  PNG thật (chưa set `OPENROUTER_API_KEY`) → đúng như thiết kế, trả 503 + thông báo tiếng Việt,
  không crash; `curl` GET cả 2 trang admin (`/admin/articles`, `/admin/products/new`) → 200, có
  đúng chữ nút mới trong HTML.
- **Chưa làm được** (Chrome extension không kết nối trong phiên này): bấm nút "Đồng bộ tin tức
  (RSS)" thật qua trình duyệt để xác nhận bài nháp được ghi vào DB qua Server Action (khác với
  test script ở trên — test script chỉ xác nhận phần fetch/parse, chưa xác nhận
  `syncNewsFromRssAction` + `createArticle` + dedup chạy đúng qua HTTP thật); gọi OpenRouter thật
  (cần key + tốn phí).
- **Việc tiếp theo**: user tự chạy `manual-0008-articles-source-url.sql` trên Supabase SQL Editor
  (bắt buộc trước khi bấm nút RSS, nếu không sẽ lỗi thiếu cột `source_url`); set
  `OPENROUTER_API_KEY` nếu muốn dùng tính năng AI; tự bấm thử cả 2 nút trên `npm run dev`
  (server đang chạy nền ở http://localhost:3000 từ phiên này).

### 2026-07-17 — Đọc README, tạo CLAUDE.md
- Đọc toàn bộ `README.md` cũ, khảo sát cấu trúc `src/`, xác minh lại vài điểm README đã cũ
  (`requireAdmin()` nay đã có trong actions; `JWT_SECRET`/`SUPABASE_JWT_SECRET` là 2 tên biến được
  chấp nhận, không chỉ `SUPABASE_JWT_SECRET` như README ghi).
- Tạo file này (`CLAUDE.md`) làm bộ nhớ làm việc liên phiên cho AI; `README.md` sẽ được rút gọn
  thành mô tả public cho GitHub (không còn là tài liệu kiến trúc chi tiết — chi tiết nằm ở đây).
- **Ghi nhận trạng thái working tree lúc này** (chưa commit, do phiên trước để lại): đang thêm
  hiển thị link Shopee/TikTok ở màn chi tiết sản phẩm trong SPA storefront
  (`ProductScreen.tsx` + `data.ts` + `queries.ts` + `use-storefront.ts` — field `shopeeUrl`/
  `tiktokUrl` đã có sẵn ở DB/admin từ trước qua `manual-0007-product-reviews-user-and-shop-links.sql`,
  chỉ là SPA chưa render icon). Xem mục 10 để biết 2 file svg chưa dùng liên quan.
- **Việc tiếp theo gợi ý**: xác nhận diff Shopee/TikTok đã đúng ý rồi commit; xử lý mục nợ kỹ thuật
  ở mục 10 (sitemap tĩnh, 2 file icon rời) nếu người dùng muốn dọn tiếp trong phiên này.
