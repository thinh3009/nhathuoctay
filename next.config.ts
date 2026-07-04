import type { NextConfig } from 'next'

const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Chỉ cho Image optimizer fetch ảnh từ Supabase Storage — KHÔNG mở wildcard
  // (wildcard biến /_next/image thành proxy ảnh công khai cho host tùy ý).
  images: supabaseHostname
    ? {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: supabaseHostname,
            pathname: '/storage/v1/object/public/**',
          },
        ],
      }
    : undefined,
}

export default nextConfig
