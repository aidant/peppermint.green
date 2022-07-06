const APU_URL = 'https://api.peppermint.green'

const request = async <T>(
  method: 'GET' | 'POST',
  path: string,
  params?: Record<string, string>,
  body?: object,
  headers?: Record<string, string>
): Promise<T> => {
  const url = new URL(path, APU_URL)

  for (const param in params) {
    url.searchParams.set(param, params[param])
  }

  const request: RequestInit = {
    method,
    headers: {
      ...headers,
      Accept: 'application/json',
    },
  }

  if (body) {
    request.body = JSON.stringify(body, null, 2)
    request.headers['Content-Type'] = 'application/json; charset=utf-8'
  }

  const response = await fetch(url.href, request)
  const json = await response.json()
  if (response.ok) {
    return json
  } else {
    throw json
  }
}

export interface Transaction {}

export const getTransactions = async (): Promise<Transaction[]> => {
  return request<Transaction[]>('GET', '/transactions')
}
