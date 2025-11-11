// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {BooleanAriaAttr, BooleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {JSX} from "@qualcomm-ui/utils/machine"

export interface InputRootBindings {
  "data-disabled": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  "data-part": "root"
}

export interface InputLabelBindings {
  "data-disabled": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  "data-part": "label"
  htmlFor: string
  id: string
}

export interface InputErrorTextBindings {
  "aria-live": "polite"
  "data-part": "error-text"
  hidden: boolean
  id: string
}

export interface InputHintBindings {
  "data-disabled": BooleanDataAttr
  "data-part": "hint"
  id: string
}

export interface InputInputGroupBindings {
  "data-disabled": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  "data-part": "input-group"
  "data-readonly": BooleanDataAttr
  onClick: JSX.MouseEventHandler<HTMLElement>
}

export interface InputErrorIndicatorBindings {
  "aria-label": "Error"
  "data-part": "error-indicator"
  hidden: boolean
}

export interface InputInputBindings {
  "aria-describedby": string | undefined
  "aria-invalid": BooleanAriaAttr
  "aria-labelledby": string | undefined
  "data-empty": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  "data-part": "input"
  disabled: boolean | undefined
  form?: string
  id: string
  name?: string
  onBlur: JSX.FocusEventHandler
  onChange: JSX.ChangeEventHandler<HTMLInputElement>
  onFocus: JSX.FocusEventHandler
  required?: boolean
  value: string
}

export interface InputClearTriggerBindings {
  "aria-label": "Clear input"
  "data-disabled": BooleanDataAttr
  "data-part": "clear-trigger"
  disabled: boolean | undefined
  onClick: JSX.MouseEventHandler
}
