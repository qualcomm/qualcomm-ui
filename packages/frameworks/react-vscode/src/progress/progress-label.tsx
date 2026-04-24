import type {ReactElement, ReactNode} from "react"

import {
  CoreProgress,
  type CoreProgressLabelProps,
} from "@qualcomm-ui/react-core/progress"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export type ProgressLabelProps = CoreProgressLabelProps & {
  children?: ReactNode
}

export function ProgressLabel({
  children,
  ...props
}: ProgressLabelProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-progress__label"}, props)

  return <CoreProgress.Label {...mergedProps}>{children}</CoreProgress.Label>
}
