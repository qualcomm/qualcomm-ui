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

import type {textAreaAnatomy} from "./text-area.anatomy"

export interface TextAreaElementIds {
  counter: string
  errorText: string
  hint: string
  input: string
  label: string
}

export interface TextAreaApiProps
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
  ids?: TextAreaElementIds | undefined

  /**
   * The maximum number of characters allowed in the textarea.
   */
  maxLength?: number | undefined

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

export interface TextAreaScope extends ScopeWithIds<TextAreaSchema> {}

interface TextAreaContext {
  fieldsetDisabled: boolean
  focused: boolean
  focusVisible: boolean
  value: string
}

export interface TextAreaSchema extends MachineSchema {
  actions: ActionSchema<
    "setValue" | "setFocused" | "focusInputEl" | "syncInputValue"
  >
  computed: {
    disabled: boolean
  }
  context: TextAreaContext
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
  ids: TextAreaElementIds
  props: RequiredBy<TextAreaApiProps, "defaultValue" | "dir">
  state: "idle"
}

type PartName = AnatomyPartName<typeof textAreaAnatomy>
interface Part<P extends PartName> extends AnatomyPart<"textArea", P> {}

export interface TextAreaRootBindings extends Part<"root"> {
  "data-disabled": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  dir: Direction
}

export interface TextAreaLabelBindings extends Part<"label"> {
  "data-disabled": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  dir: Direction
  htmlFor: string
  id: string
}

export interface TextAreaCounterBindings extends Part<"counter"> {
  "data-disabled": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  "data-max": number | undefined
  dir: Direction
  id: string
}

export interface TextAreaErrorTextBindings extends Part<"errorText"> {
  "aria-live": "polite"
  dir: Direction
  hidden: boolean
  id: string
}

export interface TextAreaHintBindings extends Part<"hint"> {
  "data-disabled": BooleanDataAttr
  dir: Direction
  hidden: boolean
  id: string
}

export interface TextAreaInputBindings extends Part<"input"> {
  "aria-describedby": string | undefined
  "aria-invalid": BooleanAriaAttr
  "aria-labelledby": string | undefined
  autoComplete: "off"
  autoCorrect: "off"
  "data-disabled": BooleanDataAttr
  "data-empty": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  "data-readonly": BooleanDataAttr
  defaultValue: string
  dir: Direction
  disabled: boolean | undefined
  form?: string
  id: string
  maxLength?: number | undefined
  name?: string
  onBlur: JSX.FocusEventHandler
  onChange: JSX.ChangeEventHandler<HTMLTextAreaElement>
  onClick: JSX.MouseEventHandler<HTMLElement>
  onFocus: JSX.FocusEventHandler
  readOnly: boolean | undefined
  required?: boolean
  spellCheck: "false"
}

export interface TextAreaApi {
  disabled: boolean | undefined
  focusInput(): void
  invalid: boolean | undefined
  maxLength: number | undefined
  required: boolean | undefined
  setValue(value: string): void
  value: string

  // group: element prop getters
  getCounterBindings(props: IdRegistrationProps): TextAreaCounterBindings
  getErrorTextBindings(props: IdRegistrationProps): TextAreaErrorTextBindings
  getHintBindings(props: IdRegistrationProps): TextAreaHintBindings
  getInputBindings(props: IdRegistrationProps): TextAreaInputBindings
  getLabelBindings(props: IdRegistrationProps): TextAreaLabelBindings
  getRootBindings(): TextAreaRootBindings
}
