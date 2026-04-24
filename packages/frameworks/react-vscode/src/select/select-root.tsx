import type {ReactElement, ReactNode} from "react"

import {
  CoreSelect,
  type CoreSelectRootProps,
} from "@qualcomm-ui/react-core/select"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface SelectRootProps extends CoreSelectRootProps {
  children?: ReactNode
}

export function SelectRoot({
  children,
  ...props
}: SelectRootProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-select"}, props)
  return <CoreSelect.Root {...mergedProps}>{children}</CoreSelect.Root>
}
