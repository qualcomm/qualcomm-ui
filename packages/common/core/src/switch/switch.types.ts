// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {FieldApiProps} from "@qualcomm-ui/core/field"
import type {BooleanAriaAttr, BooleanDataAttr} from "@qualcomm-ui/utils/attributes"
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

export interface SwitchApiProps
  extends FieldApiProps,
    CommonProperties,
    DirectionProperty {
  /**
   * The controlled checked state of the switch
   */
  checked?: boolean | undefined

  /**
   * The initial checked state of the switch when rendered.
   * Use when you don't need to control the checked state of the switch.
   */
  defaultChecked?: boolean | undefined

  /**
   * The id of the form that the switch belongs to.
   */
  form?: string | undefined

  /**
   * The ids of the elements that are associated with the switch. These will be
   * automatically generated if omitted.
   */
  ids?: Partial<SwitchElementIds> | undefined

  /**
   * The name of the input field in a switch.
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
   * The value of switch input. Useful for form submission.
   * @default "on"
   */
  value?: string | undefined
}

export interface SwitchElementIds {
  errorText: string
  hiddenInput: string
  label: string
  root: string
}

export interface SwitchScope extends ScopeWithIds<SwitchSchema> {}

interface SwitchContext {
  active: boolean
  checked: boolean
  fieldsetDisabled: boolean
  focused: boolean
  focusVisible: boolean
  hovered: boolean
}

export interface SwitchSchema extends MachineSchema {
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
  }
  context: SwitchContext
  effects: EffectSchema<
    "trackPressEvent" | "trackFocusVisible" | "trackFormControlState"
  >
  events:
    | {
        context: Partial<SwitchContext>
        type: "CONTEXT.SET"
      }
    | {
        checked: boolean | undefined
        isTrusted?: boolean | undefined
        src?: string
        type: "CHECKED.SET"
      }
    | {
        isTrusted: boolean
        type: "CHECKED.TOGGLE"
      }
  guards: GuardSchema<"isTrusted">
  ids: SwitchElementIds
  props: RequiredBy<SwitchApiProps, "value" | "dir">
  state: "idle"
}

export interface SwitchScopeAttribute {
  "data-scope": "switch"
}

export interface SwitchDataBindings {
  "data-active": BooleanDataAttr
  "data-disabled": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-focus-visible": BooleanDataAttr
  "data-hover": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  "data-readonly": BooleanDataAttr
  "data-state": "checked" | "unchecked"
}

interface CommonBindings
  extends Required<DirectionProperty>,
    SwitchScopeAttribute,
    SwitchDataBindings {}

export interface SwitchRootBindings extends CommonBindings {
  "data-part": "root"
  htmlFor: string
  id: string
  onClick: JSX.MouseEventHandler
  onPointerLeave: JSX.PointerEventHandler
  onPointerMove: JSX.PointerEventHandler
}

export interface SwitchLabelBindings extends CommonBindings {
  "data-part": "label"
  id: string
}

export interface SwitchControlBindings extends CommonBindings {
  "aria-hidden": BooleanAriaAttr
  "data-part": "control"
}

export interface SwitchThumbBindings extends CommonBindings {
  "aria-hidden": true
  "data-part": "thumb"
}

export interface SwitchErrorTextBindings extends CommonBindings {
  "aria-live": "polite"
  "data-part": "error-text"
  hidden: boolean
  id: string
}

export interface SwitchHiddenInputBindings extends CommonBindings {
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

export interface SwitchApi {
  checked: boolean
  disabled: boolean | undefined
  focused: boolean
  invalid: boolean | undefined
  setChecked(checked: boolean): void
  toggleChecked(): void

  // group: element attr getters
  getControlBindings(): SwitchControlBindings
  getErrorTextBindings(props: IdRegistrationProps): SwitchErrorTextBindings
  getHiddenInputBindings(props: IdRegistrationProps): SwitchHiddenInputBindings
  getLabelBindings(props: IdRegistrationProps): SwitchLabelBindings
  getRootBindings(props: IdRegistrationProps): SwitchRootBindings
  getThumbBindings(): SwitchThumbBindings
}
