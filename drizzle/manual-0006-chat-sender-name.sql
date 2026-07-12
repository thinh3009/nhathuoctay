-- Lưu tên người gửi tin (chủ yếu tên dược sĩ/admin trả lời) để hiện trong thông báo.
-- Chạy tay trên Supabase SQL Editor (xem README mục 5 – Quy ước migration).

ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS sender_name text;
