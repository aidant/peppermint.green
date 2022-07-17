import { openDB as createDatabase, type DBSchema as DatabaseSchema } from 'idb'

export interface Account {
  accountId: string

  accountTitle: string
  accountOffsetAmount: number
  accountOffsetScale: number
}

interface AccountSchema extends DatabaseSchema {
  accounts: {
    key: string
    value: Account
  }
}

const db = await createDatabase<AccountSchema>('peppermint.green#accounts', 1, {
  upgrade(db) {
    const accountsStore = db.createObjectStore('accounts', { keyPath: 'accountId' })
  },
})

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
