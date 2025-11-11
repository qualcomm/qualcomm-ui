// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  checkboxClasses,
  QdsCheckboxSize,
} from "@qualcomm-ui/qds-core/checkbox"
import type {BooleanDataAttr} from "@qualcomm-ui/utils/attributes"

import type {checkmarkClasses} from "./checkmark.classes"

export interface QdsCheckmarkApiProps {
  /**
   * Whether the checkmark is checked. If true, the checked icon will render to
   * indicate selection.
   */
  checked?: boolean | undefined

  /**
   * Whether the checkbox is disabled. When true, prevents user interaction and
   * applies visual styling to indicate the disabled state.
   */
  disabled?: boolean | undefined

  /**
   * If true and the checkmark is not checked, the checkmark will render as
   * indeterminate to indicate partial selection.
   */
  indeterminate?: boolean | undefined

  /**
   * Governs the size of the icon.
   * @default 'md'
   */
  size?: QdsCheckboxSize
}

export interface QdsCheckmarkRootBindings {
  // kinda hacky, but it works for docs
  className: `${(typeof checkboxClasses)["control"]} ${(typeof checkmarkClasses)["root"]}`
  "data-disabled": BooleanDataAttr
  "data-state": "checked" | "indeterminate" | "unchecked"
}

export interface QdsCheckmarkIconBindings {
  className: (typeof checkmarkClasses)["icon"]
  hidden: boolean
}

export interface QdsCheckmarkApi {
  getIconBindings(): QdsCheckmarkIconBindings
  getRootBindings(): QdsCheckmarkRootBindings
}
