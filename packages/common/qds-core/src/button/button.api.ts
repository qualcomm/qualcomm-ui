// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {Explicit} from "@qualcomm-ui/utils/guard"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import type {ResolvableButtonGroupProps} from "./button-group.api.js"
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

export interface ButtonPropsSources {
  /**
   * Contextual defaults, e.g. from a menu header. Lowest priority.
   */
  defaults?: QdsButtonApiProps | null | undefined

  /**
   * Button-group values.
   */
  group?: ResolvableButtonGroupProps | null | undefined
}

/**
 * Resolves a button's props against its group and contextual defaults.
 *
 * - `density`, `disabled`, `size` are non-overridable: group, then the button's
 *   own props, then defaults.
 * - `emphasis`, `variant` are overridable per-button: the button's own props,
 *   then group, then defaults.
 */
export function resolveButtonProps<T extends ResolvableButtonGroupProps>(
  props: T,
  {defaults, group}: ButtonPropsSources = {},
): T {
  return {
    ...props,
    density: group?.density ?? props.density ?? defaults?.density,
    disabled: group?.disabled ?? props.disabled ?? defaults?.disabled,
    emphasis: props.emphasis ?? group?.emphasis ?? defaults?.emphasis,
    size: group?.size ?? props.size ?? defaults?.size,
    variant: props.variant ?? group?.variant ?? defaults?.variant,
  }
}

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
    size,
  }
}
