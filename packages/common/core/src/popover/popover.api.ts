// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {getPlacementStyles} from "@qualcomm-ui/dom/floating-ui"
import {isSafari} from "@qualcomm-ui/dom/query"
import {
  ariaAttr,
  booleanAriaAttr,
  booleanDataAttr,
} from "@qualcomm-ui/utils/attributes"
import type {Machine, PropNormalizer} from "@qualcomm-ui/utils/machine"

import {domIds} from "./internal"
import {popoverAnatomy} from "./popover.anatomy"
import type {
  PopoverAnchorBindings,
  PopoverApi,
  PopoverArrowBindings,
  PopoverArrowTipBindings,
  PopoverCloseTriggerBindings,
  PopoverContentBindings,
  PopoverDescriptionBindings,
  PopoverIndicatorBindings,
  PopoverLabelBindings,
  PopoverPositionerBindings,
  PopoverRootBindings,
  PopoverSchema,
  PopoverTriggerBindings,
} from "./popover.types"

const parts = popoverAnatomy.parts

export function createPopoverApi(
  machine: Machine<PopoverSchema>,
  normalize: PropNormalizer,
): PopoverApi {
  const {computed, context, prop, scope, send, state} = machine

  const open = state.matches("open")
  const currentPlacement = context.get("currentPlacement")
  const portalled = computed("currentPortalled")

  const popperStyles = getPlacementStyles({
    ...prop("positioning"),
    placement: currentPlacement,
  })

  return {
    open: state.matches("open"),
    portalled,
    reposition(options = {}) {
      send({options, type: "POSITIONING.SET"})
    },
    setOpen: ({event, open: nextOpen}) => {
      const isOpen = state.matches("open")
      if (isOpen === nextOpen) {
        return
      }
      send({event, type: nextOpen ? "OPEN" : "CLOSE"})
    },

    // group: element bindings
    getAnchorBindings(props): PopoverAnchorBindings {
      scope.ids.register("anchor", props)
      return normalize.element({
        ...parts.anchor,
        id: domIds.anchor(scope),
      })
    },
    getArrowBindings(props): PopoverArrowBindings {
      scope.ids.register("arrow", props)
      return normalize.element({
        ...parts.arrow,
        id: props.id,
        style: popperStyles.arrow,
      })
    },

    getArrowTipBindings(): PopoverArrowTipBindings {
      return normalize.element({
        ...parts.arrowTip,
        style: popperStyles.arrowTip,
      })
    },

    getCloseTriggerBindings(props): PopoverCloseTriggerBindings {
      scope.ids.register("closeTrigger", props)
      return normalize.button({
        ...parts.closeTrigger,
        "aria-label": "close",
        id: props.id,
        onClick(event) {
          if (event.defaultPrevented) {
            return
          }
          send({type: "CLOSE"})
        },
        type: "button",
      })
    },

    getContentBindings(props): PopoverContentBindings {
      scope.ids.register("content", props)
      return normalize.element({
        ...parts.content,
        "aria-describedby": ariaAttr(domIds.description(scope)),
        "aria-labelledby": ariaAttr(domIds.title(scope)),
        "data-expanded": booleanDataAttr(open),
        "data-placement": currentPlacement,
        "data-state": state.get(),
        hidden: !open,
        id: domIds.content(scope),
        role: "dialog",
        tabIndex: -1,
      })
    },

    getDescriptionBindings(props): PopoverDescriptionBindings {
      scope.ids.register("description", props)
      return normalize.element({
        ...parts.description,
        id: domIds.description(scope),
      })
    },

    getIndicatorBindings(): PopoverIndicatorBindings {
      return normalize.element({
        ...parts.indicator,
        "data-state": state.get(),
      })
    },

    getLabelBindings(props): PopoverLabelBindings {
      scope.ids.register("title", props)
      return normalize.element({
        ...parts.label,
        id: domIds.title(scope),
      })
    },

    getPositionerBindings(props): PopoverPositionerBindings {
      scope.ids.register("positioner", props)
      return normalize.element({
        ...parts.positioner,
        id: domIds.positioner(scope),
        style: popperStyles.floating,
      })
    },

    getRootBindings(): PopoverRootBindings {
      return {
        ...parts.root,
        dir: prop("dir") || "ltr",
      }
    },

    getTriggerBindings(props): PopoverTriggerBindings {
      scope.ids.register("trigger", props)
      return normalize.button({
        ...parts.trigger,
        "aria-controls": domIds.content(scope),
        "aria-expanded": booleanAriaAttr(open),
        "aria-haspopup": "dialog",
        "data-placement": currentPlacement,
        "data-state": state.get(),
        id: domIds.trigger(scope),
        onClick(event) {
          if (event.defaultPrevented) {
            return
          }
          send({type: "TOGGLE"})
        },
        onPointerDown(event) {
          if (isSafari()) {
            event.currentTarget.focus()
          }
        },
        type: "button",
      })
    },
  }
}
