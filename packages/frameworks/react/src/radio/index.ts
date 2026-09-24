import {
  RadioCheckboxControl,
  type RadioCheckboxControlProps,
} from "./radio-checkbox-control.js"
import {
  RadioCheckboxIndicator,
  type RadioCheckboxIndicatorProps,
} from "./radio-checkbox-indicator.js"
import {RadioControl, type RadioControlProps} from "./radio-control.js"
import {
  RadioHiddenInput,
  type RadioHiddenInputProps,
} from "./radio-hidden-input.js"
import {RadioHint, type RadioHintProps} from "./radio-hint.js"
import {RadioLabel, type RadioLabelProps} from "./radio-label.js"
import {RadioRoot, type RadioRootProps} from "./radio-root.js"
import {Radio as SimpleRadio} from "./radio.js"

export * from "./radio-group/index.js"

export type {
  RadioControlProps,
  RadioHiddenInputProps,
  RadioHintProps,
  RadioLabelProps,
  RadioRootProps,
  RadioCheckboxControlProps,
  RadioCheckboxIndicatorProps,
}

type RadioComponent = typeof SimpleRadio & {
  CheckboxControl: typeof RadioControl
  CheckboxIndicator: typeof RadioCheckboxIndicator
  Control: typeof RadioControl
  HiddenInput: typeof RadioHiddenInput
  Hint: typeof RadioHint
  Label: typeof RadioLabel
  Root: typeof RadioRoot
}

export const Radio: RadioComponent = SimpleRadio as RadioComponent

Radio.Control = RadioControl
Radio.CheckboxControl = RadioCheckboxControl
Radio.CheckboxIndicator = RadioCheckboxIndicator
Radio.HiddenInput = RadioHiddenInput
Radio.Hint = RadioHint
Radio.Label = RadioLabel
Radio.Root = RadioRoot
