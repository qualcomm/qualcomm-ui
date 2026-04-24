import type {ReactElement} from "react"

import {
  CoreProgressRing,
  type CoreProgressRingBarProps,
} from "@qualcomm-ui/react-core/progress-ring"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useVsProgressCircleContext} from "./vs-progress-circle-context"

export interface ProgressCircleBarProps extends CoreProgressRingBarProps {}

/**
 * The filled portion of the progress circle that represents the current
 * progress value. Renders a `<circle>` element.
 */
export function ProgressCircleBar(props: ProgressCircleBarProps): ReactElement {
  const context = useVsProgressCircleContext()
  const mergedProps = mergeProps(context.getBarBindings(), props)
  return <CoreProgressRing.Bar {...mergedProps} />
}
