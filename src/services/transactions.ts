import { openDB as createDatabase, type DBSchema as DatabaseSchema } from 'idb'
import { combineLatest, from, of, scan, switchMap, type Observable } from 'rxjs'
import { normalizeValue } from '../api'
import { createObservableNotification } from './create-observable-notification'
import { getCurrencyConversion } from './currency-conversions'
import { observeUserPreferences } from './user-preferences'

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

interface TransactionSchema extends DatabaseSchema {
  transactions: {
    key: string
    value: Transaction
    indexes: {
      'by-date': string
      'by-date-and-account': [transactionDate: string, accountId: string]
      'by-account': string
    }
  }
}

export const [observeTransactionsNotification, notifyTransactions] = createObservableNotification(
  'peppermint.green#transactions'
)

const db = await createDatabase<TransactionSchema>('peppermint.green#transactions', 1, {
  upgrade(db) {
    const transactionStore = db.createObjectStore('transactions', { keyPath: 'transactionId' })
    transactionStore.createIndex('by-date', 'transactionDate')
    transactionStore.createIndex('by-date-and-account', ['transactionDate', 'accountId'])
    transactionStore.createIndex('by-account', 'accountId')
  },
})

export const createTransaction = async (
  transaction: Omit<Transaction, 'transactionId'>
): Promise<Transaction> => {
  const value = { transactionId: crypto.randomUUID(), ...transaction }
  await db.add('transactions', value)
  notifyTransactions(`transactions:${value.transactionId}`)
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

export const observeTransactions = (
  filter: TransactionFilter
): Observable<{ transactions: Record<string, Transaction>; updated: string[] }> => {
  return combineLatest([
    observeUserPreferences(),
    observeTransactionsNotification('transactions:'),
  ]).pipe(
    switchMap(([$userPreferences]) =>
      combineLatest({
        userPreferences: of($userPreferences),
        transaction: from(getTransactions(filter)),
      })
    ),
    switchMap(async ({ userPreferences, transaction }) => {
      let multiplier: number | undefined

      if (transaction.transactionCurrency !== userPreferences.userCurrency) {
        const currencyConversion = await getCurrencyConversion({
          conversionDate: transaction.transactionDate,
          conversionCurrencySource: transaction.transactionCurrency,
          conversionCurrencyTarget: userPreferences.userCurrency,
        })

        multiplier = currencyConversion.conversionRate
      }

      return normalizeValue<'transactionAmount', 'transactionScale', Transaction>(transaction, {
        valueProperty: 'transactionAmount',
        scaleProperty: 'transactionScale',
        scale: 0,
        multiplier,
        precision: userPreferences.userPrecision,
      })
    }),
    scan<Transaction, { transactions: Record<string, Transaction>; updated: string[] }>(
      (value, transaction) => {
        return {
          transactions: { ...value.transactions, [transaction.transactionId]: transaction },
          updated: [transaction.transactionId],
        }
      },
      { transactions: {}, updated: [] }
    )
  )
}
