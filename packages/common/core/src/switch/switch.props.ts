import {createProps, createSplitProps} from "@qualcomm-ui/utils/object"

import type {SwitchApiProps} from "./switch.types"

export const switchProps: (keyof SwitchApiProps)[] =
  createProps<SwitchApiProps>()(
    "checked",
    "defaultChecked",
    "dir",
    "disabled",
    "getRootNode",
    "form",
    "ids",
    "invalid",
    "name",
    "onCheckedChange",
    "onFocusChange",
    "readOnly",
    "required",
    "value",
  )

export const splitSwitchProps: <Props extends SwitchApiProps>(
  props: Props,
) => [SwitchApiProps, Omit<Props, keyof SwitchApiProps>] =
  createSplitProps<SwitchApiProps>(switchProps)
