import {SwitchControl, type SwitchControlProps} from "./switch-control.js"
import {
  SwitchErrorText,
  type SwitchErrorTextProps,
} from "./switch-error-text.js"
import {
  SwitchHiddenInput,
  type SwitchHiddenInputProps,
} from "./switch-hidden-input.js"
import {SwitchHint, type SwitchHintProps} from "./switch-hint.js"
import {SwitchLabel, type SwitchLabelProps} from "./switch-label.js"
import {SwitchRoot, type SwitchRootProps} from "./switch-root.js"
import {SwitchThumb, type SwitchThumbProps} from "./switch-thumb.js"
import {Switch as SimpleSwitch} from "./switch.js"

export * from "./qds-switch-context.js"

export type {
  SwitchControlProps,
  SwitchErrorTextProps,
  SwitchHiddenInputProps,
  SwitchHintProps,
  SwitchLabelProps,
  SwitchRootProps,
  SwitchThumbProps,
}

type SwitchComponent = typeof SimpleSwitch & {
  Control: typeof SwitchControl
  ErrorText: typeof SwitchErrorText
  HiddenInput: typeof SwitchHiddenInput
  Hint: typeof SwitchHint
  Label: typeof SwitchLabel
  Root: typeof SwitchRoot
  Thumb: typeof SwitchThumb
}

export const Switch: SwitchComponent = SimpleSwitch as SwitchComponent

Switch.Control = SwitchControl
Switch.ErrorText = SwitchErrorText
Switch.HiddenInput = SwitchHiddenInput
Switch.Hint = SwitchHint
Switch.Label = SwitchLabel
Switch.Root = SwitchRoot
Switch.Thumb = SwitchThumb
