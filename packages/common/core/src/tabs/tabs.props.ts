import {createProps, createSplitProps} from "@qualcomm-ui/utils/object"

import type {TabsApiProps} from "./tabs.types"

export const tabsProps: (keyof TabsApiProps)[] = createProps<TabsApiProps>()(
  "activationMode",
  "composite",
  "defaultValue",
  "deselectable",
  "dir",
  "getRootNode",
  "loopFocus",
  "onFocusChange",
  "onValueChange",
  "orientation",
  "translations",
  "value",
)

export const splitTabsProps: <Props extends TabsApiProps>(
  props: Props,
) => [TabsApiProps, Omit<Props, keyof TabsApiProps>] =
  createSplitProps<Partial<TabsApiProps>>(tabsProps)
