import {getPlacementStyles} from "@qualcomm-ui/dom/floating-ui"
import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {Direction} from "@qualcomm-ui/utils/direction"
import type {Machine, PropNormalizer} from "@qualcomm-ui/utils/machine"

import type {
  TooltipApi,
  TooltipArrowBindings,
  TooltipArrowTipBindings,
  TooltipContentBindings,
  TooltipPositionerBindings,
  TooltipRootBindings,
  TooltipSchema,
  TooltipTriggerBindings,
} from "./tooltip.types"

export function createTooltipApi(
  store: Machine<TooltipSchema>,
  normalize: PropNormalizer,
): TooltipApi {
  const {context, prop, scope, send, state} = store

  const open = state.matches("open")

  const popperStyles = getPlacementStyles({
    ...prop("positioning"),
    placement: context.get("currentPlacement"),
  })

  const commonProps: {"data-scope": "tooltip"; dir: Direction | undefined} = {
    "data-scope": "tooltip",
    dir: prop("dir"),
  }

  return {
    getRootBindings(): TooltipRootBindings {
      return normalize.element({
        ...commonProps,
        "data-part": "root",
      })
    },

    getTooltipArrowBindings(props): TooltipArrowBindings {
      scope.ids.register("arrow", props)
      return normalize.element({
        ...commonProps,
        // important! the get-placement middleware relies on [data-part=arrow]
        "data-part": "arrow",
        id: props.id,
        style: popperStyles.arrow,
      })
    },

    getTooltipArrowTipBindings(): TooltipArrowTipBindings {
      return normalize.element({
        ...commonProps,
        "data-part": "arrowTip",
        style: popperStyles.arrowTip,
      })
    },

    getTooltipContentBindings(props): TooltipContentBindings {
      scope.ids.register("content", props)
      return normalize.element({
        ...commonProps,
        "data-part": "content",
        "data-placement": context.get("currentPlacement"),
        "data-state": open ? "open" : "closed",
        hidden: !open,
        id: props.id,
        role: "tooltip",
      })
    },

    getTooltipPositionerBindings(props): TooltipPositionerBindings {
      scope.ids.register("positioner", props)
      return normalize.element({
        ...commonProps,
        "data-part": "positioner",
        id: props.id,
        style: popperStyles.floating,
      })
    },

    getTooltipTriggerBindings(props): TooltipTriggerBindings {
      scope.ids.register("trigger", props)
      return normalize.element({
        ...commonProps,
        "aria-describedby": open ? scope.ids.get("content") : undefined,
        "data-expanded": booleanDataAttr(open),
        "data-part": "trigger",
        // TODO redundant attr: remove?
        "data-state": open ? "open" : "closed",
        id: props.id,
        onBlur(event) {
          if (event.defaultPrevented) {
            return
          }
          if (prop("disabled")) {
            return
          }
          send({type: "CLOSE"})
        },
        onClick(event) {
          if (event.defaultPrevented) {
            return
          }
          if (prop("disabled")) {
            return
          }
          if (!prop("closeOnClick")) {
            return
          }
          send({type: "CLOSE"})
        },
        onFocus(event) {
          if (event.defaultPrevented) {
            return
          }
          if (prop("disabled")) {
            return
          }
          send({type: "OPEN"})
        },
        onPointerCancel() {
          if (prop("disabled")) {
            return
          }
          send({type: "CLOSE"})
        },
        onPointerEnter(event) {
          if (event.defaultPrevented) {
            return
          }
          if (prop("disabled")) {
            return
          }
          if (event.pointerType === "touch") {
            return
          }
          send({type: "POINTER.ENTER"})
        },
        onPointerLeave() {
          if (prop("disabled")) {
            return
          }
          send({type: "CLOSE"})
        },
      })
    },
  }
}
