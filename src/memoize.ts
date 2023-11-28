import * as TTLCache from 'ttl-cache'

type MemoizedFunctionSync<T extends any[], U> = (...args: T) => U
type MemoizedFunctionAsync<T extends any[], U> = (...args: T) => Promise<U>

const TIME_TO_LIVE = 600 // ms
const cache = new TTLCache({ ttl: TIME_TO_LIVE })

declare global {
  interface Function {
    memoize: <T extends any[], U>(this: (...args: T) => U) => MemoizedFunctionSync<T, U>
    memoizeAsync: <T extends any[], U>(this: (...args: T) => Promise<U>) => MemoizedFunctionAsync<T, U>
  }
}

Function.prototype.memoize = function <T extends any[], U>(this: (...args: T) => U): MemoizedFunctionSync<T, U> {
  return (...args: T): U => {
    const key = args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : arg)).join(',')

    let result = cache.get(key)
    if (!result) {
      result = this(...args)
      cache.set(key, result)
    }

    return result
  }
}

Function.prototype.memoizeAsync = function <T extends any[], U>(
  this: (...args: T) => Promise<U>
): MemoizedFunctionAsync<T, U> {
  return async (...args: T): Promise<U> => {
    const key = args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : arg)).join(',')

    let result = cache.get(key)
    if (!result) {
      result = await this(...args)
      cache.set(key, result)
    }

    return result
  }
}

export {}
