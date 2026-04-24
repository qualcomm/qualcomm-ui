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
  IdRegistrationProps,
  JSX,
  MachineSchema,
  ScopeWithIds,
} from "@qualcomm-ui/utils/machine"

import type {textInputAnatomy} from "./text-input.anatomy"

export interface TextInputElementIds {
  errorText: string
  hint: string
  input: string
  label: string
}

export interface TextInputApiProps
  extends FieldApiProps, CommonProperties, DirectionProperty {
  /**
   * The initial value of the input when rendered.
   * Use when you don't need to control the value of the input.
   */
  defaultValue?: string | undefined

  /**
   * The id of the form that the input belongs to.
   */
  form?: string | undefined

  /**
   * The ids of the elements that are associated with the input. These will be
   * automatically generated if omitted.
   */
  ids?: TextInputElementIds | undefined

  /**
   * The name of the input field. Useful for form submission.
   */
  name?: string | undefined

  /**
   * The callback invoked when the field is focused or blurred.
   */
  onFocusChange?: ((focused: boolean) => void) | undefined

  /**
   * The callback invoked when the value changes.
   */
  onValueChange?: ((value: string) => void) | undefined

  /**
   * The controlled value of the input
   */
  value?: string | undefined
}

export interface TextInputScope extends ScopeWithIds<TextInputSchema> {}

interface TextInputContext {
  fieldsetDisabled: boolean
  focused: boolean
  focusVisible: boolean
  value: string
}

export interface TextInputSchema extends MachineSchema {
  actions: ActionSchema<
    "focusInputEl" | "setFocused" | "setValue" | "syncInputValue"
  >
  computed: {
    disabled: boolean
  }
  context: TextInputContext
  effects: EffectSchema<"trackFormControlState">
  events:
    | {
        focused: boolean
        focusVisible: boolean
        type: "FOCUSED.SET"
      }
    | {
        type: "VALUE.SET"
        value: string
      }
    | {type: "INPUT.FOCUS"}
  ids: TextInputElementIds
  props: RequiredBy<TextInputApiProps, "defaultValue" | "dir">
  state: "idle"
}

type PartName = AnatomyPartName<typeof textInputAnatomy>
interface Part<P extends PartName> extends AnatomyPart<"textInput", P> {}

export interface TextInputRootBindings extends Part<"root"> {
  "data-disabled": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  dir: Direction
}

export interface TextInputLabelBindings extends Part<"label"> {
  "data-disabled": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  htmlFor: string
  id: string
}

export interface TextInputErrorTextBindings extends Part<"errorText"> {
  "aria-live": "polite"
  hidden: boolean
  id: string
}

export interface TextInputHintBindings extends Part<"hint"> {
  "data-disabled": BooleanDataAttr
  hidden: boolean
  id: string
}

export interface TextInputClearTriggerBindings extends Part<"clearTrigger"> {
  "aria-label": "Clear input"
  "data-disabled": BooleanDataAttr
  disabled: boolean | undefined
  onClick: JSX.MouseEventHandler
  type: "button"
}

export interface TextInputInputGroupBindings extends Part<"inputGroup"> {
  "data-disabled": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  "data-readonly": BooleanDataAttr
  onClick: JSX.MouseEventHandler<HTMLElement>
}

export interface TextInputErrorIndicatorBindings extends Part<"errorIndicator"> {
  "aria-label": "Error"
  hidden: boolean
}

export interface TextInputInputBindings extends Part<"input"> {
  "aria-describedby": string | undefined
  "aria-invalid": BooleanAriaAttr
  "aria-labelledby": string | undefined
  autoComplete: "off"
  autoCorrect: "off"
  "data-empty": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  "data-readonly": BooleanDataAttr
  defaultValue: string
  disabled: boolean | undefined
  form?: string
  id: string
  name?: string
  onBlur: JSX.FocusEventHandler
  onChange: JSX.ChangeEventHandler<HTMLInputElement>
  onFocus: JSX.FocusEventHandler
  readOnly: boolean | undefined
  required?: boolean
  spellCheck: "false"
  type: "text"
}

export interface TextInputApi {
  disabled: boolean | undefined
  focusInput(): void
  invalid: boolean | undefined
  required: boolean | undefined
  setValue(value: string): void
  value: string

  // group: element prop getters
  getClearTriggerBindings(): TextInputClearTriggerBindings
  getErrorIndicatorBindings(): TextInputErrorIndicatorBindings
  getErrorTextBindings(props: IdRegistrationProps): TextInputErrorTextBindings
  getHintBindings(props: IdRegistrationProps): TextInputHintBindings
  getInputBindings(props: IdRegistrationProps): TextInputInputBindings
  getInputGroupBindings(): TextInputInputGroupBindings
  getLabelBindings(props: IdRegistrationProps): TextInputLabelBindings
  getRootBindings(): TextInputRootBindings
}
