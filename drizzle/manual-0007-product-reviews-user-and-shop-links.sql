-- Gắn đánh giá/bình luận sản phẩm với tài khoản thật (thay vì tên tự do/dữ liệu mẫu),
-- và thêm link sản phẩm trên Shopee/TikTok Shop (hiện icon cạnh nút "Thêm vào giỏ").
-- Chạy tay trên Supabase SQL Editor (xem README mục 5 – Quy ước migration).

ALTER TABLE product_reviews ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE products ADD COLUMN IF NOT EXISTS shopee_url text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS tiktok_url text;
