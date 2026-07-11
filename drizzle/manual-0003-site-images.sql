-- Ảnh tùy biến giao diện trang chủ do admin đặt (mỗi slot một ảnh).
-- Chạy tay trên Supabase SQL Editor. Bật RLS (không policy) để chặn Data API công khai.

create table if not exists public.site_images (
  slot text primary key,
  storage_path text not null,
  url text not null,
  updated_at timestamptz not null default now()
);

alter table public.site_images enable row level security;
