// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {Explicit} from "@qualcomm-ui/utils/guard"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {buttonClasses} from "./button.classes"
import type {
  QdsIconButtonApi,
  QdsIconButtonApiProps,
  QdsIconButtonIconBindings,
  QdsIconButtonRootBindings,
} from "./icon-button.types"

export function createQdsIconButtonApi(
  props: Explicit<QdsIconButtonApiProps>,
  normalize: PropNormalizer,
): QdsIconButtonApi {
  const density = props.density || "default"
  const disabled = props.disabled
  const emphasis = props.emphasis || "neutral"
  const size = props.size || "md"
  const variant = props.variant || "fill"

  return {
    getIconBindings(): QdsIconButtonIconBindings {
      return {
        className: buttonClasses.icon,
        "data-density": density,
        "data-part": "icon",
        "data-scope": "icon-button",
        "data-size": size,
      }
    },
    getRootBindings(): QdsIconButtonRootBindings {
      return normalize.button({
        className: buttonClasses.root,
        "data-density": density,
        "data-disabled": booleanDataAttr(disabled),
        "data-emphasis": emphasis,
        "data-kind": "icon",
        "data-part": "root",
        "data-scope": "icon-button",
        "data-size": size,
        "data-variant": variant,
        disabled,
      })
    },
  }
}
