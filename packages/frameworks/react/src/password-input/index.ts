import {
  PasswordInputClearTrigger,
  type PasswordInputClearTriggerProps,
} from "./password-input-clear-trigger.js"
import {
  PasswordInputErrorIndicator,
  type PasswordInputErrorIndicatorProps,
} from "./password-input-error-indicator.js"
import {
  PasswordInputErrorText,
  type PasswordInputErrorTextProps,
} from "./password-input-error-text.js"
import {
  PasswordInputHint,
  type PasswordInputHintProps,
} from "./password-input-hint.js"
import {
  PasswordInputInputGroup,
  type PasswordInputInputGroupProps,
} from "./password-input-input-group.js"
import {
  PasswordInputInput,
  type PasswordInputInputProps,
} from "./password-input-input.js"
import {
  PasswordInputLabel,
  type PasswordInputLabelProps,
} from "./password-input-label.js"
import {
  PasswordInputRoot,
  type PasswordInputRootProps,
} from "./password-input-root.js"
import {
  PasswordInputVisibilityTrigger,
  type PasswordInputVisibilityTriggerProps,
} from "./password-input-visibility-trigger.js"
import {PasswordInput as SimplePasswordInput} from "./password-input.js"

export type {
  PasswordInputClearTriggerProps,
  PasswordInputErrorIndicatorProps,
  PasswordInputErrorTextProps,
  PasswordInputHintProps,
  PasswordInputInputGroupProps,
  PasswordInputInputProps,
  PasswordInputLabelProps,
  PasswordInputRootProps,
  PasswordInputVisibilityTriggerProps,
}

type PasswordInputComponent = typeof SimplePasswordInput & {
  ClearTrigger: typeof PasswordInputClearTrigger
  ErrorIndicator: typeof PasswordInputErrorIndicator
  ErrorText: typeof PasswordInputErrorText
  Hint: typeof PasswordInputHint
  Input: typeof PasswordInputInput
  InputGroup: typeof PasswordInputInputGroup
  Label: typeof PasswordInputLabel
  Root: typeof PasswordInputRoot
  VisibilityTrigger: typeof PasswordInputVisibilityTrigger
}

export const PasswordInput: PasswordInputComponent =
  SimplePasswordInput as PasswordInputComponent

PasswordInput.ClearTrigger = PasswordInputClearTrigger
PasswordInput.ErrorIndicator = PasswordInputErrorIndicator
PasswordInput.ErrorText = PasswordInputErrorText
PasswordInput.Hint = PasswordInputHint
PasswordInput.InputGroup = PasswordInputInputGroup
PasswordInput.Input = PasswordInputInput
PasswordInput.Label = PasswordInputLabel
PasswordInput.Root = PasswordInputRoot
PasswordInput.VisibilityTrigger = PasswordInputVisibilityTrigger
