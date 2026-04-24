// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {AnatomyPart, AnatomyPartName} from "@qualcomm-ui/utils/anatomy"
import type {
  BooleanAriaAttr,
  BooleanDataAttr,
} from "@qualcomm-ui/utils/attributes"
import type {JSX} from "@qualcomm-ui/utils/machine"

import type {inputAnatomy} from "./input.anatomy"

type PartName = AnatomyPartName<typeof inputAnatomy>
interface Part<P extends PartName> extends AnatomyPart<"input", P> {}

export interface InputRootBindings extends Part<"root"> {
  "data-disabled": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-invalid": BooleanDataAttr
}

export interface InputLabelBindings extends Part<"label"> {
  "data-disabled": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  htmlFor: string
  id: string
}

export interface InputCounterBindings extends Part<"counter"> {
  "data-disabled": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  "data-max": number | undefined
  id: string
}

export interface InputErrorTextBindings extends Part<"errorText"> {
  "aria-live": "polite"
  hidden: boolean
  id: string
}

export interface InputHintBindings extends Part<"hint"> {
  "data-disabled": BooleanDataAttr
  hidden: boolean
  id: string
}

export interface InputInputGroupBindings extends Part<"inputGroup"> {
  "data-disabled": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  "data-readonly": BooleanDataAttr
  onClick: JSX.MouseEventHandler<HTMLElement>
}

export interface InputErrorIndicatorBindings extends Part<"errorIndicator"> {
  "aria-label": "Error"
  hidden: boolean
}

export interface InputInputBindings extends Part<"input"> {
  "aria-describedby": string | undefined
  "aria-invalid": BooleanAriaAttr
  "aria-labelledby": string | undefined
  "data-empty": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  defaultValue: string
  disabled: boolean | undefined
  form?: string
  id: string
  name?: string
  onBlur: JSX.FocusEventHandler
  onChange: JSX.ChangeEventHandler<HTMLInputElement>
  onFocus: JSX.FocusEventHandler
  required?: boolean
}

export interface InputClearTriggerBindings extends Part<"clearTrigger"> {
  "aria-label": "Clear input"
  "data-disabled": BooleanDataAttr
  disabled: boolean | undefined
  onClick: JSX.MouseEventHandler
  type: "button"
}
