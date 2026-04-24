import type {ReactElement, ReactNode} from "react"

import {
  CoreProgress,
  type CoreProgressRootProps,
} from "@qualcomm-ui/react-core/progress"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export type ProgressRootProps = Omit<CoreProgressRootProps, "children"> & {
  children?: ReactNode
}

export function ProgressRoot({
  children,
  ...props
}: ProgressRootProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-progress"}, props)

  return <CoreProgress.Root {...mergedProps}>{children}</CoreProgress.Root>
}
