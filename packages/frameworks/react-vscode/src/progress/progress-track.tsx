import type {ReactElement, ReactNode} from "react"

import {
  CoreProgress,
  type CoreProgressTrackProps,
} from "@qualcomm-ui/react-core/progress"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export type ProgressTrackProps = CoreProgressTrackProps & {
  children?: ReactNode
}

export function ProgressTrack({
  children,
  ...props
}: ProgressTrackProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-progress__track"}, props)

  return <CoreProgress.Track {...mergedProps}>{children}</CoreProgress.Track>
}
