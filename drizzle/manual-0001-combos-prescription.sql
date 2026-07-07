-- ============================================================================
-- Manual migration 0001 — Combo động + phân loại kê đơn 3 trạng thái
-- Chạy thủ công trên Supabase SQL Editor (app dùng role postgres, bypass RLS).
-- ============================================================================

-- 1) prescription_required: cho phép NULL để có 3 trạng thái
--    NULL = trống (không phân loại) · false = không kê đơn · true = kê đơn
ALTER TABLE products ALTER COLUMN prescription_required DROP DEFAULT;
ALTER TABLE products ALTER COLUMN prescription_required DROP NOT NULL;

-- 2) Bảng combo thuốc do admin tạo
CREATE TABLE IF NOT EXISTS combos (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  tag         text NOT NULL DEFAULT 'Tiết kiệm',
  -- Giá combo tùy chọn; NULL = tự tính (giảm 85% tổng giá thành viên).
  sale_price  integer,
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- 3) Thành viên của combo (tham chiếu sản phẩm theo slug)
CREATE TABLE IF NOT EXISTS combo_items (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  combo_id      uuid NOT NULL REFERENCES combos(id) ON DELETE CASCADE,
  product_slug  text NOT NULL REFERENCES products(slug) ON DELETE CASCADE,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS combo_product_unique
  ON combo_items (combo_id, product_slug);

-- 4) RLS: bật, KHÔNG policy — chặn Data API công khai (anon key). App dùng role
--    postgres nên vẫn đọc/ghi bình thường. (Đồng bộ chính sách bảo mật hiện tại.)
ALTER TABLE combos ENABLE ROW LEVEL SECURITY;
ALTER TABLE combo_items ENABLE ROW LEVEL SECURITY;
