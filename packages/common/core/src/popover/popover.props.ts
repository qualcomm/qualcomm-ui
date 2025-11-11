import {createProps, createSplitProps} from "@qualcomm-ui/utils/object"

import type {PopoverApiProps} from "./popover.types"

const popoverProps: (keyof PopoverApiProps)[] = createProps<PopoverApiProps>()(
  "autoFocus",
  "closeOnEscape",
  "closeOnInteractOutside",
  "defaultOpen",
  "dir",
  "getRootNode",
  "ids",
  "initialFocusEl",
  "modal",
  "onEscapeKeyDown",
  "onFocusOutside",
  "onInteractOutside",
  "onOpenChange",
  "onPointerDownOutside",
  "onRequestDismiss",
  "open",
  "persistentElements",
  "portalled",
  "positioning",
  "restoreFocus",
)

export const splitPopoverProps: <Props extends PopoverApiProps>(
  props: Props,
) => [PopoverApiProps, Omit<Props, keyof PopoverApiProps>] =
  createSplitProps<PopoverApiProps>(popoverProps)
