async function seedCatalog() {
  process.loadEnvFile?.('.env')

  const [{ db }, { categories, productReviews, products: productsTable }, { categoryNavItems, products }] =
    await Promise.all([
      import('./client.ts'),
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
        },
      })
  }

  await db.delete(productReviews)

  for (const product of products) {
    if (product.reviews.length === 0) {
      continue
    }

    await db.insert(productReviews).values(
      product.reviews.map((review) => ({
        productSlug: product.slug,
        author: review.author,
        rating: review.rating,
        date: review.date,
        title: review.title,
        content: review.content,
      })),
    )
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
