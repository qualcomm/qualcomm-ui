// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {Machine, PropNormalizer} from "@qualcomm-ui/utils/machine"

import type {
  TagApi,
  TagDismissButtonBindings,
  TagRootBindings,
  TagSchema,
} from "./tag.types"

export function createTagApi(
  machine: Machine<TagSchema>,
  normalize: PropNormalizer,
): TagApi {
  const {context, prop, send, state} = machine
  const selected = context.get("selected")
  const dir = prop("dir")
  const dismissed = state.matches("dismissed")

  return {
    disabled: !!prop("disabled"),
    selected,
    setSelected(value) {
      send({type: "SELECTED.SET", value})
    },
    // group: bindings
    getDismissButtonBindings(): TagDismissButtonBindings {
      return normalize.element({
        "data-disabled": booleanDataAttr(prop("disabled")),
        "data-part": "dismiss-button",
        "data-scope": "tag",
        dir,
        onClick: (event) => {
          if (event.defaultPrevented) {
            return
          }
          if (prop("disabled")) {
            return
          }
          send({type: "DISMISS"})
        },
      })
    },
    getRootBindings(): TagRootBindings {
      return normalize.element({
        "data-disabled": booleanDataAttr(prop("disabled")),
        "data-dismissed": booleanDataAttr(dismissed),
        "data-part": "root",
        "data-scope": "tag",
        "data-selected": booleanDataAttr(selected),
        "data-variant": prop("variant"),
        dir,
        disabled: prop("disabled"),
        onClick(event) {
          if (event.defaultPrevented) {
            return
          }
          if (prop("disabled")) {
            return
          }
          send({type: "SELECTED.TOGGLE"})
        },
      })
    },
  }
}
