import {createProps, createSplitProps} from "@qualcomm-ui/utils/object"

import type {SegmentedControlApiProps} from "./segmented-control.types"

export const segmentedControlGroupProps: (keyof SegmentedControlApiProps)[] =
  createProps<SegmentedControlApiProps>()(
    "defaultValue",
    "dir",
    "disabled",
    "form",
    "multiple",
    "name",
    "onValueChange",
    "orientation",
    "value",
  )

export function splitSegmentedControlProps<
  Props extends SegmentedControlApiProps,
>(
  props: Props,
): [SegmentedControlApiProps, Omit<Props, keyof SegmentedControlApiProps>] {
  return createSplitProps<SegmentedControlApiProps>(segmentedControlGroupProps)(
    props,
  )
}
