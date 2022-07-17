import { openDB as createDatabase, type DBSchema as DatabaseSchema } from 'idb'
import { switchMap, type Observable } from 'rxjs'
import { createObservableNotification } from './create-observable-notification'

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

export const [observeAccountsNotification, notifyAccounts] = createObservableNotification(
  'peppermint.green#accounts'
)

const db = await createDatabase<AccountSchema>('peppermint.green#accounts', 1, {
  upgrade(db) {
    const accountsStore = db.createObjectStore('accounts', { keyPath: 'accountId' })
  },
})

export const createAccount = async (account: Omit<Account, 'accountId'>): Promise<Account> => {
  const value = { accountId: crypto.randomUUID(), ...account }
  await db.add('accounts', value)
  notifyAccounts(`accounts:${value.accountId}`)
  return value
}

export const getAccount = async (accountId: string): Promise<Account | undefined> => {
  return db.get('accounts', accountId)
}

export const getAccounts = async (): Promise<Account[]> => {
  return db.getAll('accounts')
}

export const updateAccount = async (account: Account): Promise<Account> => {
  await db.put('accounts', account)
  notifyAccounts(`accounts:${account.accountId}`)
  return account
}

export const observeAccounts = (): Observable<Account[]> => {
  return observeAccountsNotification('accounts:').pipe(switchMap(() => getAccounts()))
}

export const observeAccount = <A extends string>(accountId: A): Observable<Account | undefined> => {
  return observeAccountsNotification(`accounts:${accountId}`).pipe(
    switchMap(() => getAccount(accountId))
  )
}
