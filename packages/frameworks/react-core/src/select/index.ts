import {
  CoreSelectContent,
  type CoreSelectContentProps,
  CoreSelectControl,
  type CoreSelectControlProps,
  CoreSelectHiddenSelect,
  type CoreSelectHiddenSelectProps,
  CoreSelectItem,
  CoreSelectItemGroup,
  CoreSelectItemGroupLabel,
  type CoreSelectItemGroupLabelProps,
  type CoreSelectItemGroupProps,
  CoreSelectItemIndicator,
  type CoreSelectItemIndicatorProps,
  type CoreSelectItemProps,
  CoreSelectItemText,
  type CoreSelectItemTextProps,
  CoreSelectPositioner,
  type CoreSelectPositionerProps,
  CoreSelectRoot,
  type CoreSelectRootProps,
} from "./core-select.js"

export * from "./select-context.js"
export * from "./select-item-group-context.js"
export * from "./use-select.js"

export type {
  CoreSelectRootProps,
  CoreSelectContentProps,
  CoreSelectHiddenSelectProps,
  CoreSelectPositionerProps,
  CoreSelectControlProps,
  CoreSelectItemProps,
  CoreSelectItemGroupProps,
  CoreSelectItemGroupLabelProps,
  CoreSelectItemTextProps,
  CoreSelectItemIndicatorProps,
}

type CoreSelectComponent = {
  Content: typeof CoreSelectContent
  Control: typeof CoreSelectControl
  HiddenSelect: typeof CoreSelectHiddenSelect
  Item: typeof CoreSelectItem
  ItemGroup: typeof CoreSelectItemGroup
  ItemGroupLabel: typeof CoreSelectItemGroupLabel
  ItemIndicator: typeof CoreSelectItemIndicator
  ItemText: typeof CoreSelectItemText
  Positioner: typeof CoreSelectPositioner
  Root: typeof CoreSelectRoot
}

export const CoreSelect: CoreSelectComponent = {
  Content: CoreSelectContent,
  Control: CoreSelectControl,
  HiddenSelect: CoreSelectHiddenSelect,
  Item: CoreSelectItem,
  ItemGroup: CoreSelectItemGroup,
  ItemGroupLabel: CoreSelectItemGroupLabel,
  ItemIndicator: CoreSelectItemIndicator,
  ItemText: CoreSelectItemText,
  Positioner: CoreSelectPositioner,
  Root: CoreSelectRoot,
}
