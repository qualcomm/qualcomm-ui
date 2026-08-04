// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {Explicit} from "@qualcomm-ui/utils/guard"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {buttonGroupAnatomy} from "./button-group.anatomy.js"
import type {
  QdsButtonGroupApiProps,
  QdsButtonGroupBindings,
} from "./button-group.types.js"
import {buttonClasses} from "./button.classes.js"
import type {QdsButtonApiProps} from "./button.types.js"

export type ResolvableButtonGroupProps = Pick<
  QdsButtonGroupApiProps,
  keyof QdsButtonGroupApiProps & keyof QdsButtonApiProps
>

/**
 * Merges button-group context values with a button's own props.
 *
 * `density`, `disabled`, and `size` are non-overridable (group wins).
 * `emphasis` and `variant` are overridable per-button (button wins).
 */
export function resolveButtonPropsWithGroup<
  T extends ResolvableButtonGroupProps,
>(group: ResolvableButtonGroupProps | undefined, base: T): T {
  if (!group) {
    return base
  }
  const {density, disabled, emphasis, size, variant} = group
  return {
    ...base,
    density: density ?? base.density,
    disabled: disabled ?? base.disabled,
    emphasis: base.emphasis ?? emphasis,
    size: size ?? base.size,
    variant: base.variant ?? variant,
  }
}

const parts = buttonGroupAnatomy.parts

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
    ...parts.root,
    "aria-label": ariaLabel || undefined,
    "aria-labelledby": ariaLabelledby || undefined,
    className: buttonClasses.group,
    "data-density": density || "default",
    "data-disabled": booleanDataAttr(disabled),
    "data-emphasis": emphasis || undefined,
    "data-layout": layout || "hug",
    "data-size": size || "md",
    "data-variant": variant || undefined,
    ...(hasAriaLabel && {role: "group"}),
  })
}
