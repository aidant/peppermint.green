import { openDB as createDatabase, type DBSchema as DatabaseSchema } from 'idb'

export interface UserPreferences {
  userCurrency: string
  userScale: number
}

export interface Account {
  accountId: string

  accountTitle: string
  accountOffsetAmount: number
  accountOffsetScale: number
}

export interface Transaction {
  transactionId: string
  transactionDate: Date

  transactionTitle: string
  transactionDescription: string
  transactionDisplayAmount: string

  transactionCurrency: string
  transactionDirection: 'in' | 'out'
  transactionAmount: number
  transactionScale: number

  accountId: string
}

export interface Category {
  categoryId: string

  categoryTitle: string
}

export interface TransactionCategory {
  categoryId: string
  transactionId: string
}

export interface CurrencyConversion {
  conversionId: string
  conversionDate: Date

  conversionCurrencySource: string
  conversionCurrencyTarget: string
  conversionRate: number
  conversionScale: number
}

interface PeppermintGreenSchema extends DatabaseSchema {
  accounts: {
    key: string
    value: Account
  }
  transactions: {
    key: string
    value: Transaction
    indexes: {
      'by-date': string
      'by-date-and-account': [string, string]
      'by-account': string
    }
  }
  categories: {
    key: string
    value: Category
  }
  'currency-conversions': {
    key: string
    value: CurrencyConversion
    indexes: {
      'by-date': string
      'by-source': string
      'by-target': string
    }
  }
}

const db = await createDatabase<PeppermintGreenSchema>('peppermint.green', 1, {
  upgrade(db) {
    const accountsStore = db.createObjectStore('accounts', { keyPath: 'accountId' })
    const transactionStore = db.createObjectStore('transactions', { keyPath: 'transactionId' })
    transactionStore.createIndex('by-date', 'transactionDate')
    transactionStore.createIndex('by-date-and-account', ['transactionDate', 'accountId'])
    transactionStore.createIndex('by-account', 'accountId')
    const categoriesStore = db.createObjectStore('categories', { keyPath: 'categoryId' })
    const currencyConversionsStore = db.createObjectStore('currency-conversions', {
      keyPath: 'conversionId',
    })
    currencyConversionsStore.createIndex('by-date', 'conversionDate')
    currencyConversionsStore.createIndex('by-source', 'conversionCurrencySource')
    currencyConversionsStore.createIndex('by-target', 'conversionCurrencyTarget')
  },
})

/*
  User Preferences
*/

const DEFAULT_USER_CURRENCY = 'AUD'
const DEFAULT_USER_SCALE = 2

export const getUserPreferences = async (): Promise<UserPreferences> => {
  const userCurrency = localStorage.getItem('user-currency') || DEFAULT_USER_CURRENCY
  const userScale = Number(localStorage.getItem('user-scale') || DEFAULT_USER_SCALE)

  return {
    userCurrency,
    userScale,
  }
}

export const setUserPreferences = async (
  userPreferences: Partial<UserPreferences>
): Promise<UserPreferences> => {
  if (userPreferences.userCurrency) {
    localStorage.setItem('user-currency', userPreferences.userCurrency)
  }

  if (userPreferences.userScale) {
    localStorage.setItem('user-scale', `${userPreferences.userScale}`)
  }

  return {
    userCurrency: userPreferences.userCurrency || DEFAULT_USER_CURRENCY,
    userScale: userPreferences.userScale || DEFAULT_USER_SCALE,
  }
}

/*
  Accounts
*/

export const createAccount = async (account: Omit<Account, 'accountId'>): Promise<Account> => {
  const value = { accountId: crypto.randomUUID(), ...account }
  await db.add('accounts', value)
  return value
}

export const getAccounts = async (): Promise<Account[]> => {
  return db.getAll('accounts')
}

export const updateAccount = async (account: Account): Promise<Account> => {
  await db.put('accounts', account)
  return account
}

export const deleteAccount = async (accountId: string): Promise<void> => {
  await db.delete('accounts', accountId)
}

/*
  Transactions
*/

export const createTransaction = async (
  transaction: Omit<Transaction, 'transactionId'>
): Promise<Transaction> => {
  const value = { transactionId: crypto.randomUUID(), ...transaction }
  await db.add('transactions', value)
  return value
}

export interface TransactionFilter {
  accountId?: string

  dateRangeStart?: Date
  dateRangeEnd?: Date
}

export const getTransactions = async function* ({
  accountId,
  dateRangeStart,
  dateRangeEnd,
}: TransactionFilter): AsyncGenerator<Transaction, void, unknown> {
  const tx = db
    .transaction('transactions', 'readonly', { durability: 'strict' })
    .store.index('by-date-and-account')

  for await (const cursor of tx.iterate(
    IDBKeyRange.bound([dateRangeStart, accountId], [dateRangeEnd, accountId])
  )) {
    yield cursor.value
  }
}

/*
  Categories
*/

export const createCategory = async (category: Omit<Category, 'categoryId'>): Promise<Category> => {
  const value = { categoryId: crypto.randomUUID(), ...category }
  await db.add('categories', value)
  return value
}

/*
  Currency Conversions
*/

export const createCurrencyConversion = async (
  currencyConversion: Omit<CurrencyConversion, 'conversionId'>
): Promise<CurrencyConversion> => {
  const value = { conversionId: crypto.randomUUID(), ...currencyConversion }
  await db.add('currency-conversions', value)
  return value
}
