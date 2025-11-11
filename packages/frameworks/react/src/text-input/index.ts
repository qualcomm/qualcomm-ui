import {TextInput as SimpleTextInput, type TextInputProps} from "./text-input"
import {
  TextInputClearTrigger,
  type TextInputClearTriggerProps,
} from "./text-input-clear-trigger"
import {
  TextInputErrorIndicator,
  type TextInputErrorIndicatorProps,
} from "./text-input-error-indicator"
import {
  TextInputErrorText,
  type TextInputErrorTextProps,
} from "./text-input-error-text"
import {TextInputHint, type TextInputHintProps} from "./text-input-hint"
import {TextInputInput, type TextInputInputProps} from "./text-input-input"
import {
  TextInputInputGroup,
  type TextInputInputGroupProps,
} from "./text-input-input-group"
import {TextInputLabel, type TextInputLabelProps} from "./text-input-label"
import {TextInputRoot, type TextInputRootProps} from "./text-input-root"

export type {
  TextInputClearTriggerProps,
  TextInputErrorIndicatorProps,
  TextInputErrorTextProps,
  TextInputHintProps,
  TextInputInputGroupProps,
  TextInputInputProps,
  TextInputLabelProps,
  TextInputRootProps,
  TextInputProps,
}

type TextInputComponent = typeof SimpleTextInput & {
  /**
   * Button that clears the input value. Renders a `<button>` element by default.
   */
  ClearTrigger: typeof TextInputClearTrigger
  /**
   * Visual indicator displayed when the input is invalid. Renders a `<div>` element
   * by default.
   */
  ErrorIndicator: typeof TextInputErrorIndicator
  /**
   * Error message displayed when the input is invalid. Renders a `<div>` element by
   * default.
   */
  ErrorText: typeof TextInputErrorText
  /**
   * Helper text displayed below the input. Renders a `<div>` element by default.
   */
  Hint: typeof TextInputHint
  /**
   * The text input element. Renders an `<input>` element.
   */
  Input: typeof TextInputInput
  /**
   * Container that wraps the input element and optional icons. Renders a `<div>`
   * element by default.
   */
  InputGroup: typeof TextInputInputGroup
  /**
   * An accessible label that is automatically associated with the input. Renders a
   * `<label>` element by default.
   */
  Label: typeof TextInputLabel
  /**
   * Groups all parts of the text input. Renders a `<div>` element by default.
   */
  Root: typeof TextInputRoot
}

export const TextInput: TextInputComponent =
  SimpleTextInput as TextInputComponent

TextInput.ClearTrigger = TextInputClearTrigger
TextInput.ErrorIndicator = TextInputErrorIndicator
TextInput.ErrorText = TextInputErrorText
TextInput.Hint = TextInputHint
TextInput.InputGroup = TextInputInputGroup
TextInput.Input = TextInputInput
TextInput.Label = TextInputLabel
TextInput.Root = TextInputRoot
