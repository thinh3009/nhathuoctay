export {}

process.loadEnvFile?.('.env')

const { default: postgres } = await import('postgres')

const connectionString = process.env.POSTGRES_URL_NON_POOLING ?? process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('Missing database connection string.')
}

const sql = postgres(connectionString, {
  prepare: false,
  max: 1,
})

const statements = [
  `
  create extension if not exists pgcrypto;
  `,
  `
  create table if not exists public.categories (
    slug text primary key,
    label text not null,
    hero_title text not null,
    hero_description text not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  );
  `,
  `
  create table if not exists public.products (
    id uuid primary key default gen_random_uuid(),
    slug text not null unique,
    category_slug text not null references public.categories(slug) on delete cascade,
    name text not null,
    sub_category text not null,
    benefit text not null,
    description text not null,
    short_description text not null,
    price integer not null,
    badge text not null,
    ingredients jsonb not null,
    usage text not null,
    unit text not null,
    default_quantity integer not null,
    sku text not null,
    rating real not null,
    review_count integer not null,
    comment_count integer not null,
    official_name text not null,
    registration_number text not null,
    form text not null,
    specification text not null,
    manufacturer text not null,
    country_of_origin text not null,
    shelf_life text not null,
    ingredient_highlight text not null,
    images jsonb not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  );
  `,
  `
  create table if not exists public.product_reviews (
    id uuid primary key default gen_random_uuid(),
    product_slug text not null references public.products(slug) on delete cascade,
    author text not null,
    rating integer not null,
    date text not null,
    title text not null,
    content text not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  );
  `,
  `
  create table if not exists public.carts (
    id uuid primary key default gen_random_uuid(),
    cart_token text not null unique,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  );
  `,
  `
  create table if not exists public.cart_items (
    id uuid primary key default gen_random_uuid(),
    cart_id uuid not null references public.carts(id) on delete cascade,
    product_slug text not null references public.products(slug) on delete cascade,
    quantity integer not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  );
  `,
  `
  create unique index if not exists cart_product_unique
  on public.cart_items(cart_id, product_slug);
  `,
]

try {
  for (const statement of statements) {
    await sql.unsafe(statement)
  }

  console.log('Database bootstrap completed.')
} catch (error) {
  console.error('Database bootstrap failed.')
  console.error(error)
  process.exitCode = 1
} finally {
  await sql.end({ timeout: 1 })
}
