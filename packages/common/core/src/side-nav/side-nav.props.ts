import {createProps, createSplitProps} from "@qualcomm-ui/utils/object"

import type {SideNavApiProps} from "./side-nav.types"

export const sideNavProps: (keyof SideNavApiProps)[] =
  createProps<SideNavApiProps>()(
    "defaultOpen",
    "dir",
    "disabled",
    "getRootNode",
    "onOpenChange",
    "open",
  )

export const splitSideNavProps: <Props extends SideNavApiProps>(
  props: Props,
) => [SideNavApiProps, Omit<Props, keyof SideNavApiProps>] =
  createSplitProps<SideNavApiProps>(sideNavProps)
