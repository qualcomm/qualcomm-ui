import {RadioContext, type RadioContextProps} from "./radio-context"
import {RadioGroup as SimpleRadioGroup} from "./radio-group"
import {
  RadioGroupErrorText,
  type RadioGroupErrorTextProps,
} from "./radio-group-error-text"
import {RadioGroupItems, type RadioGroupItemsProps} from "./radio-group-items"
import {RadioGroupLabel, type RadioGroupLabelProps} from "./radio-group-label"
import {RadioGroupRoot, type RadioGroupRootProps} from "./radio-group-root"

export type {
  RadioContextProps,
  RadioGroupErrorTextProps,
  RadioGroupItemsProps,
  RadioGroupLabelProps,
  RadioGroupRootProps,
}

type RadioGroupComponent = typeof SimpleRadioGroup & {
  ErrorText: typeof RadioGroupErrorText
  Items: typeof RadioGroupItems
  Label: typeof RadioGroupLabel
  RadioContext: typeof RadioContext
  Root: typeof RadioGroupRoot
}

export const RadioGroup: RadioGroupComponent =
  SimpleRadioGroup as RadioGroupComponent

RadioGroup.RadioContext = RadioContext
RadioGroup.ErrorText = RadioGroupErrorText
RadioGroup.Items = RadioGroupItems
RadioGroup.Label = RadioGroupLabel
RadioGroup.Root = RadioGroupRoot
