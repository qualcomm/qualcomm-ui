// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {FieldApiProps} from "@qualcomm-ui/core/field"
import type {
  BooleanAriaAttr,
  BooleanDataAttr,
} from "@qualcomm-ui/utils/attributes"
import type {DirectionProperty} from "@qualcomm-ui/utils/direction"
import type {RequiredBy} from "@qualcomm-ui/utils/guard"
import type {
  ActionSchema,
  CommonProperties,
  EffectSchema,
  GuardSchema,
  IdRegistrationProps,
  JSX,
  MachineSchema,
  ScopeWithIds,
} from "@qualcomm-ui/utils/machine"

export interface CheckboxApiProps
  extends FieldApiProps,
    CommonProperties,
    DirectionProperty {
  /**
   * The controlled checked state of the checkbox
   */
  checked?: boolean | undefined

  /**
   * The initial checked state of the checkbox when rendered.
   * Use when you don't need to control the checked state of the checkbox.
   */
  defaultChecked?: boolean | undefined

  /**
   * The id of the form that the checkbox belongs to.
   */
  form?: string | undefined

  /**
   * The ids of the elements that are associated with the checkbox. These will be
   * automatically generated if omitted.
   */
  ids?: Partial<CheckboxElementIds> | undefined

  /**
   * If true and the checkbox is not checked, the checkbox will be in the
   * `indeterminate` state.
   */
  indeterminate?: boolean | undefined

  /**
   * The name of the input field in a checkbox.
   * Useful for form submission.
   */
  name?: string | undefined

  /**
   * The callback invoked when the checked state changes.
   */
  onCheckedChange?: ((checked: boolean) => void) | undefined

  /**
   * The callback invoked when the field is focused.
   */
  onFocusChange?: ((focused: boolean) => void) | undefined

  /**
   * The value of checkbox input. Useful for form submission.
   * @default "on"
   */
  value?: string | undefined
}

export interface CheckboxElementIds {
  control: string
  errorText: string
  hiddenInput: string
  label: string
  root: string
}

export interface CheckboxScope extends ScopeWithIds<CheckboxSchema> {}

interface CheckboxContext {
  active: boolean
  checked: boolean
  fieldsetDisabled: boolean
  focused: boolean
  focusVisible: boolean
  hovered: boolean
}

export interface CheckboxSchema extends MachineSchema {
  actions: ActionSchema<
    | "dispatchChangeEvent"
    | "removeFocusIfNeeded"
    | "setChecked"
    | "setContext"
    | "syncInputElement"
    | "toggleChecked"
  >
  computed: {
    disabled: boolean | undefined
    indeterminate: boolean | undefined
  }
  context: CheckboxContext
  effects: EffectSchema<
    "trackPressEvent" | "trackFocusVisible" | "trackFormControlState"
  >
  events:
    | {
        context: Partial<CheckboxContext>
        type: "CONTEXT.SET"
      }
    | {
        checked: boolean | undefined
        isTrusted: boolean
        type: "CHECKED.SET"
      }
    | {
        isTrusted: boolean
        type: "CHECKED.TOGGLE"
      }
  guards: GuardSchema<"isTrusted">
  ids: CheckboxElementIds
  props: RequiredBy<CheckboxApiProps, "value" | "dir">
  state: "idle"
}

export interface CheckboxScopeAttribute {
  "data-scope": "checkbox"
}

export interface CheckboxDataBindings {
  "data-active": BooleanDataAttr
  "data-disabled": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-focus-visible": BooleanDataAttr
  "data-hover": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  "data-readonly": BooleanDataAttr
  "data-state": "checked" | "indeterminate" | "unchecked"
}

interface CommonBindings
  extends Required<DirectionProperty>,
    CheckboxScopeAttribute,
    CheckboxDataBindings {}

export interface CheckboxRootBindings extends CommonBindings {
  "data-part": "root"
  htmlFor: string | undefined
  id: string
  onClick: JSX.MouseEventHandler
  onPointerLeave: JSX.PointerEventHandler
  onPointerMove: JSX.PointerEventHandler
}

export interface CheckboxLabelBindings extends CommonBindings {
  "data-part": "label"
  id: string
}

export interface CheckboxControlBindings extends CommonBindings {
  "aria-hidden": BooleanAriaAttr
  "data-part": "control"
  id: string
}

export interface CheckboxIndicatorBindings extends CommonBindings {
  "data-part": "indicator"
  hidden: boolean
}

export interface CheckboxErrorTextBindings extends CommonBindings {
  "aria-live": "polite"
  "data-part": "error-text"
  hidden: boolean
  id: string
}

export interface CheckboxHiddenInputBindings extends CommonBindings {
  "aria-invalid": BooleanAriaAttr
  "aria-labelledby": string | undefined
  "data-part": "hidden-input"
  defaultChecked: boolean
  disabled: boolean | undefined
  form?: string
  id: string
  name?: string
  onBlur: JSX.FocusEventHandler
  onClick: JSX.MouseEventHandler<HTMLInputElement>
  onFocus: JSX.FocusEventHandler
  required?: boolean
  style: JSX.CSSProperties
  type: "checkbox"
  value?: string
}

export interface CheckboxApi {
  checked: boolean
  disabled: boolean | undefined
  focused: boolean
  indeterminate: boolean | undefined
  invalid: boolean | undefined
  setChecked(checked: boolean): void
  toggleChecked(): void

  // group: element attr getters
  getControlBindings(props: IdRegistrationProps): CheckboxControlBindings
  getErrorTextBindings(props: IdRegistrationProps): CheckboxErrorTextBindings
  getHiddenInputBindings(
    props: IdRegistrationProps,
  ): CheckboxHiddenInputBindings
  getIndicatorBindings(): CheckboxIndicatorBindings
  getLabelBindings(props: IdRegistrationProps): CheckboxLabelBindings
  getRootBindings(props: IdRegistrationProps): CheckboxRootBindings
}
