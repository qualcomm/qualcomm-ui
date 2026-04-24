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

export {Input, type InputProps} from "./input"

export type {
  TextInputClearTriggerProps,
  TextInputErrorIndicatorProps,
  TextInputErrorTextProps,
  TextInputHintProps,
  TextInputInputGroupProps,
  TextInputInputProps,
  TextInputLabelProps,
  TextInputProps,
  TextInputRootProps,
}

type TextInputComponent = typeof SimpleTextInput & {
  ClearTrigger: typeof TextInputClearTrigger
  ErrorIndicator: typeof TextInputErrorIndicator
  ErrorText: typeof TextInputErrorText
  Hint: typeof TextInputHint
  Input: typeof TextInputInput
  InputGroup: typeof TextInputInputGroup
  Label: typeof TextInputLabel
  Root: typeof TextInputRoot
}

export const TextInput: TextInputComponent =
  SimpleTextInput as TextInputComponent

TextInput.ClearTrigger = TextInputClearTrigger
TextInput.ErrorIndicator = TextInputErrorIndicator
TextInput.ErrorText = TextInputErrorText
TextInput.Hint = TextInputHint
TextInput.Input = TextInputInput
TextInput.InputGroup = TextInputInputGroup
TextInput.Label = TextInputLabel
TextInput.Root = TextInputRoot
