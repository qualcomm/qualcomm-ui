import type {ReactElement} from "react"

import {
  CoreSelect,
  type CoreSelectItemIndicatorProps,
} from "@qualcomm-ui/react-core/select"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {Icon} from "../icon"

export interface SelectItemIndicatorProps extends CoreSelectItemIndicatorProps {}

export function SelectItemIndicator(
  props: SelectItemIndicatorProps,
): ReactElement {
  const mergedProps = mergeProps(
    {className: "vs-select__item-indicator"},
    props,
  )
  return (
    <CoreSelect.ItemIndicator {...mergedProps}>
      <Icon icon="check" size={12} />
    </CoreSelect.ItemIndicator>
  )
}
