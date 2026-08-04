// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {Explicit} from "@qualcomm-ui/utils/guard"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {splitButtonAnatomy} from "./menu-split-button.anatomy.js"
import type {
  QdsSplitButtonApiProps,
  QdsSplitButtonBindings,
} from "./menu-split-button.types.js"
import {menuClasses} from "./menu.classes.js"

const parts = splitButtonAnatomy.parts

export function getQdsSplitButtonBindings(
  {
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
    density,
    disabled,
    emphasis,
    size,
    variant,
  }: Explicit<QdsSplitButtonApiProps>,
  normalize: PropNormalizer,
): QdsSplitButtonBindings {
  const hasAriaLabel = !!(ariaLabel || ariaLabelledby)

  return normalize.element({
    ...parts.root,
    "aria-label": ariaLabel || undefined,
    "aria-labelledby": ariaLabelledby || undefined,
    className: menuClasses.splitButton,
    "data-density": density || "default",
    "data-disabled": booleanDataAttr(disabled),
    "data-emphasis": emphasis || undefined,
    "data-size": size || "md",
    "data-variant": variant || undefined,
    ...(hasAriaLabel && {role: "group"}),
  })
}
