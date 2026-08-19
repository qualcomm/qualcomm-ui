import {
  CoreListboxContent,
  type CoreListboxContentProps,
  CoreListboxInput,
  type CoreListboxInputProps,
  CoreListboxItem,
  CoreListboxItemGroup,
  CoreListboxItemGroupLabel,
  type CoreListboxItemGroupLabelProps,
  type CoreListboxItemGroupProps,
  CoreListboxItemIndicator,
  type CoreListboxItemIndicatorProps,
  type CoreListboxItemProps,
  CoreListboxItemLabel,
  type CoreListboxItemLabelProps,
  CoreListboxLabel,
  type CoreListboxLabelProps,
  CoreListboxRoot,
  type CoreListboxRootProps,
} from "./core-listbox.js"

export * from "./listbox-context.js"
export * from "./listbox-item-context.js"
export * from "./listbox-item-group-context.js"

export type {
  CoreListboxRootProps,
  CoreListboxContentProps,
  CoreListboxInputProps,
  CoreListboxItemProps,
  CoreListboxItemLabelProps,
  CoreListboxItemIndicatorProps,
  CoreListboxItemGroupProps,
  CoreListboxItemGroupLabelProps,
  CoreListboxLabelProps,
}

type CoreListboxComponent = {
  Content: typeof CoreListboxContent
  Input: typeof CoreListboxInput
  Item: typeof CoreListboxItem
  ItemGroup: typeof CoreListboxItemGroup
  ItemGroupLabel: typeof CoreListboxItemGroupLabel
  ItemIndicator: typeof CoreListboxItemIndicator
  ItemLabel: typeof CoreListboxItemLabel
  Label: typeof CoreListboxLabel
  Root: typeof CoreListboxRoot
}

export const CoreListbox: CoreListboxComponent = {
  Content: CoreListboxContent,
  Input: CoreListboxInput,
  Item: CoreListboxItem,
  ItemGroup: CoreListboxItemGroup,
  ItemGroupLabel: CoreListboxItemGroupLabel,
  ItemIndicator: CoreListboxItemIndicator,
  ItemLabel: CoreListboxItemLabel,
  Label: CoreListboxLabel,
  Root: CoreListboxRoot,
}
