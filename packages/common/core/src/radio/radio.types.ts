// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {FieldApiProps} from "@qualcomm-ui/core/field"
import type {InputErrorTextBindings} from "@qualcomm-ui/core/input"
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
} from "@qualcomm-ui/utils/machine"

export type RadioOrientation = "horizontal" | "vertical"

export interface RadioApiProps extends FieldApiProps, CommonProperties {
  /**
   * The initial value of the checked radio when rendered.
   * Use when you don't need to control the value of the radio group.
   */
  defaultValue?: string | null | undefined

  /**
   * The id of the form that the input belongs to.
   */
  form?: string | undefined

  /**
   * The name of the input field. Useful for form submission.
   */
  name?: string | undefined

  /**
   * Function called once a radio is checked
   */
  onValueChange?: ((value: string | null) => void) | undefined

  /**
   * Orientation of the radio group
   *
   * @default 'vertical'
   */
  orientation?: RadioOrientation | undefined

  /**
   * The controlled value of the radio group
   */
  value?: string | null
}

type PropsWithDefault = keyof Pick<RadioApiProps, "dir" | "orientation">

export interface RadioElementIds {
  errorText: string
  item: string[]
  itemHiddenInput: string[]
  itemLabel: string[]
  label: string
  root: string
}

export interface RadioItemContext {
  disabled?: boolean | undefined
  value: string
}

export interface ItemState {
  /**
   * Whether the item is active or pressed
   */
  active: boolean

  /**
   * Whether the item is checked
   */
  checked: boolean

  /**
   * Whether the item is disabled
   */
  disabled: boolean

  /**
   *  Whether the item is focused
   */
  focused: boolean

  /**
   * Whether the item is focused and the focus is visible
   */
  focusVisible: boolean

  /**
   * Whether the item is hovered
   */
  hovered: boolean

  /**
   * The value of the item
   */
  value: string
}

interface PrivateContext {
  /**
   * The id of the active radio
   */
  activeValue: string | null

  /**
   * Whether the radio group's fieldset is disabled
   */
  fieldsetDisabled: boolean

  /**
   * The id of the focused radio
   */
  focusedValue: string | null

  /**
   * The id of the hovered radio
   */
  hoveredValue: string | null

  /**
   * The value of the checked radio
   */
  value: string | null
}

export interface RadioSchema extends MachineSchema {
  actions: ActionSchema<
    | "focusInput"
    | "dispatchChangeEvent"
    | "setActive"
    | "setFocused"
    | "setHovered"
    | "setValue"
    | "syncInputElements"
  >
  computed: {
    disabled: boolean
  }
  context: PrivateContext
  effects: EffectSchema<"trackFocusVisible" | "trackFormControlState">
  events: Record<string, any> &
    (
      | {
          isTrusted: boolean
          type: "SET_VALUE"
          value: string | null
        }
      | {
          hovered?: boolean
          type: "SET_HOVERED"
          value: string | null
        }
      | {
          active?: boolean
          type: "SET_ACTIVE"
          value: string | null
        }
      | {
          focused?: boolean
          type: "SET_FOCUSED"
          value: string | null
        }
      | {
          focusVisible?: boolean
          type: "FOCUS_INPUT"
        }
    )
  guards: GuardSchema<"isTrusted">
  ids: RadioElementIds
  props: RequiredBy<RadioApiProps, PropsWithDefault>
  state: "idle"
}

export interface RadioCommonBindings extends Required<DirectionProperty> {
  "data-scope": "radio"
}

export interface RadioItemDataBindings {
  "data-disabled": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-focus-visible": BooleanDataAttr
  "data-hover": BooleanDataAttr
  "data-readonly": BooleanDataAttr
  "data-state": "checked" | "unchecked"
}

export interface RadioGroupBindings extends RadioCommonBindings {
  "aria-describedby": string | undefined
  "aria-invalid": BooleanAriaAttr
  "aria-labelledby": string | undefined
  "aria-orientation": RadioOrientation
  "data-disabled": BooleanDataAttr
  "data-orientation": RadioOrientation
  "data-part": "group"
  id: string
  role: "radiogroup"
}

export interface RadioGroupItemsBindings extends RadioCommonBindings {
  "data-orientation": RadioOrientation
  "data-part": "items"
}

export interface RadioGroupLabelBindings {
  "data-disabled": BooleanDataAttr
  "data-part": "label"
  id: string
  onClick: JSX.MouseEventHandler
}

export interface RadioItemBindings
  extends RadioItemDataBindings,
    RadioCommonBindings {
  "data-part": "item"
  htmlFor: string
  onClick: JSX.MouseEventHandler
  onPointerDown: JSX.PointerEventHandler
  onPointerLeave: JSX.PointerEventHandler
  onPointerMove: JSX.PointerEventHandler
  onPointerUp: JSX.PointerEventHandler
}

export interface RadioItemLabelBindings
  extends RadioItemDataBindings,
    RadioCommonBindings {
  "data-part": "item-label"
  id: string
}

export interface RadioItemControlBindings
  extends RadioItemDataBindings,
    RadioCommonBindings {
  "aria-hidden": true
  "data-active": BooleanDataAttr
  "data-part": "item-control"
}

export interface RadioItemHiddenInputBindings
  extends RadioItemDataBindings,
    RadioCommonBindings {
  "aria-labelledby": string | undefined
  "data-ownedby": string
  "data-part": "item-hidden-input"
  defaultChecked: boolean
  disabled: boolean
  form?: string
  name?: string
  onBlur: JSX.FocusEventHandler<HTMLInputElement>
  onClick: JSX.MouseEventHandler<HTMLInputElement>
  onFocus: JSX.FocusEventHandler<HTMLInputElement>
  onKeyDown: JSX.KeyboardEventHandler<HTMLInputElement>
  onKeyUp: JSX.KeyboardEventHandler<HTMLInputElement>
  style: JSX.CSSProperties
  value: string
}

export interface RadioGroupErrorTextBindings
  extends RadioCommonBindings,
    InputErrorTextBindings {}

export interface RadioApi {
  /**
   * Function to clear the value of the radio group
   */
  clearValue: VoidFunction

  /**
   * Function to focus the radio group
   */
  focus: VoidFunction

  /**
   * Returns the state details of a radio input
   */
  getItemState: (props: RadioItemContext) => ItemState

  /**
   * Function to set the value of the radio group
   */
  setValue: (value: string) => void

  /**
   * The current value of the radio group
   */
  value: string | null

  // group: prop getters
  getGroupBindings: (props: IdRegistrationProps) => RadioGroupBindings
  getGroupErrorTextBindings: (
    props: IdRegistrationProps,
  ) => RadioGroupErrorTextBindings
  getGroupItemsBindings: () => RadioGroupItemsBindings
  getLabelBindings: (props: IdRegistrationProps) => RadioGroupLabelBindings
  getRadioBindings: (
    props: RadioItemContext & IdRegistrationProps,
  ) => RadioItemBindings
  getRadioControlBindings: (props: RadioItemContext) => RadioItemControlBindings
  getRadioHiddenInputBindings: (
    props: RadioItemContext & IdRegistrationProps,
  ) => RadioItemHiddenInputBindings
  getRadioLabelBindings: (
    props: RadioItemContext & IdRegistrationProps,
  ) => RadioItemLabelBindings
}
