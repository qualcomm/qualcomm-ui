// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {getPlacementStyles} from "@qualcomm-ui/dom/floating-ui"
import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {Machine, PropNormalizer} from "@qualcomm-ui/utils/machine"

import {tooltipAnatomy} from "./tooltip.anatomy"
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

const parts = tooltipAnatomy.parts

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

  return {
    getRootBindings(): TooltipRootBindings {
      return normalize.element({
        ...parts.root,
        dir: prop("dir") || "ltr",
      })
    },

    getTooltipArrowBindings(props): TooltipArrowBindings {
      scope.ids.register("arrow", props)
      return normalize.element({
        ...parts.arrow,
        id: props.id,
        style: popperStyles.arrow,
      })
    },

    getTooltipArrowTipBindings(): TooltipArrowTipBindings {
      return normalize.element({
        ...parts.arrowTip,
        style: popperStyles.arrowTip,
      })
    },

    getTooltipContentBindings(props): TooltipContentBindings {
      scope.ids.register("content", props)
      return normalize.element({
        ...parts.content,
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
        ...parts.positioner,
        id: props.id,
        style: popperStyles.floating,
      })
    },

    getTooltipTriggerBindings(props): TooltipTriggerBindings {
      scope.ids.register("trigger", props)
      return normalize.element({
        ...parts.trigger,
        "aria-describedby": open ? scope.ids.get("content") : undefined,
        "data-expanded": booleanDataAttr(open),
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
