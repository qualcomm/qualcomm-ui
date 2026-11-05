// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanAriaAttr, booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {Machine, PropNormalizer} from "@qualcomm-ui/utils/machine"

import {toggleAnatomy} from "./toggle.anatomy.js"
import type {
  ToggleApi,
  ToggleIndicatorBindings,
  ToggleRootBindings,
  ToggleSchema,
} from "./toggle.types.js"

const parts = toggleAnatomy.parts

export function createToggleApi(
  machine: Machine<ToggleSchema>,
  normalize: PropNormalizer,
): ToggleApi {
  const {context, prop, send} = machine
  const pressed = context.get("pressed")
  const dir = prop("dir")

  return {
    disabled: !!prop("disabled"),
    pressed,
    setPressed(value) {
      send({type: "PRESS.SET", value})
    },

    // group: bindings
    getIndicatorBindings(): ToggleIndicatorBindings {
      return normalize.element({
        ...parts.indicator,
        "data-disabled": booleanDataAttr(prop("disabled")),
        "data-pressed": booleanDataAttr(pressed),
        "data-state": pressed ? "on" : "off",
      })
    },

    getRootBindings(): ToggleRootBindings {
      return normalize.element({
        ...parts.root,
        "aria-pressed": booleanAriaAttr(pressed),
        "data-disabled": booleanDataAttr(prop("disabled")),
        "data-pressed": booleanDataAttr(pressed),
        "data-state": pressed ? "on" : "off",
        dir,
        disabled: prop("disabled"),
        onClick(event) {
          if (event.defaultPrevented) {
            return
          }
          if (prop("disabled")) {
            return
          }
          send({type: "PRESS.TOGGLE"})
        },
        type: "button",
      })
    },
  }
}
