import {runIfFn} from "@qualcomm-ui/utils/functions"
import {isDefined} from "@qualcomm-ui/utils/guard"
import {compact} from "@qualcomm-ui/utils/object"
import {warn} from "@qualcomm-ui/utils/warning"

import type {
  ToastApiProps,
  ToasterCreateOptions,
  ToastOptions,
  ToastPromiseOptions,
  ToastStore,
} from "./toast.types"

let id = 0
export function getToastUuid(): string {
  id++
  return id.toString(36)
}

const withDefaults = <T extends object, D extends Partial<T>>(
  options: T,
  defaults: D,
): T & Required<D> => {
  return {...defaults, ...compact(options as any)}
}

export function createToastStore<V = string>(
  props: ToasterCreateOptions,
): ToastStore<V> {
  const attrs = withDefaults(props, {
    gap: 16,
    max: 12,
    offsets: "1rem",
    overlap: false,
    pauseOnPageIdle: true,
    placement: "bottom-end",
    removeDelay: 200,
  })

  const subscribers: Array<(...args: any[]) => void> = []
  let toasts: Partial<ToastApiProps<V>>[] = []
  const dismissedToasts = new Set<string>()
  let toastQueue: Partial<ToastApiProps<V>>[] = []

  const subscribe = (subscriber: (...args: any[]) => void) => {
    subscribers.push(subscriber)
    return () => {
      const index = subscribers.indexOf(subscriber)
      subscribers.splice(index, 1)
    }
  }

  const publish = (data: Partial<ToastApiProps<V>>) => {
    subscribers.forEach((subscriber) => subscriber(data))
    return data
  }

  const addToast = (data: Partial<ToastApiProps<V>>) => {
    if (toasts.length >= attrs.max) {
      toastQueue.push(data)
      return
    }
    publish(data)
    toasts.unshift(data)
  }

  const processQueue = () => {
    while (toastQueue.length > 0 && toasts.length < attrs.max) {
      const nextToast = toastQueue.shift()
      if (nextToast) {
        publish(nextToast)
        toasts.unshift(nextToast)
      }
    }
  }

  const create = (data: ToastOptions<V>) => {
    const id = data.id ?? `toast:${getToastUuid()}`
    const exists = toasts.find((toast) => toast.id === id)

    if (dismissedToasts.has(id)) {
      dismissedToasts.delete(id)
    }

    if (exists) {
      toasts = toasts.map((toast) => {
        if (toast.id === id) {
          return publish({...toast, ...data, id})
        }

        return toast
      })
    } else {
      addToast({
        closable: isDefined(data.closable) ? data.closable : true,
        duration: attrs.duration,
        id,
        removeDelay: attrs.removeDelay,
        type: "info",
        ...data,
        gap: attrs.gap,
        stacked: !attrs.overlap,
      })
    }

    return id
  }

  const remove = (id?: string) => {
    dismissedToasts.add(id!)

    if (!id) {
      toasts.forEach((toast) => {
        subscribers.forEach((subscriber) =>
          subscriber({dismiss: true, id: toast.id}),
        )
      })
      toasts = []
      toastQueue = []
    } else {
      subscribers.forEach((subscriber) => subscriber({dismiss: true, id}))
      toasts = toasts.filter((toast) => toast.id !== id)
      processQueue()
    }
    return id
  }

  const getVisibleToasts = () => {
    return toasts.filter((toast) => !dismissedToasts.has(toast.id!))
  }

  const getCount = () => {
    return toasts.length
  }

  const promise = <T>(
    promise: Promise<T> | (() => Promise<T>),
    options: ToastPromiseOptions<V>,
    shared: Omit<ToastOptions<V>, "type"> = {},
  ) => {
    if (!options || !options.loading) {
      warn(
        "[@qualcomm-ui/core/toast] toaster.promise() requires at least a 'loading' option to be specified",
      )
      return
    }

    const id = create({
      ...shared,
      ...options.loading,
      promise,
      type: "loading",
    })

    let removable = true
    let result: ["resolve", T] | ["reject", unknown]

    const prom = runIfFn(promise)
      .then(async (response: any) => {
        result = ["resolve", response]
        if (isHttpResponse(response) && !response.ok) {
          removable = false
          const errorOptions = options.error?.(response as T)
          create({...shared, ...errorOptions, id, type: "danger"})
        } else if (options.success !== undefined) {
          removable = false
          const successOptions = options.success?.(response)
          create({...shared, ...successOptions, id, type: "success"})
        }
      })
      .catch(async (error) => {
        result = ["reject", error]
        if (options.error !== undefined) {
          removable = false
          const errorOptions = options.error?.(error)
          create({...shared, ...errorOptions, id, type: "danger"})
        }
      })
      .finally(() => {
        if (removable) {
          remove(id)
        }
        options.finally?.()
      })

    const unwrap = () =>
      new Promise<T>((resolve, reject) =>
        prom
          .then(() =>
            result[0] === "reject" ? reject(result[1]) : resolve(result[1]),
          )
          .catch(reject),
      )

    return {id, unwrap}
  }

  function update(id: string, data: Omit<ToastOptions<V>, "id">) {
    return create({id, ...data})
  }

  const pause = (id?: string) => {
    if (id != null) {
      toasts = toasts.map((toast) => {
        if (toast.id === id) {
          return publish({...toast, message: "PAUSE"})
        }
        return toast
      })
    } else {
      toasts = toasts.map((toast) => publish({...toast, message: "PAUSE"}))
    }
  }

  const resume = (id?: string) => {
    if (id != null) {
      toasts = toasts.map((toast) => {
        if (toast.id === id) {
          return publish({...toast, message: "RESUME"})
        }
        return toast
      })
    } else {
      toasts = toasts.map((toast) => publish({...toast, message: "RESUME"}))
    }
  }

  const dismiss = (id?: string) => {
    if (id != null) {
      toasts = toasts.map((toast) => {
        if (toast.id === id) {
          return publish({...toast, message: "DISMISS"})
        }
        return toast
      })
    } else {
      toasts = toasts.map((toast) => publish({...toast, message: "DISMISS"}))
    }
  }

  const isVisible = (id: string) => {
    return !dismissedToasts.has(id) && !!toasts.find((toast) => toast.id === id)
  }

  const isDismissed = (id: string) => {
    return dismissedToasts.has(id)
  }

  const expand = () => {
    toasts = toasts.map((toast) => publish({...toast, stacked: true}))
  }

  const collapse = () => {
    toasts = toasts.map((toast) => publish({...toast, stacked: false}))
  }

  return {
    attrs,
    collapse,
    create,
    dismiss,
    expand,
    getCount,
    getVisibleToasts,
    isDismissed,
    isVisible,
    pause,
    promise,
    remove,
    resume,
    subscribe,
    update,
  }
}

const isHttpResponse = (data: any): data is Response => {
  return (
    data &&
    typeof data === "object" &&
    "ok" in data &&
    typeof data.ok === "boolean" &&
    "status" in data &&
    typeof data.status === "number"
  )
}
