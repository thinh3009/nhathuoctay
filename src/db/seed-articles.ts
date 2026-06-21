import { existsSync } from 'node:fs'

// Tạo vài bài viết mẫu (đã đăng). Chạy: node --experimental-strip-types src/db/seed-articles.ts
async function seedArticles() {
  if (existsSync('.env.local')) {
    process.loadEnvFile?.('.env.local')
  } else if (existsSync('.env')) {
    process.loadEnvFile?.('.env')
  }

  const [{ db }, { articles }] = await Promise.all([import('./client.ts'), import('./schema.ts')])

  const now = new Date()
  const samples = [
    {
      slug: 'cach-bo-sung-vitamin-c-dung-cach',
      title: 'Cách bổ sung Vitamin C đúng cách mỗi ngày',
      excerpt:
        'Vitamin C hỗ trợ đề kháng và chống oxy hóa, nhưng bổ sung sai cách có thể giảm hiệu quả. Cùng tìm hiểu liều dùng và thời điểm hợp lý.',
      category: 'Cẩm nang sức khỏe',
      content: `## Vitamin C có vai trò gì?

Vitamin C (axit ascorbic) tham gia vào nhiều quá trình quan trọng:

- Hỗ trợ **hệ miễn dịch** và sức đề kháng
- Chống **oxy hóa**, bảo vệ tế bào
- Hỗ trợ hấp thu sắt và tổng hợp collagen

## Bổ sung bao nhiêu là đủ?

Người trưởng thành thường cần khoảng **70–90mg/ngày**. Khi cần tăng đề kháng có thể dùng viên sủi hoặc viên nén liều cao hơn theo hướng dẫn.

> Lưu ý: thông tin chỉ mang tính tham khảo, không thay thế tư vấn của bác sĩ/dược sĩ.

## Thời điểm dùng tốt nhất

Nên uống **sau bữa ăn** để giảm kích ứng dạ dày và tăng hấp thu.`,
    },
    {
      slug: 'luu-y-khi-dung-thuoc-ha-sot-cho-tre',
      title: 'Những lưu ý khi dùng thuốc hạ sốt cho trẻ',
      excerpt:
        'Hạ sốt đúng cách giúp trẻ dễ chịu và an toàn. Bài viết tổng hợp các nguyên tắc cơ bản cha mẹ nên biết.',
      category: 'Mẹ và bé',
      content: `## Khi nào cần hạ sốt cho trẻ?

Thường cân nhắc dùng thuốc khi trẻ sốt **từ 38.5°C** trở lên hoặc khó chịu nhiều.

## Nguyên tắc an toàn

1. Dùng đúng **liều theo cân nặng**
2. Đảm bảo **khoảng cách giữa các liều**
3. Cho trẻ uống đủ nước, mặc thoáng

## Khi nào cần đưa trẻ đi khám?

- Sốt cao liên tục không hạ
- Trẻ li bì, bỏ bú, co giật

> Hãy hỏi ý kiến dược sĩ/bác sĩ trước khi dùng thuốc cho trẻ.`,
    },
  ]

  for (const sample of samples) {
    await db
      .insert(articles)
      .values({
        slug: sample.slug,
        title: sample.title,
        excerpt: sample.excerpt,
        content: sample.content,
        category: sample.category,
        status: 'published',
        publishedAt: now,
        updatedAt: now,
      })
      .onConflictDoNothing({ target: articles.slug })
  }

  console.log(`Đã tạo/giữ ${samples.length} bài viết mẫu.`)
}

seedArticles()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Seed articles failed.')
    console.error(error)
    process.exit(1)
  })
