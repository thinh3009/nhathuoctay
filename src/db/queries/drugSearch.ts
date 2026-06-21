import { and, desc, eq, ilike, or } from 'drizzle-orm'
import { db } from '../client'
import { products as productsTable } from '../schema'

/**
 * Tra cứu sản phẩm cho công cụ `search_drugs` của chatbot.
 *
 * Thay cho service Python cũ (chatbot-api/drug_search.py): dùng chung Drizzle/DB
 * với phần còn lại của app, không nhân bản dữ liệu, không cần vector DB — kết quả
 * luôn cập nhật theo DB. Muốn nâng lên RAG/pgvector sau này chỉ cần đổi thân hàm.
 */
export async function searchDrugs(query: string) {
  const keyword = query.trim()
  if (!keyword) return []

  const like = `%${keyword}%`

  return db
    .select({
      slug: productsTable.slug,
      name: productsTable.name,
      subCategory: productsTable.subCategory,
      benefit: productsTable.benefit,
      shortDescription: productsTable.shortDescription,
      ingredientHighlight: productsTable.ingredientHighlight,
      usage: productsTable.usage,
      price: productsTable.price,
      unit: productsTable.unit,
      manufacturer: productsTable.manufacturer,
      countryOfOrigin: productsTable.countryOfOrigin,
      prescriptionRequired: productsTable.prescriptionRequired,
      stockQuantity: productsTable.stockQuantity,
      rating: productsTable.rating,
    })
    .from(productsTable)
    .where(
      and(
        eq(productsTable.isActive, true),
        or(
          ilike(productsTable.name, like),
          ilike(productsTable.benefit, like),
          ilike(productsTable.subCategory, like),
          ilike(productsTable.ingredientHighlight, like),
          ilike(productsTable.shortDescription, like),
          ilike(productsTable.description, like),
        ),
      ),
    )
    .orderBy(desc(productsTable.rating))
    .limit(8)
}
