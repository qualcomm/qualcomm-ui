import {
  CoreNumberInputControl,
  type CoreNumberInputControlProps,
  CoreNumberInputDecrementTrigger,
  type CoreNumberInputDecrementTriggerProps,
  CoreNumberInputErrorText,
  type CoreNumberInputErrorTextProps,
  CoreNumberInputHint,
  type CoreNumberInputHintProps,
  CoreNumberInputIncrementTrigger,
  type CoreNumberInputIncrementTriggerProps,
  CoreNumberInputInput,
  CoreNumberInputInputGroup,
  type CoreNumberInputInputGroupProps,
  type CoreNumberInputInputProps,
  CoreNumberInputLabel,
  type CoreNumberInputLabelProps,
  CoreNumberInputRoot,
  type CoreNumberInputRootProps,
} from "./core-number-input"

export * from "./number-input-context"

export type {
  CoreNumberInputRootProps,
  CoreNumberInputControlProps,
  CoreNumberInputErrorTextProps,
  CoreNumberInputHintProps,
  CoreNumberInputDecrementTriggerProps,
  CoreNumberInputIncrementTriggerProps,
  CoreNumberInputInputProps,
  CoreNumberInputLabelProps,
  CoreNumberInputInputGroupProps,
}

type CoreNumberInputComponent = {
  Control: typeof CoreNumberInputControl
  DecrementTrigger: typeof CoreNumberInputDecrementTrigger
  ErrorText: typeof CoreNumberInputErrorText
  Hint: typeof CoreNumberInputHint
  IncrementTrigger: typeof CoreNumberInputIncrementTrigger
  Input: typeof CoreNumberInputInput
  InputGroup: typeof CoreNumberInputInputGroup
  Label: typeof CoreNumberInputLabel
  Root: typeof CoreNumberInputRoot
}

export const CoreNumberInput: CoreNumberInputComponent = {
  Control: CoreNumberInputControl,
  DecrementTrigger: CoreNumberInputDecrementTrigger,
  ErrorText: CoreNumberInputErrorText,
  Hint: CoreNumberInputHint,
  IncrementTrigger: CoreNumberInputIncrementTrigger,
  Input: CoreNumberInputInput,
  InputGroup: CoreNumberInputInputGroup,
  Label: CoreNumberInputLabel,
  Root: CoreNumberInputRoot,
}
