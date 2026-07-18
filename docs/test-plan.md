# Test Plan — Quầy thuốc 16

> Test case thủ công cho các luồng chính + phần SEO vừa thêm (2026-07-17). Dùng để test tay
> (Chrome) hoặc làm khung viết test tự động sau. Cột **Kết quả** điền khi chạy; lỗi ghi vào Notion
> (page "Web nhà thuốc development").
>
> Chuẩn bị: `npm run dev` (cần DB thật + `.env` đủ biến). Base URL mặc định `http://localhost:3000`.

## Quy ước

- **P0** = luồng chặn (hỏng là không dùng được), **P1** = quan trọng, **P2** = phụ.
- Mỗi case: tiền đề → thao tác → kết quả mong đợi.

---

## A. SEO & kỹ thuật (thay đổi mới — ưu tiên verify)

| ID | P | Test case | Thao tác | Kết quả mong đợi |
|----|---|-----------|----------|------------------|
| SEO-01 | P0 | `robots.txt` render đúng | GET `/robots.txt` | 200, có `Disallow: /admin`, `/account`, `/checkout`, `/cart`, `/auth`, `/api`; có dòng `Sitemap:` trỏ đúng domain (KHÔNG phải `domain.com`) |
| SEO-02 | P0 | `sitemap.xml` động từ DB | GET `/sitemap.xml` | 200 XML; có URL trang chủ, `/bai-viet`, các `/category/<slug>` (chỉ danh mục active), các `/product/<slug>`, và **các `/bai-viet/<slug>` bài đã đăng** |
| SEO-03 | P0 | Metadata trang sản phẩm | Mở 1 `/product/<slug>` → View Source | `<title>` = tên sản phẩm + " \| Quầy thuốc 16"; có `<meta name="description">`; có `<link rel="canonical" href=".../product/<slug>">` |
| SEO-04 | P1 | Canonical danh mục gom filter | Mở `/category/thuoc?sort=price-asc&priceRange=under-200` → View Source | `<link rel="canonical">` = `/category/thuoc` (KHÔNG kèm `?sort`/`?priceRange`); còn `?page=2` thì canonical giữ `?page=2` |
| SEO-05 | P0 | JSON-LD Product | `/product/<slug>` → View Source, tìm `application/ld+json` | Có `@type":"Product"` với `name`, `offers.price`, `priceCurrency:"VND"`; có `BreadcrumbList`. **Nếu SP có review**: có `aggregateRating`; **nếu chưa có review**: KHÔNG có `aggregateRating` |
| SEO-06 | P1 | JSON-LD Article | `/bai-viet/<slug>` → View Source | Có `@type":"Article"` (`headline`, `datePublished`, `publisher`) + `BreadcrumbList` |
| SEO-07 | P1 | JSON-LD Organization | Trang chủ `/` → View Source | Có `@graph` gồm `Organization` + `WebSite`; `logo` trỏ `/logo_brand.svg`. **KHÔNG** có `Pharmacy`/`address` (chưa có NAP — đúng như thiết kế) |
| SEO-08 | P2 | Rich Results Test | Dán URL sản phẩm live vào search.google.com/test/rich-results | Product + Breadcrumb hợp lệ, không thiếu required field |

## B. Storefront (trang chủ SPA)

| ID | P | Test case | Thao tác | Kết quả mong đợi |
|----|---|-----------|----------|------------------|
| HOME-01 | P0 | Trang chủ load | GET `/` | 200, hiện hero, danh sách sản phẩm, không lỗi console |
| HOME-02 | P1 | Điều hướng màn SPA giữ khi F5 | Vào 1 danh mục trong SPA → F5 | Giữ nguyên màn đang xem (nhờ `?screen=&cat=`), không nháy về trang chủ |
| HOME-03 | P1 | Tìm kiếm sản phẩm | Gõ từ khóa vào ô search | Ra kết quả khớp; rỗng → thông báo "không có sản phẩm" |
| HOME-04 | P1 | Combo | Xem section combo | Có combo active thì hiện; không có thì ẩn section (không hiện demo giả) |
| HOME-05 | P2 | Ảnh hero carousel | ≥2 ảnh hero | Chạy carousel |

## C. Danh mục & chi tiết sản phẩm (route thật)

| ID | P | Test case | Thao tác | Kết quả mong đợi |
|----|---|-----------|----------|------------------|
| CAT-01 | P0 | Trang danh mục | `/category/thuoc` | 200, tiêu đề danh mục, lưới sản phẩm, breadcrumb |
| CAT-02 | P1 | Bộ lọc + sắp xếp | Chọn subCategory / priceRange / sort | URL cập nhật param, danh sách lọc/sắp đúng |
| CAT-03 | P1 | Phân trang | Bấm trang 2 | `?page=2`, sản phẩm khác, giữ filter |
| CAT-04 | P1 | Danh mục ẩn → 404 | `/category/<slug đã ẩn>` | notFound (404) |
| PROD-01 | P0 | Chi tiết sản phẩm | `/product/<slug>` | 200, hero + giá + mô tả + ảnh; "sản phẩm liên quan" load qua Suspense |
| PROD-02 | P1 | Sản phẩm ẩn → 404 | `/product/<slug ẩn>` | 404 |
| PROD-03 | P1 | Link Shopee/TikTok | SP có gắn link | Badge "Cũng có bán trên" hiện logo Shopee/TikTok, click mở đúng tab |
| PROD-04 | P1 | Đánh giá sản phẩm | Đăng nhập → gửi review | Review lưu, rating trung bình cập nhật |

## D. Giỏ hàng & thanh toán

| ID | P | Test case | Thao tác | Kết quả mong đợi |
|----|---|-----------|----------|------------------|
| CART-01 | P0 | Thêm vào giỏ | Bấm "Thêm vào giỏ" | Badge số lượng ở header tăng |
| CART-02 | P1 | Cập nhật/xóa | Đổi số lượng, xóa dòng | Tổng tiền cập nhật |
| CO-01 | P0 | Checkout | Điền thông tin → đặt hàng | Tạo đơn, chuyển `/checkout/success` |
| CO-02 | P1 | Validate form | Bỏ trống trường bắt buộc | Báo lỗi, không cho đặt |

## E. Xác thực

| ID | P | Test case | Thao tác | Kết quả mong đợi |
|----|---|-----------|----------|------------------|
| AUTH-01 | P0 | Đăng ký (email/SĐT) | `/auth/register` | Tạo tài khoản, đăng nhập được |
| AUTH-02 | P0 | Đăng nhập | `/auth/login` | Vào được, cookie phiên |
| AUTH-03 | P1 | Chặn admin khi chưa quyền | Vào `/admin` khi là customer | Bị chặn/redirect |

## F. Tư vấn dược sĩ & đặt thuốc theo toa

| ID | P | Test case | Thao tác | Kết quả mong đợi |
|----|---|-----------|----------|------------------|
| CHAT-01 | P0 | Gửi tin phải đăng nhập | Mở khung 🩺 khi chưa đăng nhập | Yêu cầu đăng nhập, không gửi được |
| CHAT-02 | P1 | Gửi & nhận tin | Đăng nhập → gửi tin | Tin lưu, admin thấy ở `/admin/chat` |
| RX-01 | P1 | Đặt thuốc theo toa | `/?rx=1` (đăng nhập) → gửi ảnh + SĐT | `POST /api/prescriptions` OK, hiện tin ở `/admin/chat` dạng "📋 Yêu cầu đặt thuốc theo toa" |
| RX-02 | P0 | Rx chưa đăng nhập | `/?rx=1` khi chưa đăng nhập | Màn yêu cầu đăng nhập |

## G. Admin (cần tài khoản admin)

| ID | P | Test case | Thao tác | Kết quả mong đợi |
|----|---|-----------|----------|------------------|
| ADM-01 | P0 | CRUD sản phẩm | Thêm/sửa/xóa ở `/admin/products` | Lưu DB, hiện storefront |
| ADM-02 | P1 | Đồng bộ RSS | `/admin/articles` bấm "Đồng bộ tin tức (RSS)" | Tạo bài `draft`, dedup theo `source_url` |
| ADM-03 | P1 | Xóa hội thoại | `/admin/chat` xóa hội thoại | Xóa cứng toàn bộ tin của user (xác nhận 2 bước) |

---

## Nhật ký chạy test

> Điền ngày + kết quả mỗi lần chạy. Lỗi → ghi Notion, dẫn ID case.

| Ngày | Người/Agent | Phạm vi | Pass/Fail | Ghi chú |
|------|-------------|---------|-----------|---------|
| 2026-07-17 | Claude (HTTP, dev) | Nhóm A (SEO-01→07) + smoke P0 công khai | A: PASS toàn bộ · P0: 200 hết | **1 bug: soft-404** (SP/danh mục/bài viết slug sai trả HTTP 200 thay vì 404 — nghi do `force-dynamic`, cần verify prod build). + cảnh báo middleware deprecated. Đã ghi Notion. Chrome extension chưa kết nối → chưa test hình ảnh (P0 visual còn treo). |
