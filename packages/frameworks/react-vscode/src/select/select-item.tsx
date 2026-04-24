import type {ReactElement} from "react"

import {
  CoreSelect,
  type CoreSelectItemProps,
} from "@qualcomm-ui/react-core/select"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface SelectItemProps extends CoreSelectItemProps {}

export function SelectItem({
  children,
  item,
  ...props
}: SelectItemProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-select__item"}, props)
  return (
    <CoreSelect.Item item={item} {...mergedProps}>
      {children}
    </CoreSelect.Item>
  )
}
