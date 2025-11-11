// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {Explicit} from "@qualcomm-ui/utils/guard"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {buttonClasses} from "./button.classes"
import type {
  QdsButtonApi,
  QdsButtonApiProps,
  QdsButtonEndIconBindings,
  QdsButtonRootBindings,
  QdsButtonScope,
  QdsButtonStartIconBindings,
} from "./button.types"

const buttonScope: QdsButtonScope = {
  "data-scope": "button",
}

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
        ...buttonScope,
        className: buttonClasses.icon,
        "data-density": density,
        "data-part": "icon",
        "data-placement": "end",
        "data-size": size,
      })
    },
    getRootBindings(): QdsButtonRootBindings {
      return normalize.button({
        ...buttonScope,
        className: buttonClasses.root,
        "data-density": density,
        "data-disabled": booleanDataAttr(disabled),
        "data-emphasis": emphasis,
        "data-kind": "text",
        "data-part": "root",
        "data-size": size,
        "data-variant": variant,
        disabled,
      })
    },
    getStartIconBindings(): QdsButtonStartIconBindings {
      return normalize.element({
        ...buttonScope,
        className: buttonClasses.icon,
        "data-density": density,
        "data-part": "icon",
        "data-placement": "start",
        "data-size": size,
      })
    },
  }
}
