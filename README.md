# Quầy thuốc 16 — Nhà thuốc trực tuyến

Ứng dụng thương mại điện tử cho nhà thuốc, xây bằng **Next.js 16 (App Router)**, **React 19**,
**TypeScript**, **Drizzle ORM** trên **Postgres (Supabase)**.

- **Storefront**: trang chủ SPA, danh mục, chi tiết sản phẩm, giỏ hàng, thanh toán, blog, đặt
  thuốc theo toa, tư vấn dược sĩ (chat 2 chiều với admin, cần đăng nhập, báo qua Telegram).
- **Admin** (`/admin`): CRUD sản phẩm/danh mục/combo/bài viết, quản lý đơn hàng, người dùng, ảnh
  (Supabase Storage + ảnh hero trang chủ) và trả lời tư vấn khách.

## Công nghệ

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Drizzle ORM · Supabase (Postgres + Storage)
· JWT (`jose`) · Zod · Vercel.

## Bắt đầu

```bash
npm install
cp .env.example .env     # điền biến môi trường
npm run dev               # http://localhost:3000
```

Scripts khác: `npm run build`, `npm run lint`, `npm run db:push`, `npm run db:studio`,
`npm run db:seed`, `npm run admin:create`. Chi tiết đầy đủ (kiến trúc, cấu trúc thư mục, schema DB,
quy ước migration, biến môi trường...) xem **[CLAUDE.md](./CLAUDE.md)**.

## License

Private project.
