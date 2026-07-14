import { requireAdmin } from '@/lib/auth'
import Link from 'next/link'
import { getComboBuilderData } from '@/features/combos/queries'
import { createCombo } from '@/features/combos/actions'
import ComboBuilder from '@/features/combos/components/ComboBuilder'

export default async function AdminNewComboPage() {
  await requireAdmin()

  const { products: productList, categories: categoryList } = await getComboBuilderData()

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link className="text-sm text-stone-500 hover:text-stone-700" href="/admin/combos">
          ← Combo
        </Link>
        <h1 className="text-2xl font-black text-stone-900">Tạo combo thuốc</h1>
      </div>

      <ComboBuilder action={createCombo} categories={categoryList} products={productList} />
    </div>
  )
}
