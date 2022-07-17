import { openDB as createDatabase, type DBSchema as DatabaseSchema } from 'idb'

export interface Category {
  categoryId: string

  categoryTitle: string
}

export interface TransactionCategory {
  categoryId: string
  transactionId: string
}

interface CategorySchema extends DatabaseSchema {
  categories: {
    key: string
    value: Category
  }
}

const db = await createDatabase<CategorySchema>('peppermint.green#categories', 1, {
  upgrade(db) {
    const categoriesStore = db.createObjectStore('categories', { keyPath: 'categoryId' })
  },
})

export const createCategory = async (category: Omit<Category, 'categoryId'>): Promise<Category> => {
  const value = { categoryId: crypto.randomUUID(), ...category }
  await db.add('categories', value)
  return value
}
