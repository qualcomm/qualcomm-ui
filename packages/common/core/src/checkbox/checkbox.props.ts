import {createProps, createSplitProps} from "@qualcomm-ui/utils/object"

import type {CheckboxApiProps} from "./checkbox.types"

const checkboxProps: (keyof CheckboxApiProps)[] =
  createProps<CheckboxApiProps>()(
    "checked",
    "defaultChecked",
    "dir",
    "disabled",
    "getRootNode",
    "form",
    "ids",
    "indeterminate",
    "invalid",
    "name",
    "onCheckedChange",
    "onFocusChange",
    "readOnly",
    "required",
    "value",
  )

export const splitCheckboxProps: <Props extends CheckboxApiProps>(
  props: Props,
) => [CheckboxApiProps, Omit<Props, keyof CheckboxApiProps>] =
  createSplitProps<CheckboxApiProps>(checkboxProps)
