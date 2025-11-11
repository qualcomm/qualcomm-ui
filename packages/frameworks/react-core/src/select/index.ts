import {
  CoreSelectContent,
  type CoreSelectContentProps,
  CoreSelectControl,
  type CoreSelectControlProps,
  CoreSelectHiddenSelect,
  type CoreSelectHiddenSelectProps,
  CoreSelectItem,
  CoreSelectItemIndicator,
  type CoreSelectItemIndicatorProps,
  type CoreSelectItemProps,
  CoreSelectItemText,
  type CoreSelectItemTextProps,
  CoreSelectPositioner,
  type CoreSelectPositionerProps,
  CoreSelectRoot,
  type CoreSelectRootProps,
} from "./core-select"

export * from "./select-context"
export * from "./use-select"

export type {
  CoreSelectRootProps,
  CoreSelectContentProps,
  CoreSelectHiddenSelectProps,
  CoreSelectPositionerProps,
  CoreSelectControlProps,
  CoreSelectItemProps,
  CoreSelectItemTextProps,
  CoreSelectItemIndicatorProps,
}

type CoreSelectComponent = {
  Content: typeof CoreSelectContent
  Control: typeof CoreSelectControl
  HiddenSelect: typeof CoreSelectHiddenSelect
  Item: typeof CoreSelectItem
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
  ItemIndicator: CoreSelectItemIndicator,
  ItemText: CoreSelectItemText,
  Positioner: CoreSelectPositioner,
  Root: CoreSelectRoot,
}
