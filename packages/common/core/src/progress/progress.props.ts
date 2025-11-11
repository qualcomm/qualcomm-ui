import {createProps, createSplitProps} from "@qualcomm-ui/utils/object"

import type {ProgressApiProps} from "./progress.types"

export const progressProps: (keyof ProgressApiProps)[] =
  createProps<ProgressApiProps>()(
    "defaultValue",
    "dir",
    "ids",
    "invalid",
    "max",
    "min",
    "onValueChange",
    "value",
  )

export const splitProgressProps: <Props extends ProgressApiProps>(
  props: Props,
) => [ProgressApiProps, Omit<Props, keyof ProgressApiProps>] =
  createSplitProps<ProgressApiProps>(progressProps)
