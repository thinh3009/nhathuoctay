-- Cho phép tạo tài khoản bằng email HOẶC số điện thoại.
-- Chạy tay trên Supabase SQL Editor (xem README mục 5 – Quy ước migration).

-- 1) Email không còn bắt buộc (user chỉ có SĐT sẽ để email NULL).
ALTER TABLE users ALTER COLUMN email DROP NOT NULL;

-- 2) Số điện thoại trở thành định danh duy nhất (nhiều NULL vẫn được phép).
--    Nếu bước này lỗi do có SĐT trùng sẵn trong dữ liệu, hãy dọn trùng trước rồi chạy lại.
ALTER TABLE users ADD CONSTRAINT users_phone_unique UNIQUE (phone);

-- 3) Bắt buộc có ít nhất một định danh: email hoặc phone.
ALTER TABLE users ADD CONSTRAINT users_email_or_phone_check
  CHECK (email IS NOT NULL OR phone IS NOT NULL);

-- RLS: bảng users đã bật sẵn từ migration gốc, không cần thao tác thêm.
