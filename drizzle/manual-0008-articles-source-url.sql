-- Lưu link bài gốc khi bài viết được tạo tự động từ RSS (đồng bộ tin tức) — dùng để
-- chống trùng (dedup) khi đồng bộ lại, và để admin đối chiếu nguồn trước khi đăng.
-- Chạy tay trên Supabase SQL Editor (xem CLAUDE.md mục 6 – Quy ước migration).

ALTER TABLE articles ADD COLUMN IF NOT EXISTS source_url text;
