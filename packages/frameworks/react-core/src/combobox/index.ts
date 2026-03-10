import {
  CoreComboboxClearTrigger,
  type CoreComboboxClearTriggerProps,
  CoreComboboxContent,
  type CoreComboboxContentProps,
  CoreComboboxControl,
  type CoreComboboxControlProps,
  CoreComboboxEmpty,
  type CoreComboboxEmptyProps,
  CoreComboboxErrorIndicator,
  type CoreComboboxErrorIndicatorProps,
  CoreComboboxErrorText,
  type CoreComboboxErrorTextProps,
  CoreComboboxHint,
  type CoreComboboxHintProps,
  CoreComboboxInput,
  type CoreComboboxInputProps,
  CoreComboboxItem,
  CoreComboboxItemGroup,
  CoreComboboxItemGroupLabel,
  type CoreComboboxItemGroupLabelProps,
  type CoreComboboxItemGroupProps,
  CoreComboboxItemIndicator,
  type CoreComboboxItemIndicatorProps,
  type CoreComboboxItemProps,
  CoreComboboxItemText,
  type CoreComboboxItemTextProps,
  CoreComboboxLabel,
  type CoreComboboxLabelProps,
  CoreComboboxPositioner,
  type CoreComboboxPositionerProps,
  CoreComboboxRoot,
  type CoreComboboxRootProps,
  CoreComboboxTrigger,
  type CoreComboboxTriggerProps,
} from "./core-combobox"

export * from "./combobox-context"
export * from "./combobox-item-context"
export * from "./combobox-item-group-context"

export type {
  CoreComboboxRootProps,
  CoreComboboxClearTriggerProps,
  CoreComboboxContentProps,
  CoreComboboxControlProps,
  CoreComboboxEmptyProps,
  CoreComboboxInputProps,
  CoreComboboxItemProps,
  CoreComboboxItemTextProps,
  CoreComboboxItemIndicatorProps,
  CoreComboboxItemGroupProps,
  CoreComboboxItemGroupLabelProps,
  CoreComboboxLabelProps,
  CoreComboboxPositionerProps,
  CoreComboboxTriggerProps,
  CoreComboboxHintProps,
  CoreComboboxErrorTextProps,
  CoreComboboxErrorIndicatorProps,
}

type CoreComboboxComponent = {
  ClearTrigger: typeof CoreComboboxClearTrigger
  Content: typeof CoreComboboxContent
  Control: typeof CoreComboboxControl
  Empty: typeof CoreComboboxEmpty
  ErrorIndicator: typeof CoreComboboxErrorIndicator
  ErrorText: typeof CoreComboboxErrorText
  Hint: typeof CoreComboboxHint
  Input: typeof CoreComboboxInput
  Item: typeof CoreComboboxItem
  ItemGroup: typeof CoreComboboxItemGroup
  ItemGroupLabel: typeof CoreComboboxItemGroupLabel
  ItemIndicator: typeof CoreComboboxItemIndicator
  ItemText: typeof CoreComboboxItemText
  Label: typeof CoreComboboxLabel
  Positioner: typeof CoreComboboxPositioner
  Root: typeof CoreComboboxRoot
  Trigger: typeof CoreComboboxTrigger
}

export const CoreCombobox: CoreComboboxComponent = {
  ClearTrigger: CoreComboboxClearTrigger,
  Content: CoreComboboxContent,
  Control: CoreComboboxControl,
  Empty: CoreComboboxEmpty,
  ErrorIndicator: CoreComboboxErrorIndicator,
  ErrorText: CoreComboboxErrorText,
  Hint: CoreComboboxHint,
  Input: CoreComboboxInput,
  Item: CoreComboboxItem,
  ItemGroup: CoreComboboxItemGroup,
  ItemGroupLabel: CoreComboboxItemGroupLabel,
  ItemIndicator: CoreComboboxItemIndicator,
  ItemText: CoreComboboxItemText,
  Label: CoreComboboxLabel,
  Positioner: CoreComboboxPositioner,
  Root: CoreComboboxRoot,
  Trigger: CoreComboboxTrigger,
}
