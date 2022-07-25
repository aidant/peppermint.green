import { openDB as createDatabase, type DBSchema as DatabaseSchema } from 'idb/with-async-ittr'
import ease, { presets } from 'rx-ease'
import {
  animationFrameScheduler,
  combineLatest,
  from,
  map,
  of,
  scan,
  switchMap,
  throttleTime,
  type Observable,
} from 'rxjs'
import { createObservableNotification } from './create-observable-notification'
import { getCurrencyConversion } from './currency-conversions'
import { normalizeValue } from './normalize-value'
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
  const store = db.transaction('transactions', 'readonly', { durability: 'strict' }).store

  let tx

  if (accountId && (dateRangeStart || dateRangeEnd)) {
    tx = store.index('by-date-and-account')
  } else if (accountId) {
    tx = store.index('by-account')
  } else if (dateRangeStart || dateRangeEnd) {
    tx = store.index('by-date')
  } else {
    tx = store
  }

  let key = null

  if (accountId && (dateRangeStart || dateRangeEnd)) {
    key =
      dateRangeStart && dateRangeEnd
        ? IDBKeyRange.bound([dateRangeStart, accountId], [dateRangeEnd, accountId])
        : dateRangeStart
        ? IDBKeyRange.lowerBound([dateRangeStart, accountId])
        : IDBKeyRange.upperBound([dateRangeEnd, accountId])
  } else if (accountId) {
    key = IDBKeyRange.only(accountId)
  } else if (dateRangeStart || dateRangeEnd) {
    key =
      dateRangeStart && dateRangeEnd
        ? IDBKeyRange.bound(dateRangeStart, dateRangeEnd)
        : dateRangeStart
        ? IDBKeyRange.lowerBound(dateRangeStart)
        : IDBKeyRange.upperBound(dateRangeEnd)
  }

  for await (const cursor of tx.iterate(key)) {
    yield cursor.value
  }
}

export const observeTransactions = (filter: TransactionFilter = {}): Observable<Transaction> => {
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
    })
  )
}

export const observeTransactionsSummary = (
  filter: TransactionFilter = {}
): Observable<{ transactions: Record<string, Transaction>; updated: string[] }> => {
  return observeTransactions(filter).pipe(
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

export const observeTransactionsAmount = (
  filter: TransactionFilter = {}
): Observable<{
  transactionAmount: number
  transactionScale: number
}> => {
  return observeTransactions(filter).pipe(
    scan<Transaction, number>((value, transaction) => {
      return value + transaction.transactionDirection === 'out'
        ? -transaction.transactionAmount
        : transaction.transactionAmount
    }, 0),
    ease(...(presets.stiff as [number, number])),
    throttleTime(1, animationFrameScheduler),
    map((value) => ({ transactionAmount: value, transactionScale: 0 }))
  )
}

export class TransactionNormalizerStream extends TransformStream<object, object> {
  constructor() {
    super({
      transform(object: any, controller) {
        const transaction: Omit<Transaction, 'transactionId'> = {
          transactionDate: new Date(object['Date']),

          transactionTitle: object['Merchant Name'],
          transactionDescription: object['Transaction Details'],
          transactionDisplayAmount: object['Amount'],

          transactionCurrency: 'AUD',
          transactionDirection: object['Amount'].startsWith('-') ? 'out' : 'in',
          transactionAmount: Number(object['Amount'].replace(/[^0-9]/g, '')),
          transactionScale: object['Amount'].replace(/[^0-9.]/g, '').split('.')[1].length,

          accountId: object['Account Number'],
        }
        controller.enqueue(transaction)
      },
    })
  }
}

export class TransactionWritableStream extends WritableStream<Transaction> {
  constructor() {
    super({
      async write(transaction, controller) {
        await createTransaction(transaction)
      },
    })
  }
}
