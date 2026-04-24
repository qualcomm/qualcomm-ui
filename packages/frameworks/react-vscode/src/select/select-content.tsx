import type {ReactElement, ReactNode} from "react"

import {
  CoreSelect,
  type CoreSelectContentProps,
} from "@qualcomm-ui/react-core/select"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface SelectContentProps extends CoreSelectContentProps {
  children?: ReactNode
}

export function SelectContent({
  children,
  ...props
}: SelectContentProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-select__content"}, props)
  return <CoreSelect.Content {...mergedProps}>{children}</CoreSelect.Content>
}
