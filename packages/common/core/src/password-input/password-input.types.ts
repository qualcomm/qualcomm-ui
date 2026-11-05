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

import type {passwordInputAnatomy} from "./password-input.anatomy.js"

export interface PasswordInputIntlTranslations {
  visibilityTrigger?: ((visible: boolean) => string) | undefined
}

export interface PasswordInputElementIds {
  errorText: string
  hint: string
  input: string
  label: string
  visibilityTrigger: string
}

export interface PasswordInputApiProps
  extends FieldApiProps, CommonProperties, DirectionProperty {
  /**
   * The {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/autocomplete autocomplete}
   * attribute for the password input.
   *
   * @default "current-password"
   */
  autoComplete?: "current-password" | "new-password" | undefined

  /**
   * The initial value of the input when rendered.
   * Use when you don't need to control the value of the input.
   */
  defaultValue?: string | undefined

  /**
   * The default visibility of the password input.
   */
  defaultVisible?: boolean | undefined

  /**
   * The id of the form that the input belongs to.
   */
  form?: string | undefined

  /**
   * The ids of the elements that are associated with the input. These will be
   * automatically generated if omitted.
   */
  ids?: Partial<PasswordInputElementIds> | undefined

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
   * Function called when the visibility changes.
   */
  onVisibleChange?: ((visible: boolean) => void) | undefined

  /**
   * Localized messages to use for element labels.
   */
  translations?: PasswordInputIntlTranslations | undefined

  /**
   * The controlled value of the input
   */
  value?: string | undefined

  /**
   * Whether the password input is visible.
   */
  visible?: boolean | undefined
}

export interface PasswordInputScope extends ScopeWithIds<PasswordInputSchema> {}

interface PasswordInputContext {
  fieldsetDisabled: boolean
  focused: boolean
  focusVisible: boolean
  ssr: boolean
  value: string
  visible: boolean
}

export interface PasswordInputSchema extends MachineSchema {
  actions: ActionSchema<
    | "focusInputEl"
    | "setFocused"
    | "setValue"
    | "setVisibility"
    | "syncInputValue"
    | "toggleVisibility"
  >
  computed: {
    disabled: boolean
  }
  context: PasswordInputContext
  effects: EffectSchema<"syncSsr" | "trackFormControlState">
  events:
    | {
        focused: boolean
        focusVisible: boolean
        type: "FOCUSED.SET"
      }
    | {
        type: "VISIBILITY.SET"
        visible: boolean
      }
    | {
        type: "VALUE.SET"
        value: string
      }
    | {type: "INPUT.FOCUS"}
    | {type: "TRIGGER.CLICK"}

  ids: PasswordInputElementIds
  props: RequiredBy<
    PasswordInputApiProps,
    "autoComplete" | "defaultValue" | "defaultVisible" | "dir" | "translations"
  >
  state: "idle"
}

type PartName = AnatomyPartName<typeof passwordInputAnatomy>
interface Part<P extends PartName> extends AnatomyPart<"passwordInput", P> {}

export interface PasswordInputRootBindings extends Part<"root"> {
  "data-disabled": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  dir: Direction
}

export interface PasswordInputLabelBindings extends Part<"label"> {
  "data-disabled": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  htmlFor: string
  id: string
}

export interface PasswordInputErrorTextBindings extends Part<"errorText"> {
  "aria-live": "polite"
  hidden: boolean
  id: string
}

export interface PasswordInputHintBindings extends Part<"hint"> {
  "data-disabled": BooleanDataAttr
  hidden: boolean
  id: string
}

export interface PasswordInputErrorIndicatorBindings extends Part<"errorIndicator"> {
  "aria-label": "Error"
  hidden: boolean
}

export interface PasswordInputInputGroupBindings extends Part<"inputGroup"> {
  "data-disabled": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  "data-readonly": BooleanDataAttr
  onClick: JSX.MouseEventHandler<HTMLElement>
}

export interface PasswordInputInputBindings extends Part<"input"> {
  "aria-describedby": string | undefined
  "aria-invalid": BooleanAriaAttr
  "aria-labelledby": string | undefined
  autoComplete: "current-password" | "new-password" | undefined
  autoCorrect: "off"
  "data-empty": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  "data-readonly": BooleanDataAttr
  "data-state": "visible" | "hidden"
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
  type: "text" | "password"
}

export interface PasswordInputClearTriggerBindings extends Part<"clearTrigger"> {
  "aria-label": "Clear input"
  "data-disabled": BooleanDataAttr
  disabled: boolean | undefined
  onClick: JSX.MouseEventHandler
  type: "button"
}

export interface PasswordInputVisibilityTriggerBindings extends Part<"visibilityTrigger"> {
  "aria-controls": string
  "aria-expanded": BooleanAriaAttr
  "aria-label": string
  "data-disabled": BooleanDataAttr
  "data-readonly": BooleanDataAttr
  "data-state": "visible" | "hidden"
  disabled: boolean
  id: string
  onPointerDown: JSX.PointerEventHandler
  tabIndex: -1
  type: "button"
}

// TODO: separate this into a separate InputApi to share between number/text?
//  It'll probably save a few KB.
export interface PasswordInputApi {
  disabled: boolean | undefined
  focusInput(): void
  invalid: boolean | undefined
  required: boolean | undefined
  setValue(value: string): void
  setVisible(visible: boolean): void
  toggleVisible(): void
  value: string
  visible: boolean

  // group: element prop getters
  getClearTriggerBindings(): PasswordInputClearTriggerBindings
  getErrorIndicatorBindings(): PasswordInputErrorIndicatorBindings
  getErrorIndicatorBindings(): PasswordInputErrorIndicatorBindings
  getErrorTextBindings(
    props: IdRegistrationProps,
  ): PasswordInputErrorTextBindings
  getHintBindings(props: IdRegistrationProps): PasswordInputHintBindings
  getInputBindings(props: IdRegistrationProps): PasswordInputInputBindings
  getInputGroupBindings(): PasswordInputInputGroupBindings
  getLabelBindings(props: IdRegistrationProps): PasswordInputLabelBindings
  getRootBindings(): PasswordInputRootBindings
  getVisibilityTriggerBindings(
    props: IdRegistrationProps,
  ): PasswordInputVisibilityTriggerBindings
}
