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
- `product_reviews`, `articles`, `carts`/`cart_items`, `orders`/`order_items`, `wishlists`.
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

---

## 7. Ảnh & Storage

- Ảnh sản phẩm/hero upload lên bucket `product-images` qua `lib/supabaseStorage.ts` (cần
  `SUPABASE_SERVICE_ROLE_KEY`). Prefix: sản phẩm `uploads/{key}/`, hero `hero/`.
- `/admin/images` liệt kê Storage + dung lượng, quản lý ảnh hero/CTA (tab "Ảnh hero" gồm
  HeroManager + AppearanceManager nhúng).
- **Logo** là ảnh cứng `public/logo_brand.svg` (`components/ui/Logo.tsx`) — dùng ở header, footer,
  checkout; **không** đổi qua admin (đã gỡ slot logo khỏi AppearanceManager).
- Icon giao diện: Phosphor Icons (CDN). Icon thương hiệu nhiều màu: sprite `public/icons.svg`
  (`<use href="/icons.svg#id" />`). Có 2 file rời `public/icons8-shopee.svg` /
  `icons8-tiktok.svg` **chưa dùng ở đâu trong src** — xem mục 10.

---

## 8. Tư vấn dược sĩ (chat 2 chiều + thông báo)

Nút bác sĩ 🩺 nổi góc phải (`features/chat/components/DrugChatbot.tsx`, gắn toàn cục trong
`app/layout.tsx`) — chat 2 chiều lưu DB, **không dùng AI**:

- Bắt buộc đăng nhập mới gửi được. Tên người gửi lấy từ tài khoản (server, không tin client).
- Khách gửi → lưu `chat_messages` (sender=`user`); có `TELEGRAM_*` thì báo Telegram cho dược sĩ.
- Admin trả lời tại `/admin/chat` (`ChatInbox.tsx`): cột trái danh sách hội thoại + badge chưa đọc,
  cột phải khung trả lời. Tin lưu sender=`admin`.
- Cập nhật bằng **polling** (không websocket): khách 5s, admin thread 4s, danh sách hội thoại 8s.
- Chuông thông báo (mở bảng thông báo, không mở thẳng chat):
  - Khách: `ChatNotifyBell` trong `SiteHeader`/`HomeHeader` (chỉ khi đã đăng nhập), poll 15s. Bấm
    dòng → phát event `qt:open-consult` để mở khung chat.
  - Admin: `AdminChatBell` trong `AdminShell`, poll 10s. Bấm dòng → `/admin/chat?u=<userId>`.

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

- **`sitemap.ts` (`src/app/sitemap.ts`) vẫn đọc `lib/catalog` TĨNH** → sản phẩm admin thêm qua
  `/admin/products` **không** vào sitemap. Cần đổi sang đọc DB (`features/products/queries.ts`)
  nếu SEO là ưu tiên.
- **2 file ảnh rời chưa dùng**: `public/icons8-shopee.svg`, `public/icons8-tiktok.svg` (thêm
  2026-07-17, không có reference nào trong `src/`). Link Shopee/TikTok ở `ProductScreen.tsx` hiện
  dùng icon Phosphor (`ph-shopping-bag-open`, `ph-music-notes`) thay vì 2 file này — hoặc xóa 2
  file, hoặc đổi `ProductScreen.tsx` sang dùng `<img>` với 2 file đó nếu muốn logo thật thay vì
  icon Phosphor generic.
- **Middleware auth tắt cố ý** (`src/middleware.ts`) — bảo vệ dựa vào `requireAdmin()` per-action.
  Nếu có ai đề xuất "bật lại middleware", xác nhận đây không phải việc dang dở bị bỏ quên trước
  khi động vào.
- **JWT_SECRET bắt buộc ở production** (từ 2026-07-12) — kiểm tra đã set trên Vercel trước mỗi
  lần deploy có thay đổi liên quan auth.

---

## 11. Nhật ký phiên làm việc

> Entry mới nhất **trên cùng**. Mỗi entry: ngày, việc đã làm, trạng thái (xong/dang dở/đã revert),
> việc tiếp theo nếu có. Lịch sử commit đầy đủ xem `git log --oneline`.

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
