// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {getEventTarget, nextTick, raf, setStyle} from "@qualcomm-ui/dom/query"
import {createMachine, type MachineConfig} from "@qualcomm-ui/utils/machine"

import type {PresenceSchema} from "./presence.types"

export const presenceMachine: MachineConfig<PresenceSchema> =
  createMachine<PresenceSchema>({
    actions: {
      cleanupNode: ({refs}) => {
        refs.set("node", null)
        refs.set("styles", null)
      },
      clearInitial: ({context}) => {
        context.set("initial", false)
      },
      clearPrevAnimationName: ({context}) => {
        context.set("prevAnimationName", null)
      },
      invokeOnExitComplete: ({prop}) => {
        prop("onExitComplete")?.()
      },

      setInitial: ({context}) => {
        if (context.get("initial")) {
          return
        }
        queueMicrotask(() => {
          context.set("initial", true)
        })
      },

      setNode: ({event, refs}) => {
        if ("node" in event) {
          refs.set("node", event.node)
        }
      },

      setPrevAnimationName: ({context, refs}) => {
        raf(() => {
          context.set("prevAnimationName", getAnimationName(refs.get("styles")))
        })
      },

      setStyles: ({event, refs}) => {
        if ("node" in event && event.node) {
          refs.set("styles", getComputedStyle(event.node))
        }
      },

      syncPresence: ({context, prop, refs, send}) => {
        const presentProp = prop("present")
        if (presentProp) {
          return send({src: "presence.changed", type: "MOUNT"})
        }

        const node = refs.get("node")
        if (!presentProp && node?.ownerDocument.visibilityState === "hidden") {
          return send({src: "visibilitychange", type: "UNMOUNT"})
        }

        raf(() => {
          const animationName = getAnimationName(refs.get("styles"))
          context.set("unmountAnimationName", animationName)
          if (
            animationName === "none" ||
            animationName === context.get("prevAnimationName") ||
            refs.get("styles")?.display === "none" ||
            refs.get("styles")?.animationDuration === "0s"
          ) {
            send({src: "presence.changed", type: "UNMOUNT"})
          } else {
            send({type: "UNMOUNT.SUSPEND"})
          }
        })
      },
    },

    context({bindable}) {
      return {
        initial: bindable<boolean>(() => ({
          defaultValue: false,
          sync: true,
        })),
        present: bindable<boolean>(() => ({defaultValue: false})),
        prevAnimationName: bindable<string | null>(() => ({
          defaultValue: null,
        })),
        unmountAnimationName: bindable<string | null>(() => ({
          defaultValue: null,
        })),
      }
    },

    effects: {
      trackAnimationEvents: ({context, refs, send}) => {
        const node = refs.get("node")
        if (!node) {
          return
        }

        const onStart = (event: AnimationEvent) => {
          const target = event.composedPath?.()?.[0] ?? event.target
          if (target === node) {
            context.set(
              "prevAnimationName",
              getAnimationName(refs.get("styles")),
            )
          }
        }

        const onEnd = (event: AnimationEvent) => {
          const animationName = getAnimationName(refs.get("styles"))
          const target = getEventTarget(event)
          if (
            target === node &&
            animationName === context.get("unmountAnimationName")
          ) {
            send({src: "animationend", type: "UNMOUNT"})
          }
        }

        node.addEventListener("animationstart", onStart)
        node.addEventListener("animationcancel", onEnd)
        node.addEventListener("animationend", onEnd)
        const cleanupStyles = setStyle(node, {animationFillMode: "forwards"})

        return () => {
          node.removeEventListener("animationstart", onStart)
          node.removeEventListener("animationcancel", onEnd)
          node.removeEventListener("animationend", onEnd)
          nextTick(() => cleanupStyles())
        }
      },
    },

    exitActions: ["clearInitial", "cleanupNode"],

    initialState({prop}) {
      return prop("present") ? "mounted" : "unmounted"
    },

    on: {
      "NODE.SET": {
        actions: ["setNode", "setStyles"],
      },
    },

    props({props}) {
      return {...props, present: !!props.present}
    },

    refs() {
      return {
        node: null,
        styles: null,
      }
    },

    states: {
      mounted: {
        on: {
          UNMOUNT: {
            actions: ["clearPrevAnimationName", "invokeOnExitComplete"],
            target: "unmounted",
          },
          "UNMOUNT.SUSPEND": {
            target: "unmountSuspended",
          },
        },
      },
      unmounted: {
        on: {
          MOUNT: {
            actions: ["setPrevAnimationName"],
            target: "mounted",
          },
        },
      },
      unmountSuspended: {
        effects: ["trackAnimationEvents"],
        on: {
          MOUNT: {
            actions: ["setPrevAnimationName"],
            target: "mounted",
          },
          UNMOUNT: {
            actions: ["clearPrevAnimationName", "invokeOnExitComplete"],
            target: "unmounted",
          },
        },
      },
    },

    watch({actions, prop, track}) {
      track([() => prop("present")], () => {
        actions.setInitial()
        actions.syncPresence()
      })
    },
  })

function getAnimationName(styles?: CSSStyleDeclaration | null) {
  return styles?.animationName || "none"
}
