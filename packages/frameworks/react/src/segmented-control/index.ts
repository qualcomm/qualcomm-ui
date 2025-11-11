import {
  SegmentedControlHiddenInput as HiddenInput,
  type SegmentedControlHiddenInputProps,
} from "./segmented-control-hidden-input.js"
import {
  SegmentedControlItemRoot as ItemRoot,
  type SegmentedControlItemRootProps,
} from "./segmented-control-item-root.js"
import {
  SegmentedControlItemText as ItemText,
  type SegmentedControlItemTextProps,
} from "./segmented-control-item-text.js"
import {
  SegmentedControlItem as Item,
  type SegmentedControlItemProps,
} from "./segmented-control-item.js"
import {
  SegmentedControlRoot as Root,
  type SegmentedControlRootProps,
} from "./segmented-control-root.js"

export * from "./qds-segmented-control-context.js"

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
