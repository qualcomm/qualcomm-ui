// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  BooleanAriaAttr,
  BooleanDataAttr,
} from "@qualcomm-ui/utils/attributes"
import type {DirectionProperty} from "@qualcomm-ui/utils/direction"
import type {IdRegistrationProps} from "@qualcomm-ui/utils/machine"

/**
 * The field is primarily used to wire up accessibility for its elements.
 */
export interface FieldApiProps extends DirectionProperty {
  /**
   * Whether the input is disabled. When true, prevents user interaction and
   * applies visual styling to indicate the disabled state.
   */
  disabled?: boolean | undefined

  /**
   * Controls the visual error state of the input. When true, applies semantic error
   * styling to indicate validation failure.
   */
  invalid?: boolean | undefined

  /**
   * Whether the input is read-only. When true, prevents user interaction while
   * keeping the input focusable and visible.
   */
  readOnly?: boolean | undefined

  /**
   * Whether the input is required. When true, the input must have a value for form
   * validation to pass.
   */
  required?: boolean | undefined
}

interface CommonBindings extends Required<DirectionProperty> {
  "data-scope": "field"
}

export interface FieldRootBindings extends CommonBindings {
  "data-disabled": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  "data-part": "root"
  "data-readonly": BooleanDataAttr
  role: "group"
}

export interface FieldLabelBindings extends CommonBindings {
  "data-disabled": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  "data-part": "label"
  "data-required": BooleanDataAttr
  htmlFor: string
  id: string
}

export interface FieldHintBindings extends CommonBindings {
  "data-disabled": BooleanDataAttr
  "data-part": "hint"
  id: string
}

export interface FieldControlBindings extends CommonBindings {
  "aria-describedby": string | undefined
  "aria-invalid": BooleanAriaAttr
  "data-disabled": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  "data-part": "control"
  "data-required": BooleanDataAttr
  disabled: boolean
  id: string
  readOnly: boolean
  required: BooleanDataAttr
}

export interface FieldErrorTextBindings extends CommonBindings {
  "aria-live": "polite"
  "data-disabled": BooleanDataAttr
  "data-part": "error-text"
  id: string
}

export interface FieldRequiredIndicatorBindings extends CommonBindings {
  "aria-hidden": BooleanAriaAttr
  "data-part": "required-indicator"
}

export interface FieldApi {
  // group: getters
  getControlBindings(props: IdRegistrationProps): FieldControlBindings
  getErrorTextBindings(props: IdRegistrationProps): FieldErrorTextBindings
  getHintBindings(props: IdRegistrationProps): FieldHintBindings
  getLabelBindings(props: IdRegistrationProps): FieldLabelBindings
  getRequiredIndicatorBindings(): FieldRequiredIndicatorBindings
  getRootBindings(): FieldRootBindings

  // group: everything else
  disabled: boolean | undefined
  invalid: boolean | undefined
  readOnly: boolean | undefined
  required: boolean | undefined
}
