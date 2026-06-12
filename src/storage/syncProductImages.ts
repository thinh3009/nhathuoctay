import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { products } from '../lib/catalog.ts'
import { PRODUCT_IMAGE_BUCKET, getAllProductImageUploadTasks } from '../lib/productImages.ts'

process.loadEnvFile?.('.env')

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error('SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL is required.')
}

if (!serviceRoleKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required.')
}

const headers = {
  apikey: serviceRoleKey,
  Authorization: `Bearer ${serviceRoleKey}`,
}

async function ensureBucket() {
  const listResponse = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
    headers,
  })

  if (!listResponse.ok) {
    throw new Error(`Unable to list buckets: ${listResponse.status} ${await listResponse.text()}`)
  }

  const buckets = (await listResponse.json()) as Array<{ id: string }>
  const bucketExists = buckets.some((bucket) => bucket.id === PRODUCT_IMAGE_BUCKET)

  if (bucketExists) {
    return
  }

  const createResponse = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
    method: 'POST',
    headers: {
      ...headers,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      id: PRODUCT_IMAGE_BUCKET,
      name: PRODUCT_IMAGE_BUCKET,
      public: true,
    }),
  })

  if (!createResponse.ok) {
    throw new Error(`Unable to create bucket: ${createResponse.status} ${await createResponse.text()}`)
  }
}

async function uploadFile(sourceFile: string, storagePath: string, contentType: string) {
  const localPath = path.join(process.cwd(), 'public', 'demo-products', sourceFile)
  const fileBuffer = await readFile(localPath)

  const uploadResponse = await fetch(
    `${supabaseUrl}/storage/v1/object/${PRODUCT_IMAGE_BUCKET}/${storagePath}`,
    {
      method: 'POST',
      headers: {
        ...headers,
        'content-type': contentType,
        'x-upsert': 'true',
      },
      body: fileBuffer,
    },
  )

  if (!uploadResponse.ok) {
    throw new Error(
      `Unable to upload ${storagePath}: ${uploadResponse.status} ${await uploadResponse.text()}`,
    )
  }
}

async function main() {
  await ensureBucket()

  const uploadTasks = getAllProductImageUploadTasks(products)

  for (const task of uploadTasks) {
    await uploadFile(task.sourceFile, task.storagePath, task.contentType)
    console.log(`Uploaded ${task.storagePath}`)
  }

  console.log(`Synced ${uploadTasks.length} product images to bucket ${PRODUCT_IMAGE_BUCKET}.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
