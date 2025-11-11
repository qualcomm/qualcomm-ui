import {createProps, createSplitProps} from "@qualcomm-ui/utils/object"

import type {TooltipApiProps} from "./tooltip.types"

export const tooltipProps: (keyof TooltipApiProps)[] =
  createProps<TooltipApiProps>()(
    "dir",
    "positioning",
    "open",
    "disabled",
    "closeOnClick",
    "closeOnEscape",
    "onOpenChange",
  )

export const splitTooltipProps: <Props extends TooltipApiProps>(
  props: Props,
) => [TooltipApiProps, Omit<Props, keyof TooltipApiProps>] =
  createSplitProps<TooltipApiProps>(tooltipProps)
