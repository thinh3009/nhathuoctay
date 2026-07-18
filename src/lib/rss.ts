import 'server-only'
import Parser from 'rss-parser'

export type RssFeedConfig = { url: string; sourceName: string }

// Danh sách feed dễ sửa — thêm/bớt nguồn tại đây, không cần sửa logic bên dưới.
export const HEALTH_RSS_FEEDS: RssFeedConfig[] = [
  { url: 'https://vnexpress.net/rss/suc-khoe.rss', sourceName: 'VnExpress Sức khỏe' },
  { url: 'https://suckhoedoisong.vn/rss/home.rss', sourceName: 'Sức khỏe & Đời sống' },
]

export type RssCandidate = {
  title: string
  excerpt: string
  sourceLink: string
  sourceName: string
  publishedAt: Date | null
}

const parser = new Parser({ timeout: 10_000 })

export async function fetchRssCandidates(
  feeds: RssFeedConfig[] = HEALTH_RSS_FEEDS,
): Promise<RssCandidate[]> {
  // allSettled: 1 feed lỗi (mạng, site sập) không được làm hỏng cả lần đồng bộ.
  const results = await Promise.allSettled(feeds.map(fetchOneFeed))
  const items: RssCandidate[] = []
  for (const result of results) {
    if (result.status === 'fulfilled') items.push(...result.value)
    else console.error('[rss] feed fetch failed', result.reason)
  }
  return items
}

async function fetchOneFeed(feed: RssFeedConfig): Promise<RssCandidate[]> {
  const parsed = await parser.parseURL(feed.url)
  return (parsed.items ?? [])
    .filter((item) => item.link && item.title)
    .map((item) => ({
      title: stripHtml(item.title ?? '').trim(),
      excerpt: stripHtml(item.contentSnippet || item.content || item.summary || '')
        .trim()
        .slice(0, 500),
      sourceLink: item.link!.trim(),
      sourceName: feed.sourceName,
      publishedAt: item.pubDate ? new Date(item.pubDate) : item.isoDate ? new Date(item.isoDate) : null,
    }))
}

function stripHtml(input: string): string {
  return input.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}
