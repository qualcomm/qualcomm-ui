import {CheckboxContext, type CheckboxContextProps} from "./checkbox-context.js"
import {CheckboxControl, type CheckboxControlProps} from "./checkbox-control.js"
import {
  CheckboxErrorText,
  type CheckboxErrorTextProps,
} from "./checkbox-error-text.js"
import {
  CheckboxHiddenInput,
  type CheckboxHiddenInputProps,
} from "./checkbox-hidden-input.js"
import {CheckboxHint, type CheckboxHintProps} from "./checkbox-hint.js"
import {
  CheckboxIndicator,
  type CheckboxIndicatorProps,
} from "./checkbox-indicator.js"
import {CheckboxLabel, type CheckboxLabelProps} from "./checkbox-label.js"
import {CheckboxRoot, type CheckboxRootProps} from "./checkbox-root.js"
import {Checkbox as SimpleCheckbox} from "./checkbox.js"

export type {
  CheckboxContextProps,
  CheckboxControlProps,
  CheckboxErrorTextProps,
  CheckboxHiddenInputProps,
  CheckboxHintProps,
  CheckboxIndicatorProps,
  CheckboxLabelProps,
  CheckboxRootProps,
}

type CheckboxComponent = typeof SimpleCheckbox & {
  Context: typeof CheckboxContext
  Control: typeof CheckboxControl
  ErrorText: typeof CheckboxErrorText
  HiddenInput: typeof CheckboxHiddenInput
  Hint: typeof CheckboxHint
  Indicator: typeof CheckboxIndicator
  Label: typeof CheckboxLabel
  Root: typeof CheckboxRoot
}

export const Checkbox: CheckboxComponent = SimpleCheckbox as CheckboxComponent

Checkbox.Context = CheckboxContext
Checkbox.Control = CheckboxControl
Checkbox.ErrorText = CheckboxErrorText
Checkbox.HiddenInput = CheckboxHiddenInput
Checkbox.Hint = CheckboxHint
Checkbox.Indicator = CheckboxIndicator
Checkbox.Label = CheckboxLabel
Checkbox.Root = CheckboxRoot
