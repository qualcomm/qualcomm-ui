// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {ariaAttr, booleanAriaAttr} from "@qualcomm-ui/utils/attributes"
import type {Machine, PropNormalizer} from "@qualcomm-ui/utils/machine"

import {dialogAnatomy} from "./dialog.anatomy.js"
import type {
  DialogApi,
  DialogBackdropBindings,
  DialogBodyBindings,
  DialogCloseTriggerBindings,
  DialogContentBindings,
  DialogDescriptionBindings,
  DialogFooterBindings,
  DialogHeadingBindings,
  DialogPositionerBindings,
  DialogSchema,
  DialogTriggerBindings,
} from "./dialog.types.js"
import {domIds} from "./internal/dialog.dom.js"

const parts = dialogAnatomy.parts

export function createDialogApi(
  machine: Machine<DialogSchema>,
  normalize: PropNormalizer,
): DialogApi {
  const {prop, scope, send, state} = machine

  const ariaLabel = prop("aria-label")
  const open = state.matches("open")

  return {
    open,
    setOpen(nextOpen) {
      const open = state.matches("open")
      if (open === nextOpen) {
        return
      }
      send({type: nextOpen ? "OPEN" : "CLOSE"})
    },

    // group: bindings
    getBackdropBindings(props): DialogBackdropBindings {
      scope.ids.register("backdrop", props)
      return normalize.element({
        ...parts.backdrop,
        "data-state": state.get(),
        hidden: !open,
        id: props.id,
      })
    },
    getBodyBindings(): DialogBodyBindings {
      return normalize.element({
        ...parts.body,
      })
    },
    getCloseTriggerBindings(props): DialogCloseTriggerBindings {
      scope.ids.register("closeTrigger", props)
      return normalize.button({
        ...parts.closeTrigger,
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
    getContentBindings(props): DialogContentBindings {
      scope.ids.register("content", props)
      const labelId = domIds.label(scope)
      return normalize.element({
        ...parts.content,
        "aria-describedby": ariaAttr(domIds.description(scope)),
        "aria-label": ariaLabel || undefined,
        "aria-labelledby": ariaLabel || !labelId ? undefined : labelId,
        "aria-modal": prop("modal"),
        "data-state": state.get(),
        hidden: !open,
        id: props.id,
        role: prop("role"),
        tabIndex: -1,
      })
    },
    getDescriptionBindings(props): DialogDescriptionBindings {
      scope.ids.register("description", props)
      return normalize.element({
        ...parts.description,
        id: props.id,
      })
    },
    getFooterBindings(): DialogFooterBindings {
      return normalize.element({
        ...parts.footer,
      })
    },
    getHeadingBindings(props): DialogHeadingBindings {
      scope.ids.register("label", props)
      return normalize.element({
        ...parts.heading,
        id: props.id,
      })
    },
    getPositionerBindings(props): DialogPositionerBindings {
      scope.ids.register("positioner", props)
      return normalize.element({
        ...parts.positioner,
        dir: prop("dir"),
        id: props.id,
        style: {
          pointerEvents: open ? undefined : "none",
        },
      })
    },
    getTriggerBindings(props): DialogTriggerBindings {
      scope.ids.register("trigger", props)
      return normalize.button({
        ...parts.trigger,
        "aria-controls": domIds.content(scope),
        "aria-expanded": booleanAriaAttr(open),
        "aria-haspopup": "dialog",
        "data-state": state.get(),
        id: props.id,
        onClick(event) {
          if (event.defaultPrevented) {
            return
          }
          send({type: "TOGGLE"})
        },
        type: "button",
      })
    },
  }
}
