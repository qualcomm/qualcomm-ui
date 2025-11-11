import {Radio as SimpleRadio} from "./radio"
import {RadioControl, type RadioControlProps} from "./radio-control"
import {
  RadioHiddenInput,
  type RadioHiddenInputProps,
} from "./radio-hidden-input"
import {RadioLabel, type RadioLabelProps} from "./radio-label"
import {RadioRoot, type RadioRootProps} from "./radio-root"

export * from "./radio-group"

export type {
  RadioControlProps,
  RadioHiddenInputProps,
  RadioLabelProps,
  RadioRootProps,
}

type RadioComponent = typeof SimpleRadio & {
  Control: typeof RadioControl
  HiddenInput: typeof RadioHiddenInput
  Label: typeof RadioLabel
  Root: typeof RadioRoot
}

export const Radio: RadioComponent = SimpleRadio as RadioComponent

Radio.Control = RadioControl
Radio.HiddenInput = RadioHiddenInput
Radio.Label = RadioLabel
Radio.Root = RadioRoot
