import {type SelectProps, Select as SimpleSelect} from "./select"
import {
  SelectClearTrigger,
  type SelectClearTriggerProps,
} from "./select-clear-trigger"
import {SelectContent, type SelectContentProps} from "./select-content"
import {SelectControl, type SelectControlProps} from "./select-control"
import {
  SelectErrorIndicator,
  type SelectErrorIndicatorProps,
} from "./select-error-indicator"
import {SelectErrorText, type SelectErrorTextProps} from "./select-error-text"
import {
  SelectHiddenSelect,
  type SelectHiddenSelectProps,
} from "./select-hidden-select"
import {SelectHint, type SelectHintProps} from "./select-hint"
import {SelectIndicator, type SelectIndicatorProps} from "./select-indicator"
import {SelectItem, type SelectItemProps} from "./select-item"
import {
  SelectItemIndicator,
  type SelectItemIndicatorProps,
} from "./select-item-indicator"
import {SelectItemText, type SelectItemTextProps} from "./select-item-text"
import {SelectLabel, type SelectLabelProps} from "./select-label"
import {SelectPositioner, type SelectPositionerProps} from "./select-positioner"
import {SelectRoot, type SelectRootProps} from "./select-root"
import {SelectValueText, type SelectValueTextProps} from "./select-value-text"

export type {
  SelectClearTriggerProps,
  SelectContentProps,
  SelectControlProps,
  SelectErrorIndicatorProps,
  SelectErrorTextProps,
  SelectHiddenSelectProps,
  SelectHintProps,
  SelectIndicatorProps,
  SelectItemIndicatorProps,
  SelectItemProps,
  SelectItemTextProps,
  SelectLabelProps,
  SelectPositionerProps,
  SelectProps,
  SelectRootProps,
  SelectValueTextProps,
}

type SelectComponent = typeof SimpleSelect & {
  ClearTrigger: typeof SelectClearTrigger
  Content: typeof SelectContent
  Control: typeof SelectControl
  ErrorIndicator: typeof SelectErrorIndicator
  ErrorText: typeof SelectErrorText
  HiddenSelect: typeof SelectHiddenSelect
  Hint: typeof SelectHint
  Indicator: typeof SelectIndicator
  Item: typeof SelectItem
  ItemIndicator: typeof SelectItemIndicator
  ItemText: typeof SelectItemText
  Label: typeof SelectLabel
  Positioner: typeof SelectPositioner
  Root: typeof SelectRoot
  ValueText: typeof SelectValueText
}

export const Select: SelectComponent = SimpleSelect as SelectComponent

Select.ClearTrigger = SelectClearTrigger
Select.Content = SelectContent
Select.Control = SelectControl
Select.ErrorIndicator = SelectErrorIndicator
Select.ErrorText = SelectErrorText
Select.HiddenSelect = SelectHiddenSelect
Select.Hint = SelectHint
Select.Indicator = SelectIndicator
Select.Item = SelectItem
Select.ItemIndicator = SelectItemIndicator
Select.ItemText = SelectItemText
Select.Label = SelectLabel
Select.Positioner = SelectPositioner
Select.Root = SelectRoot
Select.ValueText = SelectValueText

export {
  SelectClearTrigger,
  SelectContent,
  SelectControl,
  SelectErrorIndicator,
  SelectErrorText,
  SelectHiddenSelect,
  SelectHint,
  SelectIndicator,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectPositioner,
  SelectRoot,
  SelectValueText,
}
