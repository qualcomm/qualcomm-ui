// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {NumberFormatter, NumberParser} from "@internationalized/number"

import type {FieldApiProps} from "@qualcomm-ui/core/field"
import type {
  InputErrorIndicatorBindings,
  InputErrorTextBindings,
  InputHintBindings,
  InputInputGroupBindings,
  InputLabelBindings,
} from "@qualcomm-ui/core/input"
import type {
  BooleanAriaAttr,
  BooleanDataAttr,
} from "@qualcomm-ui/utils/attributes"
import type {
  DirectionProperty,
  LocaleProperty,
} from "@qualcomm-ui/utils/direction"
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

export interface NumberInputValueChangeDetails {
  value: string
  valueAsNumber: number
}

export interface NumberInputFocusChangeDetails
  extends NumberInputValueChangeDetails {
  focused: boolean
}

export type NumberInputValidityState = "rangeUnderflow" | "rangeOverflow"

export interface NumberInputValueInvalidDetails
  extends NumberInputValueChangeDetails {
  reason: NumberInputValidityState
}

export interface NumberInputIntlTranslations {
  /**
   * The label for the decrement button
   */
  decrementLabel?: string | undefined

  /**
   * The label foe the increment button
   */
  incrementLabel?: string | undefined

  /**
   * Function that returns the human-readable value.
   * It is used to set the `aria-valuetext` property of the input
   */
  valueText?: ((value: string) => string) | undefined
}

export type NumberInputMode = "text" | "tel" | "numeric" | "decimal"

export interface NumberInputApiProps
  extends FieldApiProps,
    CommonProperties,
    DirectionProperty,
    LocaleProperty {
  /**
   * Whether to allow mouse wheel to change the value
   */
  allowMouseWheel?: boolean | undefined

  /**
   * Whether to allow the value to overflow the min/max range
   * @default true
   */
  allowOverflow?: boolean | undefined

  /**
   * Whether to clamp the value when the input loses focus (blur)
   * @default true
   */
  clampValueOnBlur?: boolean | undefined

  /**
   * The initial value of the input when rendered.
   * Use when you don't need to control the value of the input.
   */
  defaultValue?: string | undefined

  /**
   * Whether to focus the input when the value changes
   * @default true
   */
  focusInputOnChange?: boolean | undefined

  /**
   * The associate form of the input element.
   */
  form?: string | undefined

  /**
   * The options to pass to the `Intl.NumberFormat` constructor
   */
  formatOptions?: Intl.NumberFormatOptions | undefined

  /**
   * The ids of the elements that are associated with the input. These will be
   * automatically generated if omitted.
   */
  ids?: Partial<NumberInputElementIds> | undefined

  /**
   * Hints at the type of data that might be entered by the user. It also determines
   * the type of keyboard shown to the user on mobile devices
   * @default "decimal"
   */
  inputMode?: NumberInputMode | undefined

  /**
   * The maximum value of the number input
   * @default Number.MAX_SAFE_INTEGER
   */
  max?: number | undefined

  /**
   * The minimum value of the number input
   * @default Number.MIN_SAFE_INTEGER
   */
  min?: number | undefined

  /**
   * The name attribute of the number input. Useful for form submission.
   */
  name?: string | undefined

  /**
   * Function invoked when the number input is focused
   * @inheritDoc
   */
  onFocusChange?: ((details: NumberInputFocusChangeDetails) => void) | undefined

  /**
   * Function invoked when the value changes
   * @inheritDoc
   */
  onValueChange?: ((details: NumberInputValueChangeDetails) => void) | undefined

  /**
   * Function invoked when the value overflows or underflows the min/max range
   * @inheritDoc
   */
  onValueInvalid?:
    | ((details: NumberInputValueInvalidDetails) => void)
    | undefined

  /**
   * The pattern used to check the <input> element's value against
   *
   * @default "[0-9]*(.[0-9]+)?"
   */
  pattern?: string | undefined

  /**
   * Whether to spin the value when the increment/decrement button is pressed
   * @default true
   */
  spinOnPress?: boolean | undefined

  /**
   * Amount to increment/decrement the value when using stepper buttons or arrow keys.
   * @default 1
   */
  step?: number | undefined

  /**
   * Specifies the localized strings that identify the accessibility elements and
   * their states
   */
  translations?: NumberInputIntlTranslations | undefined

  /**
   * The controlled value of the input
   */
  value?: string | undefined
}

type PropsWithDefault =
  | "dir"
  | "locale"
  | "focusInputOnChange"
  | "clampValueOnBlur"
  | "allowOverflow"
  | "inputMode"
  | "pattern"
  | "translations"
  | "step"
  | "spinOnPress"
  | "min"
  | "max"

type ComputedContext = Readonly<{
  /**
   * Whether the decrement button is enabled
   */
  canDecrement: boolean

  /**
   * Whether the increment button is enabled
   */
  canIncrement: boolean

  /**
   * The formatted value of the input
   */
  formattedValue: string

  /**
   * The number i18n formatter
   */
  formatter: NumberFormatter

  /**
   * Whether the value is at the max
   */
  isAtMax: boolean

  /**
   * Whether the value is at the min
   */
  isAtMin: boolean

  /**
   * Whether the input is disabled
   */
  isDisabled: boolean

  /**
   * Whether the value is out of the min/max range
   */
  isOutOfRange: boolean

  /**
   * Whether the writing direction is RTL
   */
  isRtl: boolean

  /**
   * Whether the value is empty
   */
  isValueEmpty: boolean

  /**
   * The number i18n parser
   */
  parser: NumberParser

  /**
   * The value of the input as a number
   */
  valueAsNumber: number

  /**
   * The `aria-valuetext` attribute of the input
   */
  valueText: string | undefined
}>

export interface NumberInputElementIds {
  decrementTrigger: string
  errorText: string
  hint: string
  incrementTrigger: string
  input: string
  label: string
}

export type HintValue = "increment" | "decrement" | "set"

interface PrivateContext {
  /**
   * Whether the checkbox's fieldset is disabled
   */
  fieldsetDisabled: boolean

  /**
   * The hint that determines if we're incrementing or decrementing
   */
  hint: HintValue | null

  /**
   * The value of the input
   */
  value: string
}

export interface NumberInputScope extends ScopeWithIds<NumberInputSchema> {}

export interface NumberInputSchema extends MachineSchema {
  actions: ActionSchema<
    | "clearHint"
    | "clearValue"
    | "decrement"
    | "decrementToMin"
    | "focusInput"
    | "increment"
    | "incrementToMax"
    | "invokeOnBlur"
    | "invokeOnFocus"
    | "invokeOnInvalid"
    | "setClampedValue"
    | "setFormattedValue"
    | "setHint"
    | "setRawValue"
    | "setValue"
    | "syncInputElement"
  >
  computed: ComputedContext
  context: PrivateContext
  effects: EffectSchema<
    | "attachWheelListener"
    | "spinValue"
    | "trackButtonDisabled"
    | "trackFormControl"
    | "waitForChangeDelay"
  >
  events:
    | {
        focused: boolean
        focusVisible: boolean
        type: "FOCUSED.SET"
      }
    | {
        type: "VALUE.SET"
        value: number
      }
    | {
        hint: "set"
        target: JSX.FormEvent<HTMLInputElement>["currentTarget"]
        type: "INPUT.CHANGE"
      }
    | {
        hint?: "increment" | "decrement"
        pointerType?: JSX.PointerEvent<HTMLButtonElement>["pointerType"]
        src?: string
        type: "TRIGGER.PRESS_DOWN" | "TRIGGER.PRESS_UP"
      }
    | {
        step: number
        type: "INPUT.ARROW_UP" | "INPUT.ARROW_DOWN"
      }
    | {
        type:
          | "CHANGE_DELAY"
          | "INPUT.BLUR"
          | "INPUT.END"
          | "INPUT.ENTER"
          | "INPUT.FOCUS"
          | "INPUT.HOME"
          | "SPIN"
          | "VALUE.CLEAR"
          | "VALUE.DECREMENT"
          | "VALUE.INCREMENT"
      }
  guards: GuardSchema<
    | "clampValueOnBlur"
    | "spinOnPress"
    | "isInRange"
    | "isDecrementHint"
    | "isIncrementHint"
    | "isTouchPointer"
  >
  ids: NumberInputElementIds
  props: RequiredBy<NumberInputApiProps, PropsWithDefault>
  state: "idle" | "focused" | "before:spin" | "spinning"
}

export interface NumberInputScopeAttribute {
  "data-scope": "number-input"
}

interface CommonBindings
  extends Required<DirectionProperty>,
    NumberInputScopeAttribute {}

export interface NumberInputErrorTextBindings
  extends InputErrorTextBindings,
    CommonBindings {}

export interface NumberInputHintBindings
  extends InputHintBindings,
    CommonBindings {}

export interface NumberInputLabelBindings
  extends InputLabelBindings,
    CommonBindings {}

export interface NumberInputInputGroupBindings
  extends CommonBindings,
    InputInputGroupBindings {}

export interface NumberInputErrorIndicatorBindings
  extends CommonBindings,
    InputErrorIndicatorBindings {}

export interface NumberInputControlBindings extends CommonBindings {
  "aria-disabled": BooleanAriaAttr
  "aria-invalid": BooleanAriaAttr
  "data-disabled": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  "data-part": "control"
  role: "group"
}

export interface NumberInputDecrementTriggerBindings extends CommonBindings {
  "aria-controls": string
  "aria-label": string | undefined
  "data-disabled": BooleanDataAttr | undefined
  "data-part": "decrement-trigger"
  disabled: boolean | undefined
  id: string
  onPointerDown: JSX.PointerEventHandler<HTMLButtonElement>
  onPointerLeave: JSX.PointerEventHandler<HTMLButtonElement>
  onPointerUp: JSX.PointerEventHandler<HTMLButtonElement>
  tabIndex: -1
  type: "button"
}

export interface NumberInputIncrementTriggerBindings
  extends Omit<NumberInputDecrementTriggerBindings, "data-part"> {
  "data-part": "increment-trigger"
}

export interface NumberInputValueTextBindings extends CommonBindings {
  "data-disabled": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  "data-part": "value-text"
}

export interface NumberInputInputBindings extends CommonBindings {
  "aria-invalid": BooleanAriaAttr
  "aria-roledescription": "numberfield"
  "aria-valuemax": number
  "aria-valuemin": number
  "aria-valuenow": number | undefined
  "aria-valuetext": string | undefined
  autoComplete: "off"
  autoCorrect: "off"
  "data-disabled": BooleanDataAttr
  "data-empty": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  "data-part": "input"
  defaultValue: string
  disabled: boolean | undefined
  form: string | undefined
  id: string
  inputMode: NumberInputMode
  name: string | undefined
  onBeforeInput: JSX.FormEventHandler<HTMLInputElement>
  onBlur: JSX.FocusEventHandler<HTMLInputElement>
  onFocus: JSX.FocusEventHandler<HTMLInputElement>
  onInput: JSX.FormEventHandler<HTMLInputElement>
  onKeyDown: JSX.KeyboardEventHandler<HTMLInputElement>
  pattern: string
  readOnly: boolean | undefined
  required: boolean | undefined
  role: "spinbutton"
  spellCheck: "false"
  type: "text"
}

export interface NumberInputRootBindings extends CommonBindings {
  "data-disabled": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  "data-part": "root"
}

export interface NumberInputApi {
  /**
   * Function to clear the value of the input.
   */
  clearValue(): void

  /**
   * Function to decrement the value of the input by the step.
   */
  decrement(): void

  /**
   * Whether the input value is empty.
   */
  empty: boolean

  /**
   * Function to focus the input.
   */
  focus(): void

  /**
   * Whether the input is focused.
   */
  focused: boolean

  /**
   * Function to increment the value of the input by the step.
   */
  increment(): void

  /**
   * Whether the input is invalid.
   */
  invalid: boolean

  /**
   * Whether the input is required.
   */
  required: boolean | undefined

  /**
   * Function to set the value of the input to the max.
   */
  setToMax(): void

  /**
   * Function to set the value of the input to the min.
   */
  setToMin(): void

  /**
   * Function to set the value of the input.
   */
  setValue(value: number): void

  /**
   * The formatted value of the input.
   */
  value: string

  /**
   * The value of the input as a number.
   */
  valueAsNumber: number

  // group: prop getters
  getControlBindings(): NumberInputControlBindings
  getDecrementTriggerBindings(
    props: IdRegistrationProps,
  ): NumberInputDecrementTriggerBindings
  getErrorIndicatorBindings(): NumberInputErrorIndicatorBindings
  getErrorTextBindings(props: IdRegistrationProps): NumberInputErrorTextBindings
  getHintBindings(props: IdRegistrationProps): NumberInputHintBindings
  getIncrementTriggerBindings(
    props: IdRegistrationProps,
  ): NumberInputIncrementTriggerBindings
  getInputBindings(props: IdRegistrationProps): NumberInputInputBindings
  getInputGroupBindings(): NumberInputInputGroupBindings
  getLabelBindings(props: IdRegistrationProps): NumberInputLabelBindings
  getRootBindings(): NumberInputRootBindings
  getValueTextBindings(): NumberInputValueTextBindings
}
