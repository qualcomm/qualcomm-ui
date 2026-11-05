import {RadioContext, type RadioContextProps} from "./radio-context.js"
import {
  RadioGroupErrorText,
  type RadioGroupErrorTextProps,
} from "./radio-group-error-text.js"
import {RadioGroupHint, type RadioGroupHintProps} from "./radio-group-hint.js"
import {
  RadioGroupItems,
  type RadioGroupItemsProps,
} from "./radio-group-items.js"
import {
  RadioGroupLabel,
  type RadioGroupLabelProps,
} from "./radio-group-label.js"
import {RadioGroupRoot, type RadioGroupRootProps} from "./radio-group-root.js"
import {RadioGroup as SimpleRadioGroup} from "./radio-group.js"

export type {
  RadioContextProps,
  RadioGroupErrorTextProps,
  RadioGroupHintProps,
  RadioGroupItemsProps,
  RadioGroupLabelProps,
  RadioGroupRootProps,
}

type RadioGroupComponent = typeof SimpleRadioGroup & {
  ErrorText: typeof RadioGroupErrorText
  Hint: typeof RadioGroupHint
  Items: typeof RadioGroupItems
  Label: typeof RadioGroupLabel
  RadioContext: typeof RadioContext
  Root: typeof RadioGroupRoot
}

export const RadioGroup: RadioGroupComponent =
  SimpleRadioGroup as RadioGroupComponent

RadioGroup.RadioContext = RadioContext
RadioGroup.ErrorText = RadioGroupErrorText
RadioGroup.Hint = RadioGroupHint
RadioGroup.Items = RadioGroupItems
RadioGroup.Label = RadioGroupLabel
RadioGroup.Root = RadioGroupRoot
