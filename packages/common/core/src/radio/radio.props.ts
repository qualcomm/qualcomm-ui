import {createProps, createSplitProps} from "@qualcomm-ui/utils/object"

import type {RadioApiProps} from "./radio.types"

export const radioProps: (keyof RadioApiProps)[] = createProps<RadioApiProps>()(
  "defaultValue",
  "dir",
  "disabled",
  "form",
  "getRootNode",
  "invalid",
  "name",
  "onValueChange",
  "orientation",
  "readOnly",
  "required",
  "value",
)

export const splitRadioProps: <Props extends RadioApiProps>(
  props: Props,
) => [RadioApiProps, Omit<Props, keyof RadioApiProps>] =
  createSplitProps<RadioApiProps>(radioProps)
