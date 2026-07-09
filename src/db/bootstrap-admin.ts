import { existsSync } from 'node:fs'

// Tạo (hoặc nâng quyền) tài khoản admin đầu tiên.
// Cách dùng: đặt ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME trong .env.local rồi chạy:
//   npm run admin:create
async function bootstrapAdmin() {
  if (existsSync('.env.local')) {
    process.loadEnvFile?.('.env.local')
  } else if (existsSync('.env')) {
    process.loadEnvFile?.('.env')
  }

  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  const fullName = process.env.ADMIN_NAME ?? 'Quản trị viên'

  if (!email || !password) {
    throw new Error('Cần đặt ADMIN_EMAIL và ADMIN_PASSWORD (trong .env.local hoặc biến môi trường).')
  }

  const [{ db }, { users }, { eq }, { hashPassword }] = await Promise.all([
    import('../lib/db.ts'),
    import('./schema.ts'),
    import('drizzle-orm'),
    import('../lib/password.ts'),
  ])

  const passwordHash = await hashPassword(password)
  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1)

  if (existing[0]) {
    await db
      .update(users)
      .set({ role: 'admin', isActive: true, passwordHash, updatedAt: new Date() })
      .where(eq(users.email, email))
    console.log(`Đã nâng quyền admin (và đặt lại mật khẩu) cho: ${email}`)
  } else {
    await db.insert(users).values({ email, passwordHash, fullName, role: 'admin' })
    console.log(`Đã tạo admin mới: ${email}`)
  }
}

bootstrapAdmin()
  .then(() => {
    console.log('Bootstrap admin completed.')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Bootstrap admin failed.')
    console.error(error)
    process.exit(1)
  })
