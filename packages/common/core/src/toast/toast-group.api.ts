// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {contains} from "@qualcomm-ui/dom/query"
import type {Machine, PropNormalizer} from "@qualcomm-ui/utils/machine"

import {getRegionId} from "./internal"
import type {
  ToastAlign,
  ToastGroupApi,
  ToastGroupBindings,
  ToastGroupSchema,
  ToastSide,
} from "./toast.types"
import {getGroupPlacementStyle} from "./toast.utils"

export function createToastGroupApi<T = string>(
  machine: Machine<ToastGroupSchema>,
  normalize: PropNormalizer,
): ToastGroupApi<T> {
  const {computed, context, prop, refs, send} = machine

  return {
    getCount() {
      return context.get("toasts").length
    },
    getToasts() {
      return context.get("toasts")
    },

    subscribe(fn) {
      const store = prop("store")
      return store.subscribe(() => fn(context.get("toasts")))
    },

    // group: bindings
    getGroupBindings(options = {}): ToastGroupBindings {
      const {label = "Notifications"} = options
      const placement = computed("placement")
      const [side, align = "center"] = placement.split("-") as [
        ToastSide,
        ToastAlign,
      ]

      return normalize.element({
        "aria-label": `${placement} ${label}`,
        "aria-live": "polite",
        "data-align": align,
        "data-placement": placement,
        "data-scope": "toast",
        "data-side": side,
        dir: prop("dir"),
        id: getRegionId(placement),
        onBlur(event) {
          if (
            refs.get("isFocusWithin") &&
            !contains(event.currentTarget, event.relatedTarget)
          ) {
            queueMicrotask(() => send({type: "REGION.BLUR"}))
          }
        },
        onFocus(event) {
          send({target: event.relatedTarget, type: "REGION.FOCUS"})
        },
        onMouseLeave() {
          send({placement, type: "REGION.POINTER_LEAVE"})
        },
        onMouseMove() {
          send({placement, type: "REGION.POINTER_ENTER"})
        },
        role: "region",
        style: getGroupPlacementStyle(machine, placement),
        tabIndex: -1,
      })
    },
  }
}
