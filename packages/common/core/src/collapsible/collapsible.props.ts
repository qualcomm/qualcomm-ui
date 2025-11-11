import {createProps, createSplitProps} from "@qualcomm-ui/utils/object"

import type {CollapsibleApiProps} from "./collapsible.types"

export const collapsibleProps: (keyof CollapsibleApiProps)[] =
  createProps<CollapsibleApiProps>()(
    "defaultOpen",
    "dir",
    "disabled",
    "getRootNode",
    "onExitComplete",
    "onOpenChange",
    "open",
  )

export const splitCollapsibleProps: <Props extends CollapsibleApiProps>(
  props: Props,
) => [CollapsibleApiProps, Omit<Props, keyof CollapsibleApiProps>] =
  createSplitProps<CollapsibleApiProps>(collapsibleProps)
