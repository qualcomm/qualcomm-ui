import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {Machine, PropNormalizer} from "@qualcomm-ui/utils/machine"

import {
  getCloseTriggerId,
  getDescriptionId,
  getRootId,
  getTitleId,
} from "./internal"
import type {
  ToastActionTriggerBindings,
  ToastAlign,
  ToastApi,
  ToastCloseTriggerBindings,
  ToastCommonBindings,
  ToastDescriptionBindings,
  ToastGhostAfterBindings,
  ToastGhostBeforeBindings,
  ToastLabelBindings,
  ToastRootBindings,
  ToastSchema,
  ToastSide,
} from "./toast.types"
import {
  getGhostAfterStyle,
  getGhostBeforeStyle,
  getPlacementStyle,
} from "./toast.utils"

export function createToastApi<T = string>(
  machine: Machine<ToastSchema>,
  normalize: PropNormalizer,
): ToastApi<T> {
  const {computed, context, prop, scope, send, state} = machine

  const visible = state.hasTag("visible")
  const paused = state.hasTag("paused")

  const mounted = context.get("mounted")
  const frontmost = computed("frontmost")

  const placement = prop("parent").computed("placement")
  const type = prop("type")
  const stacked = prop("stacked")
  const title = prop("label") as T | undefined
  const description = prop("description") as T | undefined
  const action = prop("action")

  const [side, align = "center"] = placement.split("-") as [
    ToastSide,
    ToastAlign,
  ]

  const commonBindings: ToastCommonBindings = {
    "data-scope": "toast",
    dir: prop("dir"),
  }

  return {
    action: prop("action"),
    closable: !!prop("closable"),
    description,
    dismiss() {
      send({src: "programmatic", type: "DISMISS"})
    },
    label: title,
    pause() {
      send({type: "PAUSE"})
    },
    paused,
    placement,
    resume() {
      send({type: "RESUME"})
    },

    type,

    visible,

    // group: bindings
    getActionTriggerBindings(): ToastActionTriggerBindings {
      return normalize.button({
        ...commonBindings,
        "data-part": "action-trigger",
        onClick(event) {
          if (event.defaultPrevented) {
            return
          }
          action?.onClick?.()
          send({src: "user", type: "DISMISS"})
        },
        type: "button",
      })
    },

    getCloseTriggerBindings(): ToastCloseTriggerBindings {
      return normalize.button({
        ...commonBindings,
        "aria-label": "Dismiss notification",
        "data-part": "close-trigger",
        id: getCloseTriggerId(scope),
        onClick(event) {
          if (event.defaultPrevented) {
            return
          }
          send({src: "user", type: "DISMISS"})
        },
        type: "button",
      })
    },

    getDescriptionBindings(): ToastDescriptionBindings {
      return normalize.element({
        ...commonBindings,
        "data-part": "description",
        id: getDescriptionId(scope),
      })
    },

    /* Needed to avoid setting hover to false when in between toasts */
    getGhostAfterBindings(): ToastGhostAfterBindings {
      return normalize.element({
        ...commonBindings,
        "data-ghost": "after",
        "data-part": "ghost-after",
        style: getGhostAfterStyle(),
      })
    },

    /* Leave a ghost div to avoid setting hover to false when transitioning out */
    getGhostBeforeBindings(): ToastGhostBeforeBindings {
      return normalize.element({
        ...commonBindings,
        "data-ghost": "before",
        "data-part": "ghost-before",
        style: getGhostBeforeStyle(machine, visible),
      })
    },

    getLabelBindings(): ToastLabelBindings {
      return normalize.element({
        ...commonBindings,
        "data-part": "label",
        id: getTitleId(scope),
      })
    },

    getRootBindings(): ToastRootBindings {
      return normalize.element({
        ...commonBindings,
        "aria-atomic": "true",
        "aria-describedby": description ? getDescriptionId(scope) : undefined,
        "aria-labelledby": title ? getTitleId(scope) : undefined,
        "data-align": align,
        "data-first": booleanDataAttr(frontmost),
        "data-mounted": booleanDataAttr(mounted),
        "data-overlap": booleanDataAttr(!stacked),
        "data-part": "root",
        "data-paused": booleanDataAttr(paused),
        "data-placement": placement,
        "data-sibling": booleanDataAttr(!frontmost),
        "data-side": side,
        "data-stack": booleanDataAttr(stacked),
        "data-state": visible ? "open" : "closed",
        "data-type": type,
        dir: prop("dir"),
        id: getRootId(scope),
        onKeyDown(event) {
          if (event.defaultPrevented) {
            return
          }
          if (event.key === "Escape") {
            send({src: "keyboard", type: "DISMISS"})
            event.preventDefault()
          }
        },
        role: "status",
        style: getPlacementStyle(machine, visible),
        tabIndex: 0,
      })
    },
  }
}
