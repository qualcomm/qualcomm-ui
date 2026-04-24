import type {ReactElement} from "react"

import {
  CoreProgressRing,
  type CoreProgressRingTrackProps,
} from "@qualcomm-ui/react-core/progress-ring"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useVsProgressCircleContext} from "./vs-progress-circle-context"

export interface ProgressCircleTrackProps extends CoreProgressRingTrackProps {}

/**
 * The background track of the progress circle. Renders a `<circle>` element.
 */
export function ProgressCircleTrack(
  props: ProgressCircleTrackProps,
): ReactElement {
  const context = useVsProgressCircleContext()
  const mergedProps = mergeProps(context.getTrackBindings(), props)
  return <CoreProgressRing.Track {...mergedProps} />
}
