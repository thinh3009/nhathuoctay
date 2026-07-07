-- ============================================================================
-- Manual migration 0002 — Ảnh hero (banner trang chủ) cho slider
-- Chạy thủ công trên Supabase SQL Editor (app dùng role postgres, bypass RLS).
-- ============================================================================

CREATE TABLE IF NOT EXISTS hero_images (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Đường dẫn file trong bucket product-images (prefix 'hero/') để xóa đúng file.
  storage_path  text NOT NULL,
  url           text NOT NULL,
  sort_order    integer NOT NULL DEFAULT 0,
  is_active     boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS hero_images_sort_idx ON hero_images (sort_order, created_at);

-- RLS: bật, KHÔNG policy — chặn Data API công khai (anon key). App dùng role postgres.
ALTER TABLE hero_images ENABLE ROW LEVEL SECURITY;
