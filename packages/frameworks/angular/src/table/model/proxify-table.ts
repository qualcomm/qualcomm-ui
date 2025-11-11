import {computed, type Signal, untracked} from "@angular/core"

import type {TableInstance} from "@qualcomm-ui/core/table"

type TableSignal<T> = TableInstance<T> & Signal<TableInstance<T>>

export function proxifyTable<T>(
  tableSignal: Signal<TableInstance<T>>,
): TableInstance<T> & Signal<TableInstance<T>> {
  const internalState = tableSignal as TableSignal<T>

  return new Proxy(internalState, {
    apply() {
      return tableSignal()
    },
    get(target, property: keyof TableInstance<T>): any {
      if (target[property]) {
        return target[property]
      }
      const table = untracked(tableSignal)
      /**
       * Attempt to convert all accessors into computed ones, excluding handlers as
       * they do not retain any reactive value
       */
      if (property.startsWith("get") && !property.endsWith("Handler")) {
        const maybeFn = table[property] as Function | never
        if (typeof maybeFn === "function") {
          Object.defineProperty(target, property, {
            configurable: true,
            enumerable: true,
            value: toComputed(tableSignal, maybeFn),
          })
          return target[property]
        }
      }
      // @ts-expect-error
      return (target[property] = table[property])
    },
    getOwnPropertyDescriptor() {
      return {
        configurable: true,
        enumerable: true,
      }
    },
    has(_, prop: keyof TableInstance<T>) {
      return !!untracked(tableSignal)[prop]
    },
    ownKeys() {
      return Reflect.ownKeys(untracked(tableSignal))
    },
  })
}

/**
 * Here we'll handle all types of accessors:
 * - 0 argument -> table.getCanNextPage()
 * - 0~1 arguments -> table.getIsSomeRowsPinned(position?)
 * - 1 required argument -> table.getColumn(columnId)
 * - 1+ argument -> table.getRow(id, searchAll?)
 *
 * Since we are not able to detect the accessor parameters, we'll wrap all accessors
 * into a cached function wrapping a computed that return its value based on the
 * given parameters.
 */
function toComputed<T>(signal: Signal<TableInstance<T>>, fn: Function) {
  const hasArgs = fn.length > 0
  if (!hasArgs) {
    return computed(() => {
      void signal()
      return fn()
    })
  }

  const computedCache: Record<string, Signal<unknown>> = {}

  return (...argsArray: any[]) => {
    const serializedArgs = serializeArgs(...argsArray)
    if (computedCache.hasOwnProperty(serializedArgs)) {
      return computedCache[serializedArgs]?.()
    }
    const computedSignal = computed(() => {
      void signal()
      return fn(...argsArray)
    })

    computedCache[serializedArgs] = computedSignal

    return computedSignal()
  }
}

function serializeArgs(...args: any[]) {
  return JSON.stringify(args)
}
