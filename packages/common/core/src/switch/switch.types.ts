// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {FieldApiProps} from "@qualcomm-ui/core/field"
import type {AnatomyPart, AnatomyPartName} from "@qualcomm-ui/utils/anatomy"
import type {
  BooleanAriaAttr,
  BooleanDataAttr,
} from "@qualcomm-ui/utils/attributes"
import type {Direction, DirectionProperty} from "@qualcomm-ui/utils/direction"
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

import type {switchAnatomy} from "./switch.anatomy"

export interface SwitchApiProps
  extends FieldApiProps, CommonProperties, DirectionProperty {
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
  hint: string
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

type PartName = AnatomyPartName<typeof switchAnatomy>
interface Part<P extends PartName> extends AnatomyPart<"switch", P> {}

export interface SwitchRootBindings extends Part<"root">, SwitchDataBindings {
  dir: Direction
  htmlFor: string
  id: string
  onClick: JSX.MouseEventHandler
  onPointerLeave: JSX.PointerEventHandler
  onPointerMove: JSX.PointerEventHandler
}

export interface SwitchLabelBindings extends Part<"label">, SwitchDataBindings {
  id: string
}

export interface SwitchControlBindings
  extends Part<"control">, SwitchDataBindings {
  "aria-hidden": BooleanAriaAttr
}

export interface SwitchThumbBindings extends Part<"thumb">, SwitchDataBindings {
  "aria-hidden": true
}

export interface SwitchErrorTextBindings
  extends Part<"errorText">, SwitchDataBindings {
  "aria-live": "polite"
  hidden: boolean
  id: string
}

export interface SwitchHintBindings extends Part<"hint">, SwitchDataBindings {
  hidden: boolean
  id: string
}

export interface SwitchHiddenInputBindings
  extends Part<"hiddenInput">, SwitchDataBindings {
  "aria-invalid": BooleanAriaAttr
  "aria-labelledby": string | undefined
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
  getHintBindings(props: IdRegistrationProps): SwitchHintBindings
  getLabelBindings(props: IdRegistrationProps): SwitchLabelBindings
  getRootBindings(props: IdRegistrationProps): SwitchRootBindings
  getThumbBindings(): SwitchThumbBindings
}
