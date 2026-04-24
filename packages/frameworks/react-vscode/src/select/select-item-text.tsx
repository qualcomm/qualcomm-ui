import type {ReactElement} from "react"

import {
  CoreSelect,
  type CoreSelectItemTextProps,
} from "@qualcomm-ui/react-core/select"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface SelectItemTextProps extends CoreSelectItemTextProps {}

export function SelectItemText(props: SelectItemTextProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-select__item-text"}, props)
  return <CoreSelect.ItemText {...mergedProps} />
}
