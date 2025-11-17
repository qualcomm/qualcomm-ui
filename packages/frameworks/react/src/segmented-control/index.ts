import {
  SegmentedControlHiddenInput as HiddenInput,
  type SegmentedControlHiddenInputProps,
} from "./segmented-control-hidden-input"
import {
  SegmentedControlItem as Item,
  type SegmentedControlItemProps,
} from "./segmented-control-item"
import {
  SegmentedControlItemRoot as ItemRoot,
  type SegmentedControlItemRootProps,
} from "./segmented-control-item-root"
import {
  SegmentedControlItemText as ItemText,
  type SegmentedControlItemTextProps,
} from "./segmented-control-item-text"
import {
  SegmentedControlRoot as Root,
  type SegmentedControlRootProps,
} from "./segmented-control-root"

export * from "./qds-segmented-control-context"

export type {
  SegmentedControlHiddenInputProps,
  SegmentedControlItemRootProps,
  SegmentedControlItemTextProps,
  SegmentedControlRootProps,
  SegmentedControlItemProps,
}

interface SegmentedControlComponent {
  HiddenInput: typeof HiddenInput
  Item: typeof Item
  ItemRoot: typeof ItemRoot
  ItemText: typeof ItemText
  Root: typeof Root
}

export const SegmentedControl: SegmentedControlComponent = {
  HiddenInput,
  Item,
  ItemRoot,
  ItemText,
  Root,
}
