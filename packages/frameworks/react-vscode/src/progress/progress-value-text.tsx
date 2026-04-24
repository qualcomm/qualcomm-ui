import type {ReactElement, ReactNode} from "react"

import {
  CoreProgress,
  type CoreProgressValueTextProps,
} from "@qualcomm-ui/react-core/progress"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export type ProgressValueTextProps = CoreProgressValueTextProps & {
  children?: ReactNode
}

export function ProgressValueText({
  children,
  ...props
}: ProgressValueTextProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-progress__value-text"}, props)
  return (
    <CoreProgress.ValueText {...mergedProps}>{children}</CoreProgress.ValueText>
  )
}
