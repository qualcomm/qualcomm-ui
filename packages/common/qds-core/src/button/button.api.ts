// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {Explicit} from "@qualcomm-ui/utils/guard"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {buttonAnatomy} from "./button.anatomy.js"
import {buttonClasses} from "./button.classes.js"
import type {
  QdsButtonApi,
  QdsButtonApiProps,
  QdsButtonEndIconBindings,
  QdsButtonRootBindings,
  QdsButtonStartIconBindings,
} from "./button.types.js"

const parts = buttonAnatomy.parts

const sharedDefaults = {
  size: "md",
} satisfies Pick<QdsButtonApiProps, "size">

export function createQdsButtonApi(
  props: Explicit<QdsButtonApiProps>,
  normalize: PropNormalizer,
): QdsButtonApi {
  const density = props.density || "default"
  const disabled = props.disabled
  const emphasis = props.emphasis || "neutral"
  const size = props.size || sharedDefaults.size
  const variant = props.variant || "fill"

  return {
    getEndIconBindings(): QdsButtonEndIconBindings {
      return normalize.element({
        ...parts.icon,
        className: buttonClasses.icon,
        "data-density": density,
        "data-placement": "end",
        "data-size": size,
      })
    },
    getRootBindings(): QdsButtonRootBindings {
      return normalize.button({
        ...parts.root,
        className: buttonClasses.root,
        "data-density": density,
        "data-disabled": booleanDataAttr(disabled),
        "data-emphasis": emphasis,
        "data-kind": "text",
        "data-size": size,
        "data-variant": variant,
        disabled,
      })
    },
    getStartIconBindings(): QdsButtonStartIconBindings {
      return normalize.element({
        ...parts.icon,
        className: buttonClasses.icon,
        "data-density": density,
        "data-placement": "start",
        "data-size": size,
      })
    },
  }
}
