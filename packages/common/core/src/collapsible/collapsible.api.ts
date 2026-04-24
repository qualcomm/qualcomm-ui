// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanAriaAttr, booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {Machine, PropNormalizer} from "@qualcomm-ui/utils/machine"

import {collapsibleAnatomy} from "./collapsible.anatomy"
import type {
  CollapsibleApi,
  CollapsibleContentBindings,
  CollapsibleRootBindings,
  CollapsibleSchema,
  CollapsibleTriggerBindings,
} from "./collapsible.types"
import {domIds} from "./internal"

const parts = collapsibleAnatomy.parts

export function createCollapsibleApi(
  machine: Machine<CollapsibleSchema>,
  normalize: PropNormalizer,
): CollapsibleApi {
  const {context, prop, scope, send, state} = machine

  const visible = state.matches("open") || state.matches("closing")
  const open = state.matches("open")

  const {height, width} = context.get("size")
  const disabled = !!prop("disabled")

  return {
    disabled,
    measureSize() {
      send({type: "size.measure"})
    },
    open,
    setOpen(nextOpen) {
      const open = state.matches("open")
      if (open === nextOpen) {
        return
      }
      send({type: nextOpen ? "open" : "close"})
    },
    visible,
    // group: bindings
    getContentBindings(props): CollapsibleContentBindings {
      scope.ids.register("content", props)
      const skip = !context.get("initial") && open
      return normalize.element({
        ...parts.content,
        "data-collapsible": booleanDataAttr(true),
        "data-disabled": booleanDataAttr(disabled),
        "data-ssr": booleanDataAttr(context.get("ssr")),
        "data-state": skip ? undefined : open ? "open" : "closed",
        hidden: !visible,
        id: props.id,
        style: {
          "--height": height != null ? `${height}px` : undefined,
          "--width": width != null ? `${width}px` : undefined,
        },
      })
    },
    getRootBindings(): CollapsibleRootBindings {
      return normalize.element({
        ...parts.root,
        "data-state": open ? "open" : "closed",
        dir: prop("dir") || "ltr",
      })
    },
    getTriggerBindings(props): CollapsibleTriggerBindings {
      scope.ids.register("trigger", props)
      return normalize.element({
        ...parts.trigger,
        "aria-controls": domIds.content(scope),
        "aria-expanded": booleanAriaAttr(visible),
        "data-disabled": booleanDataAttr(disabled),
        "data-state": open ? "open" : "closed",
        id: props.id,
        onClick(event) {
          if (event.defaultPrevented) {
            return
          }
          if (disabled) {
            return
          }
          send({type: open ? "close" : "open"})
        },
        type: "button",
      })
    },
  }
}
