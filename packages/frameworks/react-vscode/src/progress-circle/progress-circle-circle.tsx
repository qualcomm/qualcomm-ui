import type {ReactElement} from "react"

import {
  CoreProgressRing,
  type CoreProgressRingCircleProps,
} from "@qualcomm-ui/react-core/progress-ring"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {ProgressCircleBar} from "./progress-circle-bar"
import {ProgressCircleTrack} from "./progress-circle-track"
import {useVsProgressCircleContext} from "./vs-progress-circle-context"

export interface ProgressCircleCircleProps extends CoreProgressRingCircleProps {}

/**
 * The SVG element that contains the track and bar. Renders an `<svg>` element.
 */
export function ProgressCircleCircle({
  children,
  ...props
}: ProgressCircleCircleProps): ReactElement {
  const context = useVsProgressCircleContext()
  const mergedProps = mergeProps(context.getCircleBindings(), props)
  return (
    <CoreProgressRing.Circle {...mergedProps}>
      {children || (
        <>
          <ProgressCircleTrack />
          <ProgressCircleBar />
        </>
      )}
    </CoreProgressRing.Circle>
  )
}
