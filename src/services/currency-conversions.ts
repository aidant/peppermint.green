import { openDB as createDatabase, type DBSchema as DatabaseSchema } from 'idb'

export interface CurrencyConversion {
  conversionId: string
  conversionDate: Date

  conversionCurrencySource: string
  conversionCurrencyTarget: string
  conversionRate: number
  conversionScale: number
}

interface CurrencyConversionSchema extends DatabaseSchema {
  'currency-conversions': {
    key: string
    value: CurrencyConversion
    indexes: {
      'by-date-and-source-and-target': [
        conversionDate: string,
        conversionCurrencySource: string,
        conversionCurrencyTarget: string
      ]
    }
  }
}

const db = await createDatabase<CurrencyConversionSchema>(
  'peppermint.green#currency-conversions',
  1,
  {
    upgrade(db) {
      const currencyConversionsStore = db.createObjectStore('currency-conversions', {
        keyPath: 'conversionId',
      })
      currencyConversionsStore.createIndex('by-date-and-source-and-target', [
        'conversionDate',
        'conversionCurrencySource',
        'conversionCurrencyTarget',
      ])
    },
  }
)

export const createCurrencyConversion = async (
  currencyConversion: Omit<CurrencyConversion, 'conversionId'>
): Promise<CurrencyConversion> => {
  const value = { conversionId: crypto.randomUUID(), ...currencyConversion }
  await db.add('currency-conversions', value)
  return value
}

export interface CurrencyConversionFilter {
  conversionDate: Date
  conversionCurrencySource: string
  conversionCurrencyTarget: string
}

export const getCurrencyConversion = async ({
  conversionDate,
  conversionCurrencySource,
  conversionCurrencyTarget,
}: CurrencyConversionFilter): Promise<CurrencyConversion> => {
  let currencyConversion = await db
    .transaction('currency-conversions', 'readonly', { durability: 'strict' })
    .store.index('by-date-and-source-and-target')
    .get(IDBKeyRange.only([conversionDate, conversionCurrencySource, conversionCurrencyTarget]))

  if (!currencyConversion) {
    // TODO: fetch from API
    throw new Error(
      `No currency conversion found for ${conversionDate} ${conversionCurrencySource} ${conversionCurrencyTarget}`
    )
  }

  return currencyConversion
}
