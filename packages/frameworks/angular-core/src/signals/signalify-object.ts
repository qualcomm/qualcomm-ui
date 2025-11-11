import {computed, signal, type Signal, untracked} from "@angular/core"

/**
 * Converts an object's function properties to computed signals.
 */
export function signalifyObject<T extends Record<string, any>>(
  someObject: T,
): T {
  const objectSignal = signal<T>(someObject)

  return new Proxy(objectSignal, {
    apply() {
      return objectSignal()
    },
    get(target: any, property: any): any {
      if (target[property]) {
        return target[property]
      }
      const untrackedObject: any = untracked(objectSignal)
      const maybeFn = untrackedObject[property]
      if (typeof maybeFn === "function") {
        Object.defineProperty(target, property, {
          configurable: true,
          enumerable: true,
          value: toComputed(objectSignal, maybeFn),
        })
        return target[property]
      }
      return (target[property] = untrackedObject[property])
    },
    getOwnPropertyDescriptor() {
      return {
        configurable: true,
        enumerable: true,
      }
    },
    has(_, prop: string) {
      return !!untracked(objectSignal)[prop]
    },
    ownKeys() {
      return Reflect.ownKeys(untracked(objectSignal))
    },
  })
}

/**
 * Since we cannot automatically detect the parameters of accessors, we will wrap
 * all accessors in a cached function. This function will wrap a computed value that
 * returns its result based on the given parameters.
 */
function toComputed(signal: Signal<any>, fn: Function) {
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
