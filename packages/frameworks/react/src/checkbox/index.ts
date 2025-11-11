import {Checkbox as SimpleCheckbox} from "./checkbox"
import {CheckboxContext, type CheckboxContextProps} from "./checkbox-context"
import {CheckboxControl, type CheckboxControlProps} from "./checkbox-control"
import {
  CheckboxErrorText,
  type CheckboxErrorTextProps,
} from "./checkbox-error-text"
import {
  CheckboxHiddenInput,
  type CheckboxHiddenInputProps,
} from "./checkbox-hidden-input"
import {
  CheckboxIndicator,
  type CheckboxIndicatorProps,
} from "./checkbox-indicator"
import {CheckboxLabel, type CheckboxLabelProps} from "./checkbox-label"
import {CheckboxRoot, type CheckboxRootProps} from "./checkbox-root"

export type {
  CheckboxContextProps,
  CheckboxControlProps,
  CheckboxErrorTextProps,
  CheckboxHiddenInputProps,
  CheckboxIndicatorProps,
  CheckboxLabelProps,
  CheckboxRootProps,
}

type CheckboxComponent = typeof SimpleCheckbox & {
  Context: typeof CheckboxContext
  Control: typeof CheckboxControl
  ErrorText: typeof CheckboxErrorText
  HiddenInput: typeof CheckboxHiddenInput
  Indicator: typeof CheckboxIndicator
  Label: typeof CheckboxLabel
  Root: typeof CheckboxRoot
}

export const Checkbox: CheckboxComponent = SimpleCheckbox as CheckboxComponent

Checkbox.Context = CheckboxContext
Checkbox.Control = CheckboxControl
Checkbox.ErrorText = CheckboxErrorText
Checkbox.HiddenInput = CheckboxHiddenInput
Checkbox.Indicator = CheckboxIndicator
Checkbox.Label = CheckboxLabel
Checkbox.Root = CheckboxRoot
