// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {Explicit} from "@qualcomm-ui/utils/guard"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import type {
  QdsButtonGroupApiProps,
  QdsButtonGroupBindings,
} from "./button-group.types"
import {buttonClasses} from "./button.classes"

export function getQdsButtonGroupBindings(
  {
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
    density,
    disabled,
    emphasis,
    layout,
    size,
    variant,
  }: Explicit<QdsButtonGroupApiProps>,
  normalize: PropNormalizer,
): QdsButtonGroupBindings {
  const hasAriaLabel = !!(ariaLabel || ariaLabelledby)

  return normalize.element({
    "aria-label": ariaLabel || undefined,
    "aria-labelledby": ariaLabelledby || undefined,
    className: buttonClasses.group,
    "data-density": density || "default",
    "data-disabled": booleanDataAttr(disabled),
    "data-emphasis": emphasis || undefined,
    "data-layout": layout || "hug",
    "data-scope": "button-group",
    "data-size": size || "md",
    "data-variant": variant || undefined,
    ...(hasAriaLabel && {role: "group"}),
  })
}
