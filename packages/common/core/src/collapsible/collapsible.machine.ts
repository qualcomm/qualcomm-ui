import {getEventTarget, nextTick, raf, setStyle} from "@qualcomm-ui/dom/query"
import {isDefined} from "@qualcomm-ui/utils/guard"
import {createMachine, type MachineConfig} from "@qualcomm-ui/utils/machine"

import type {CollapsibleSchema} from "./collapsible.types"
import {domEls} from "./internal"

export const collapsibleMachine: MachineConfig<CollapsibleSchema> =
  createMachine<CollapsibleSchema>({
    actions: {
      cleanupNode: ({refs}) => {
        refs.set("stylesRef", null)
      },
      clearInitial: ({context}) => {
        context.set("initial", false)
      },
      computeSize: ({context, refs, scope}) => {
        refs.get("cleanup")?.()

        const rafCleanup = raf(() => {
          const contentEl = domEls.content(scope)
          if (!contentEl) {
            return
          }

          const hidden = contentEl.hidden

          // block any animations/transitions so the element renders at its full
          // dimensions
          contentEl.style.animationName = "none"
          contentEl.style.animationDuration = "0s"
          contentEl.hidden = false

          const rect = contentEl.getBoundingClientRect()

          context.set("size", {height: rect.height, width: rect.width})

          // kick off any animations/transitions that were originally set up if it
          // isn't the initial mount
          if (context.get("initial")) {
            contentEl.style.animationName = ""
            contentEl.style.animationDuration = ""
          }
          contentEl.hidden = hidden
        })

        refs.set("cleanup", rafCleanup)
      },
      invokeOnClose: ({prop}) => {
        prop("onOpenChange")?.(false)
      },

      invokeOnExitComplete: ({prop}) => {
        prop("onExitComplete")?.()
      },

      invokeOnOpen: ({prop}) => {
        prop("onOpenChange")?.(true)
      },

      measureSize: ({context, scope}) => {
        const contentEl = domEls.content(scope)
        if (!contentEl) {
          return
        }
        const {height, width} = contentEl.getBoundingClientRect()
        context.set("size", {height, width})
      },

      setInitial: ({context, flush}) => {
        flush(() => {
          context.set("initial", true)
        })
      },

      syncSsr: ({action, context}) => {
        action(["measureSize"])
        raf(() => context.set("ssr", false))
      },

      toggleVisibility: ({prop, send}) => {
        send({type: prop("open") ? "controlled.open" : "controlled.close"})
      },
    },
    context({bindable}) {
      return {
        initial: bindable(() => ({
          defaultValue: false,
        })),
        size: bindable(() => ({
          defaultValue: {height: 0, width: 0},
          sync: true,
        })),
        ssr: bindable(() => ({
          defaultValue: true,
        })),
      }
    },
    effects: {
      trackEnterAnimation: ({scope, send}) => {
        let cleanup: VoidFunction | undefined

        const rafCleanup = raf(() => {
          const contentEl = domEls.content(scope)
          if (!contentEl) {
            return
          }

          // if there's no animation, send ANIMATION.END immediately
          const animationName = getComputedStyle(contentEl).animationName
          const hasNoAnimation = !animationName || animationName === "none"

          if (hasNoAnimation) {
            send({type: "animation.end"})
            return
          }

          const onEnd = (event: AnimationEvent) => {
            const target = getEventTarget<Element>(event)
            if (target === contentEl) {
              send({type: "animation.end"})
            }
          }

          contentEl.addEventListener("animationend", onEnd)

          cleanup = () => {
            contentEl.removeEventListener("animationend", onEnd)
          }
        })

        return () => {
          rafCleanup()
          cleanup?.()
        }
      },

      trackExitAnimation: ({scope, send}) => {
        let cleanup: VoidFunction | undefined

        const rafCleanup = raf(() => {
          const contentEl = domEls.content(scope)
          if (!contentEl) {
            return
          }

          // if there's no animation, send ANIMATION.END immediately
          const animationName = getComputedStyle(contentEl).animationName
          const hasNoAnimation = !animationName || animationName === "none"

          if (hasNoAnimation) {
            send({type: "animation.end"})
            return
          }

          const onEnd = (event: AnimationEvent) => {
            const target = getEventTarget<Element>(event)
            if (target === contentEl) {
              send({type: "animation.end"})
            }
          }

          contentEl.addEventListener("animationend", onEnd)
          const restoreStyles = setStyle(contentEl, {
            animationFillMode: "forwards",
          })
          cleanup = () => {
            contentEl.removeEventListener("animationend", onEnd)
            nextTick(() => restoreStyles())
          }
        })

        return () => {
          rafCleanup()
          cleanup?.()
        }
      },
    },
    exitActions: ["clearInitial", "cleanupNode"],
    guards: {
      isOpenControlled: ({prop}) => isDefined(prop("open")),
    },
    ids({bindableId}) {
      return {
        content: bindableId(),
        trigger: bindableId(),
      }
    },
    initialActions: ["syncSsr"],
    initialState({prop}) {
      const open = prop("open") || prop("defaultOpen")
      return open ? "open" : "closed"
    },
    props({props}) {
      return {dir: "ltr", ...props}
    },
    refs() {
      return {
        cleanup: undefined,
        stylesRef: undefined,
      }
    },
    states: {
      closed: {
        on: {
          "controlled.open": {
            target: "open",
          },
          open: [
            {
              actions: ["invokeOnOpen"],
              guard: "isOpenControlled",
            },
            {
              actions: ["setInitial", "computeSize", "invokeOnOpen"],
              target: "open",
            },
          ],
        },
      },

      closing: {
        effects: ["trackExitAnimation"],
        on: {
          "animation.end": {
            actions: ["invokeOnExitComplete", "clearInitial"],
            target: "closed",
          },
          close: [
            {
              actions: ["invokeOnExitComplete"],
              guard: "isOpenControlled",
            },
            {
              actions: ["setInitial", "computeSize", "invokeOnExitComplete"],
              target: "closed",
            },
          ],
          "controlled.close": {
            target: "closed",
          },
          "controlled.open": {
            target: "open",
          },
          open: [
            {
              actions: ["invokeOnOpen"],
              guard: "isOpenControlled",
            },
            {
              actions: ["setInitial", "invokeOnOpen"],
              target: "open",
            },
          ],
        },
      },

      open: {
        effects: ["trackEnterAnimation"],
        on: {
          "animation.end": {
            actions: ["clearInitial"],
          },
          close: [
            {
              actions: ["invokeOnClose"],
              guard: "isOpenControlled",
            },
            {
              actions: ["setInitial", "computeSize", "invokeOnClose"],
              target: "closing",
            },
          ],
          "controlled.close": {
            target: "closing",
          },
          "size.measure": {
            actions: ["measureSize"],
          },
        },
      },
    },
    watch({action, prop, track}) {
      track([() => prop("open")], () => {
        if (prop("forceMeasureOnOpen")) {
          action(["measureSize"])
        }
        action(["setInitial", "computeSize", "toggleVisibility"])
      })
    },
  })
