import {trackDismissableBranch} from "@qualcomm-ui/dom/dismissable"
import {addDomEvent} from "@qualcomm-ui/dom/query"
import {createMachine, type MachineConfig} from "@qualcomm-ui/utils/machine"

import {getRegionEl} from "./internal"
import {getToastUuid} from "./toast.store"
import type {ToastGroupSchema} from "./toast.types"

export const toastGroupMachine: MachineConfig<ToastGroupSchema> =
  createMachine<ToastGroupSchema>({
    actions: {
      clearDismissableBranch({refs}) {
        refs.get("dismissableCleanup")?.()
      },
      clearLastFocusedEl({refs}) {
        if (!refs.get("lastFocusedEl")) {
          return
        }
        refs.get("lastFocusedEl")?.focus({preventScroll: true})
        refs.set("lastFocusedEl", null)
        refs.set("isFocusWithin", false)
      },
      collapsedIfEmpty({computed, send}) {
        if (!computed("overlap") || computed("count") > 1) {
          return
        }
        send({type: "REGION.OVERLAP"})
      },
      collapseToasts({prop}) {
        prop("store").collapse()
      },
      expandToasts({prop}) {
        prop("store").expand()
      },
      focusRegionEl({computed, scope}) {
        queueMicrotask(() => {
          getRegionEl(scope, computed("placement"))?.focus()
        })
      },
      pauseToasts({prop}) {
        prop("store").pause()
      },
      removeHeight({context, event}) {
        if (event?.id == null) {
          return
        }
        queueMicrotask(() => {
          context.set("heights", (heights) =>
            heights.filter((height) => height.id !== event.id),
          )
        })
      },
      removeToast({event, prop}) {
        prop("store").remove(event.id)
      },
      restoreLastFocusedEl({refs}) {
        if (!refs.get("lastFocusedEl")) {
          return
        }
        refs.get("lastFocusedEl")?.focus({preventScroll: true})
        refs.set("lastFocusedEl", null)
        refs.set("isFocusWithin", false)
      },
      resumeToasts({prop}) {
        prop("store").resume()
      },
      setDismissableBranch({computed, context, refs, scope}) {
        const toasts = context.get("toasts")
        const placement = computed("placement")
        const hasToasts = toasts.length > 0

        if (!hasToasts) {
          refs.get("dismissableCleanup")?.()
          return
        }

        if (hasToasts && refs.get("dismissableCleanup")) {
          return
        }

        //  mark toast as a dismissable branch
        //  so that interacting with them will not close dismissable layers
        const groupEl = () => getRegionEl(scope, placement)
        const cleanup = trackDismissableBranch(groupEl, {defer: true})
        refs.set("dismissableCleanup", cleanup)
      },
      setLastFocusedEl({event, refs}) {
        if (refs.get("isFocusWithin") || !event.target) {
          return
        }
        refs.set("isFocusWithin", true)
        refs.set("lastFocusedEl", event.target)
      },
    },

    computed: {
      count: ({context}) => context.get("toasts").length,
      overlap: ({prop}) => prop("store").attrs.overlap,
      placement: ({prop}) => prop("store").attrs.placement,
    },

    context({bindable}) {
      return {
        heights: bindable<any[]>(() => ({
          defaultValue: [],
          sync: true,
        })),
        toasts: bindable<any[]>(() => ({
          defaultValue: [],
          hash: (toasts) => toasts.map((t) => t.id).join(","),
          sync: true,
        })),
      }
    },

    effects: {
      subscribeToStore({context, prop}) {
        return prop("store").subscribe((toast) => {
          if (toast.dismiss) {
            context.set("toasts", (prev) =>
              prev.filter((t) => t.id !== toast.id),
            )
            return
          }

          context.set("toasts", (prev) => {
            const index = prev.findIndex((t) => t.id === toast.id)
            if (index !== -1) {
              return [
                ...prev.slice(0, index),
                {...prev[index], ...toast},
                ...prev.slice(index + 1),
              ]
            }
            return [toast, ...prev]
          })
        })
      },
      trackDocumentVisibility({prop, scope, send}) {
        const {pauseOnPageIdle} = prop("store").attrs
        if (!pauseOnPageIdle) {
          return
        }
        const doc = scope.getDoc()
        return addDomEvent(doc, "visibilitychange", () => {
          const isHidden = doc.visibilityState === "hidden"
          send({type: isHidden ? "PAUSE_ALL" : "RESUME_ALL"})
        })
      },
    },

    exitActions: ["clearDismissableBranch", "clearLastFocusedEl"],

    guards: {
      isOverlapping: ({computed}) => computed("overlap"),
    },

    initialEffects: ["subscribeToStore", "trackDocumentVisibility"],

    initialState({prop}) {
      return prop("store").attrs.overlap ? "overlap" : "stack"
    },

    on: {
      "REGION.BLUR": [
        {
          actions: ["collapseToasts", "resumeToasts", "restoreLastFocusedEl"],
          guard: "isOverlapping",
          target: "overlap",
        },
        {
          actions: ["resumeToasts", "restoreLastFocusedEl"],
          target: "stack",
        },
      ],
      "TOAST.PAUSE": {
        actions: ["pauseToasts"],
      },
      "TOAST.REMOVE": {
        actions: ["removeToast", "removeHeight"],
      },
    },

    props({props}) {
      return {
        dir: "ltr",
        id: getToastUuid(),
        ...props,
        store: props.store!,
      }
    },

    refs() {
      return {
        dismissableCleanup: undefined,
        isFocusWithin: false,
        lastFocusedEl: null,
      }
    },

    states: {
      overlap: {
        on: {
          "REGION.FOCUS": {
            actions: ["setLastFocusedEl", "pauseToasts", "expandToasts"],
            target: "stack",
          },
          "REGION.POINTER_ENTER": {
            actions: ["pauseToasts", "expandToasts"],
            target: "stack",
          },
          "REGION.STACK": {
            actions: ["expandToasts"],
            target: "stack",
          },
        },
      },

      stack: {
        on: {
          "REGION.FOCUS": {
            actions: ["setLastFocusedEl", "pauseToasts"],
          },
          "REGION.OVERLAP": {
            actions: ["collapseToasts"],
            target: "overlap",
          },
          "REGION.POINTER_ENTER": {
            actions: ["pauseToasts"],
          },
          "REGION.POINTER_LEAVE": [
            {
              actions: ["resumeToasts", "collapseToasts"],
              guard: "isOverlapping",
              target: "overlap",
            },
            {
              actions: ["resumeToasts"],
            },
          ],
        },
      },
    },

    watch({action, context, track}) {
      track([() => context.hash("toasts")], () => {
        queueMicrotask(() => {
          action(["collapsedIfEmpty", "setDismissableBranch"])
        })
      })
    },
  })
