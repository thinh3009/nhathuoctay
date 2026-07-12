-- Chat tư vấn 2 chiều: khách ↔ dược sĩ/admin, lưu trong DB (nguồn sự thật).
-- Chạy tay trên Supabase SQL Editor (xem README mục 5 – Quy ước migration).

CREATE TABLE IF NOT EXISTS chat_messages (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sender       text NOT NULL CHECK (sender IN ('user', 'admin')),
  content      text NOT NULL,
  read_by_admin boolean NOT NULL DEFAULT false,
  read_by_user  boolean NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS chat_messages_user_created_idx
  ON chat_messages (user_id, created_at);

-- RLS bật, KHÔNG policy → chặn Data API công khai. App dùng role postgres nên vẫn chạy.
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
