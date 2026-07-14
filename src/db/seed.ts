import { existsSync } from 'node:fs'

async function seedCatalog() {
  // Load .env.local nếu có, fallback về .env
  if (existsSync('.env.local')) {
    process.loadEnvFile?.('.env.local')
  } else if (existsSync('.env')) {
    process.loadEnvFile?.('.env')
  }

  const [{ db }, { categories, products: productsTable }, { categoryNavItems, products }] =
    await Promise.all([
      import('../lib/db.ts'),
      import('./schema.ts'),
      import('../lib/catalog.ts'),
    ])

  for (const category of categoryNavItems) {
    await db
      .insert(categories)
      .values({
        slug: category.slug,
        label: category.label,
        heroTitle: category.heroTitle,
        heroDescription: category.heroDescription,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: categories.slug,
        set: {
          label: category.label,
          heroTitle: category.heroTitle,
          heroDescription: category.heroDescription,
          updatedAt: new Date(),
        },
      })
  }

  await db.delete(productsTable)

  for (const product of products) {
    await db
      .insert(productsTable)
      .values({
        slug: product.slug,
        categorySlug: product.topCategorySlug,
        name: product.name,
        subCategory: product.subCategory,
        benefit: product.benefit,
        description: product.description,
        shortDescription: product.shortDescription,
        price: product.price,
        badge: product.badge,
        ingredients: product.ingredients,
        usage: product.usage,
        unit: product.unit,
        defaultQuantity: product.defaultQuantity,
        sku: product.sku,
        rating: product.rating,
        reviewCount: product.reviewCount,
        commentCount: product.commentCount,
        officialName: product.officialName,
        registrationNumber: product.registrationNumber,
        form: product.form,
        specification: product.specification,
        manufacturer: product.manufacturer,
        countryOfOrigin: product.countryOfOrigin,
        shelfLife: product.shelfLife,
        ingredientHighlight: product.ingredientHighlight,
        images: product.images,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: productsTable.slug,
        // Không set rating/reviewCount/commentCount ở đây: các số này giờ tính từ
        // đánh giá thật của khách (product_reviews) — seed lại không được ghi đè mất.
        set: {
          categorySlug: product.topCategorySlug,
          name: product.name,
          subCategory: product.subCategory,
          benefit: product.benefit,
          description: product.description,
          shortDescription: product.shortDescription,
          price: product.price,
          badge: product.badge,
          ingredients: product.ingredients,
          usage: product.usage,
          unit: product.unit,
          defaultQuantity: product.defaultQuantity,
          sku: product.sku,
          officialName: product.officialName,
          registrationNumber: product.registrationNumber,
          form: product.form,
          specification: product.specification,
          manufacturer: product.manufacturer,
          countryOfOrigin: product.countryOfOrigin,
          shelfLife: product.shelfLife,
          ingredientHighlight: product.ingredientHighlight,
          images: product.images,
          updatedAt: new Date(),
        },
      })
  }
}

seedCatalog()
  .then(() => {
    console.log('Catalog seed completed.')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Catalog seed failed.')
    console.error(error)
    process.exit(1)
  })
