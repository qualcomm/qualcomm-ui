// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {getPlacementStyles} from "@qualcomm-ui/dom/floating-ui"
import {isSafari} from "@qualcomm-ui/dom/query"
import {ariaAttr, booleanAriaAttr, booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {Direction} from "@qualcomm-ui/utils/direction"
import type {Machine, PropNormalizer} from "@qualcomm-ui/utils/machine"

import {domIds} from "./internal"
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

  const commonProps: {"data-scope": "popover"; dir: Direction | undefined} = {
    "data-scope": "popover",
    dir: prop("dir"),
  }

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
        ...commonProps,
        "data-part": "anchor",
        id: domIds.anchor(scope),
      })
    },
    getArrowBindings(props): PopoverArrowBindings {
      scope.ids.register("arrow", props)
      return normalize.element({
        ...commonProps,
        "data-part": "arrow",
        id: props.id,
        style: popperStyles.arrow,
      })
    },

    getArrowTipBindings(): PopoverArrowTipBindings {
      return normalize.element({
        ...commonProps,
        "data-part": "arrow-tip",
        style: popperStyles.arrowTip,
      })
    },

    getCloseTriggerBindings(props): PopoverCloseTriggerBindings {
      scope.ids.register("closeTrigger", props)
      return normalize.button({
        ...commonProps,
        "aria-label": "close",
        "data-part": "close-trigger",
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
        ...commonProps,
        "aria-describedby": ariaAttr(domIds.description(scope)),
        "aria-labelledby": ariaAttr(domIds.title(scope)),
        "data-expanded": booleanDataAttr(open),
        "data-part": "content",
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
        ...commonProps,
        "data-part": "description",
        id: domIds.description(scope),
      })
    },

    getIndicatorBindings(): PopoverIndicatorBindings {
      return normalize.element({
        ...commonProps,
        "data-part": "indicator",
        "data-state": state.get(),
      })
    },

    getLabelBindings(props): PopoverLabelBindings {
      scope.ids.register("title", props)
      return normalize.element({
        ...commonProps,
        "data-part": "label",
        id: domIds.title(scope),
      })
    },

    getPositionerBindings(props): PopoverPositionerBindings {
      scope.ids.register("positioner", props)
      return normalize.element({
        ...commonProps,
        "data-part": "positioner",
        id: domIds.positioner(scope),
        style: popperStyles.floating,
      })
    },

    getRootBindings(): PopoverRootBindings {
      return {...commonProps, "data-part": "root"}
    },

    getTriggerBindings(props): PopoverTriggerBindings {
      scope.ids.register("trigger", props)
      return normalize.button({
        ...commonProps,
        "aria-controls": domIds.content(scope),
        "aria-expanded": booleanAriaAttr(open),
        "aria-haspopup": "dialog",
        "data-part": "trigger",
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
