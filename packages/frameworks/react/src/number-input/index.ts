import {NumberInput as SimpleNumberInput} from "./number-input"
import {
  NumberInputControl,
  type NumberInputControlProps,
} from "./number-input-control"
import {
  NumberInputDecrementTrigger,
  type NumberInputDecrementTriggerProps,
} from "./number-input-decrement-trigger"
import {
  NumberInputErrorIndicator,
  type NumberInputErrorIndicatorProps,
} from "./number-input-error-indicator"
import {
  NumberInputErrorText,
  type NumberInputErrorTextProps,
} from "./number-input-error-text"
import {NumberInputHint, type NumberInputHintProps} from "./number-input-hint"
import {
  NumberInputIncrementTrigger,
  type NumberInputIncrementTriggerProps,
} from "./number-input-increment-trigger"
import {
  NumberInputInput,
  type NumberInputInputProps,
} from "./number-input-input"
import {
  NumberInputInputGroup,
  type NumberInputInputGroupProps,
} from "./number-input-input-group"
import {
  NumberInputLabel,
  type NumberInputLabelProps,
} from "./number-input-label"
import {NumberInputRoot, type NumberInputRootProps} from "./number-input-root"

export * from "./qds-number-input-context"

export type {
  NumberInputControlProps,
  NumberInputDecrementTriggerProps,
  NumberInputErrorIndicatorProps,
  NumberInputErrorTextProps,
  NumberInputHintProps,
  NumberInputIncrementTriggerProps,
  NumberInputInputGroupProps,
  NumberInputInputProps,
  NumberInputLabelProps,
  NumberInputRootProps,
}

type NumberInputComponent = typeof SimpleNumberInput & {
  Control: typeof NumberInputControl
  DecrementTrigger: typeof NumberInputDecrementTrigger
  ErrorIndicator: typeof NumberInputErrorIndicator
  ErrorText: typeof NumberInputErrorText
  Hint: typeof NumberInputHint
  IncrementTrigger: typeof NumberInputIncrementTrigger
  Input: typeof NumberInputInput
  InputGroup: typeof NumberInputInputGroup
  Label: typeof NumberInputLabel
  Root: typeof NumberInputRoot
}

export const NumberInput: NumberInputComponent =
  SimpleNumberInput as NumberInputComponent

NumberInput.Control = NumberInputControl
NumberInput.DecrementTrigger = NumberInputDecrementTrigger
NumberInput.ErrorIndicator = NumberInputErrorIndicator
NumberInput.ErrorText = NumberInputErrorText
NumberInput.Hint = NumberInputHint
NumberInput.IncrementTrigger = NumberInputIncrementTrigger
NumberInput.InputGroup = NumberInputInputGroup
NumberInput.Input = NumberInputInput
NumberInput.Label = NumberInputLabel
NumberInput.Root = NumberInputRoot
