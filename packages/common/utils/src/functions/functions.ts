import {isFunction} from "@qualcomm-ui/utils/guard"

export type MaybeFunction<T> = T | (() => T)

export type Nullable<T> = T | null | undefined

export function runIfFn<T>(
  v: T | undefined,
  ...a: T extends (...a: any[]) => void ? Parameters<T> : never
): T extends (...a: any[]) => void
  ? NonNullable<ReturnType<T>>
  : NonNullable<T> {
  const res = typeof v === "function" ? v(...a) : v
  return res ?? undefined
}

export function cast<T>(v: unknown): T {
  return v as T
}

export function identity(v: VoidFunction): void {
  return v()
}

export function noop(): void {}

export function callAll<T extends (...a: any[]) => void>(
  ...fns: (T | null | undefined)[]
) {
  return (...a: Parameters<T>): void => {
    fns.forEach(function (fn) {
      fn?.(...a)
    })
  }
}

export function match<V extends string | number = string, R = unknown>(
  key: V,
  record: Record<V, R | ((...args: any[]) => R)>,
  ...args: any[]
): R {
  if (key in record) {
    const fn = record[key]
    return isFunction(fn) ? fn(...args) : (fn as any)
  }

  const error = new Error(
    `No matching key: ${JSON.stringify(key)} in ${JSON.stringify(Object.keys(record))}`,
  )
  Error.captureStackTrace?.(error, match)

  throw error
}

export function tryCatch<R>(fn: () => R, fallback: () => R): R {
  try {
    return fn()
  } catch (error) {
    if (error instanceof Error) {
      Error.captureStackTrace?.(error, tryCatch)
    }
    return fallback?.()
  }
}

export function throttle<T extends (...args: any[]) => void>(
  fn: T,
  wait = 0,
): T {
  let lastCall = 0
  let timeout: ReturnType<typeof setTimeout> | null = null

  return ((...args: Parameters<T>) => {
    const now = Date.now()
    const timeSinceLastCall = now - lastCall

    if (timeSinceLastCall >= wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      fn(...args)
      lastCall = now
    } else if (!timeout) {
      timeout = setTimeout(() => {
        fn(...args)
        lastCall = Date.now()
        timeout = null
      }, wait - timeSinceLastCall)
    }
  }) as T
}

/**
 * Credit to MUI team @ https://mui.com
 * Safe chained function.
 *
 * Will only create a new function if needed,
 * otherwise will pass back existing functions or null.
 */
export function createChainedFunction<Args extends any[], This>(
  funcs: Array<((this: This, ...args: Args) => any) | undefined>,
  id?: string | number,
): (this: This, ...args: Args) => void {
  // @ts-ignore
  return funcs.reduce((acc, func) => {
    if (func === null || func === undefined) {
      return acc
    }

    return function chainedFunction(...args) {
      const argums = [...args] as any
      if (id && argums.indexOf(id) === -1) {
        argums.push(id)
      }
      // @ts-ignore
      acc.apply(this, argums)
      func.apply(this, argums)
    }
  }, noop)
}

/**
 * Corresponds to 10 frames at 60 Hz.
 * A few bytes payload overhead, compared to lodash/debounce which is ~3KB.
 */
export function debounce<T>(
  func: T,
  wait = 166,
): {(...args: any[]): void; clear(): void} {
  let timeout: ReturnType<typeof setTimeout>
  function debounced(...args: any[]): void {
    const later = () => {
      // @ts-ignore
      func.apply(this, args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }

  debounced.clear = () => {
    clearTimeout(timeout)
  }

  return debounced
}
