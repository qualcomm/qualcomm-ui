import type {ReactElement} from "react"

import {
  CoreProgress,
  type CoreProgressBarProps,
} from "@qualcomm-ui/react-core/progress"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export type ProgressBarProps = CoreProgressBarProps

export function ProgressBar(props: ProgressBarProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-progress__bar"}, props)

  return <CoreProgress.Bar {...mergedProps} />
}
