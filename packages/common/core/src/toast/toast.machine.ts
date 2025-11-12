// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {raf} from "@qualcomm-ui/dom/query"
import {ensureProps} from "@qualcomm-ui/utils/guard"
import {
  createGuards,
  createMachine,
  type Machine,
  type MachineConfig,
} from "@qualcomm-ui/utils/machine"
import {setRafTimeout} from "@qualcomm-ui/utils/timers"

import {getRootEl} from "./internal"
import type {ToastGroupSchema, ToastHeight, ToastSchema} from "./toast.types"
import {getToastDuration} from "./toast.utils"

const {not} = createGuards<ToastSchema>()

export const toastMachine: MachineConfig<ToastSchema<any>> =
  createMachine<ToastSchema>({
    actions: {
      invokeOnDismiss({event, prop}) {
        prop("onStatusChange")?.({src: event.src, status: "dismissing"})
      },

      invokeOnUnmount({prop}) {
        prop("onStatusChange")?.({status: "unmounted"})
      },

      invokeOnVisible({prop}) {
        prop("onStatusChange")?.({status: "visible"})
      },

      measureHeight({context, prop, scope}) {
        queueMicrotask(() => {
          const rootEl = getRootEl(scope)
          if (!rootEl) {
            return
          }

          const originalHeight = rootEl.style.height
          rootEl.style.height = "auto"
          const height = rootEl.getBoundingClientRect().height
          rootEl.style.height = originalHeight
          context.set("initialHeight", height)

          const item = {height, id: prop("id")}
          setHeight(prop("parent"), item)
        })
      },

      notifyParentToRemove({prop}) {
        const parent = prop("parent")
        parent.send({id: prop("id"), type: "TOAST.REMOVE"})
      },

      resetCloseTimer({context, prop, refs}) {
        refs.set("closeTimerStartTime", Date.now())
        context.set(
          "remainingTime",
          getToastDuration(prop("duration"), prop("type")),
        )
      },
      setCloseTimer({refs}) {
        refs.set("closeTimerStartTime", Date.now())
      },
      setMounted({context}) {
        raf(() => {
          context.set("mounted", true)
        })
      },
      syncRemainingTime({context, refs}) {
        context.set("remainingTime", (prev) => {
          const closeTimerStartTime = refs.get("closeTimerStartTime")
          const elapsedTime = Date.now() - closeTimerStartTime
          return prev - elapsedTime
        })
      },
    },

    computed: {
      frontmost: ({prop}) => prop("index") === 0,
      height: ({prop}) => {
        const heights = prop("parent").context.get("heights")
        const height = heights.find((height) => height.id === prop("id"))
        return height?.height ?? 0
      },
      heightBefore: ({prop}) => {
        const heights = prop("parent").context.get("heights")
        const heightIndex = heights.findIndex(
          (height) => height.id === prop("id"),
        )
        return heights.reduce((prev, curr, reducerIndex) => {
          if (reducerIndex >= heightIndex) {
            return prev
          }
          return prev + curr.height
        }, 0)
      },
      heightIndex: ({prop}) => {
        const heights = prop("parent").context.get("heights")
        return heights.findIndex((height) => height.id === prop("id"))
      },
      shouldPersist: ({prop}) =>
        prop("type") === "loading" || prop("duration") === Infinity,
      zIndex: ({prop}) => {
        const toasts = prop("parent").context.get("toasts")
        const index = toasts.findIndex((toast) => toast.id === prop("id"))
        return toasts.length - index
      },
    },

    context({bindable, prop}) {
      return {
        createdAt: bindable<number>(() => ({
          defaultValue: Date.now(),
        })),
        initialHeight: bindable<number>(() => ({
          defaultValue: 0,
        })),
        mounted: bindable<boolean>(() => ({
          defaultValue: false,
        })),
        remainingTime: bindable<number>(() => ({
          defaultValue: getToastDuration(prop("duration"), prop("type")),
        })),
      }
    },

    effects: {
      trackHeight({prop, scope}) {
        let cleanup: VoidFunction | undefined
        raf(() => {
          const rootEl = getRootEl(scope)
          if (!rootEl) {
            return
          }

          const syncHeight = () => {
            const originalHeight = rootEl.style.height
            rootEl.style.height = "auto"
            const height = rootEl.getBoundingClientRect().height
            rootEl.style.height = originalHeight

            const item = {height, id: prop("id")}
            setHeight(prop("parent"), item)
          }

          const win = scope.getWin()

          const observer = new (win as any).MutationObserver(syncHeight)
          observer.observe(rootEl, {
            characterData: true,
            childList: true,
            subtree: true,
          })

          cleanup = () => observer.disconnect()
        })

        return () => cleanup?.()
      },

      waitForDuration({computed, context, send}) {
        if (computed("shouldPersist")) {
          return
        }

        return setRafTimeout(() => {
          send({src: "timer", type: "DISMISS"})
        }, context.get("remainingTime"))
      },

      waitForNextTick({send}) {
        return setRafTimeout(() => {
          send({src: "timer", type: "SHOW"})
        }, 0)
      },

      waitForRemoveDelay({prop, send}) {
        return setRafTimeout(() => {
          send({src: "timer", type: "REMOVE"})
        }, prop("removeDelay"))
      },
    },

    guards: {
      isLoadingType: ({prop}) => prop("type") === "loading",
      shouldPersist: ({computed}) => computed("shouldPersist"),
    },

    initialState({prop}) {
      const persist =
        prop("type") === "loading" || prop("duration") === Infinity
      return persist ? "visible:persist" : "visible"
    },

    on: {
      MEASURE: {
        actions: ["measureHeight"],
      },
      UPDATE: [
        {
          actions: ["resetCloseTimer"],
          guard: "shouldPersist",
          target: "visible:persist",
        },
        {
          actions: ["resetCloseTimer"],
          target: "visible:updating",
        },
      ],
    },

    onInit: {
      actions: ["setMounted", "measureHeight", "invokeOnVisible"],
      effects: ["trackHeight"],
    },

    props({props}) {
      ensureProps(props, ["id", "type", "parent", "removeDelay"], "toast")
      return {
        closable: true,
        ...props,
        duration: getToastDuration(props.duration, props.type),
      }
    },

    refs() {
      return {
        closeTimerStartTime: Date.now(),
      }
    },

    states: {
      dismissing: {
        effects: ["waitForRemoveDelay"],
        entry: ["invokeOnDismiss"],
        on: {
          REMOVE: {
            actions: ["notifyParentToRemove"],
            target: "unmounted",
          },
        },
      },

      unmounted: {
        entry: ["invokeOnUnmount"],
      },

      visible: {
        effects: ["waitForDuration"],
        on: {
          DISMISS: {
            target: "dismissing",
          },
          PAUSE: {
            actions: ["syncRemainingTime"],
            target: "visible:persist",
          },
        },
        tags: ["visible"],
      },

      "visible:persist": {
        on: {
          DISMISS: {
            target: "dismissing",
          },
          RESUME: {
            actions: ["setCloseTimer"],
            guard: not("isLoadingType"),
            target: "visible",
          },
        },
        tags: ["visible", "paused"],
      },

      "visible:updating": {
        effects: ["waitForNextTick"],
        on: {
          SHOW: {
            target: "visible",
          },
        },
        tags: ["visible", "updating"],
      },
    },

    watch({prop, send, track}) {
      track([() => prop("message")], () => {
        const message = prop("message")
        if (message) {
          send({src: "programmatic", type: message})
        }
      })

      track([() => prop("type"), () => prop("duration")], () => {
        send({type: "UPDATE"})
      })
    },
  })

function setHeight(parent: Machine<ToastGroupSchema>, item: ToastHeight) {
  const {height, id} = item
  parent.context.set("heights", (prev) => {
    const alreadyExists = prev.find((i) => i.id === id)
    if (!alreadyExists) {
      return [{height, id}, ...prev]
    } else {
      return prev.map((i) => (i.id === id ? {...i, height} : i))
    }
  })
}
