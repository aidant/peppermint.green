import { BehaviorSubject, type Observable } from 'rxjs'

const DEFAULT_USER_CURRENCY = 'AUD'
const DEFAULT_USER_PRECISION = 2

export interface UserPreferences {
  userCurrency: string
  userPrecision: number
}

export const getUserPreferences = (): UserPreferences => {
  const userCurrency = localStorage.getItem('user-currency') || DEFAULT_USER_CURRENCY
  const userPrecision = Number(localStorage.getItem('user-precision') || DEFAULT_USER_PRECISION)

  return {
    userCurrency,
    userPrecision,
  }
}

const $userPreferences = new BehaviorSubject<UserPreferences>(getUserPreferences())

export const observeUserPreferences = (): Observable<UserPreferences> => {
  return $userPreferences
}

export const setUserPreferences = ({
  userCurrency,
  userPrecision,
}: Partial<UserPreferences>): UserPreferences => {
  const currentUserCurrency = localStorage.getItem('user-currency')
  if (
    userCurrency &&
    userCurrency !== currentUserCurrency &&
    userCurrency !== DEFAULT_USER_CURRENCY
  ) {
    localStorage.setItem('user-currency', userCurrency)
  }

  const currentUserPrecision = localStorage.getItem('user-precision')
  if (
    userPrecision &&
    `${userPrecision}` !== currentUserPrecision &&
    userPrecision !== DEFAULT_USER_PRECISION
  ) {
    localStorage.setItem('user-precision', `${userPrecision}`)
  }

  const userPreferences: UserPreferences = {
    userCurrency: userCurrency || DEFAULT_USER_CURRENCY,
    userPrecision: userPrecision || DEFAULT_USER_PRECISION,
  }
  $userPreferences.next(userPreferences)
  return userPreferences
}
