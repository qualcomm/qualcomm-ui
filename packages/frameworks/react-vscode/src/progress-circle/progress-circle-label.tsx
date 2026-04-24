import type {ReactElement, ReactNode} from "react"

import {
  CoreProgressRing,
  type CoreProgressRingLabelProps,
} from "@qualcomm-ui/react-core/progress-ring"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useVsProgressCircleContext} from "./vs-progress-circle-context"

export interface ProgressCircleLabelProps extends CoreProgressRingLabelProps {
  children?: ReactNode
}

/**
 * Label text associated with the progress circle. Renders a `<label>` element
 * by default.
 */
export function ProgressCircleLabel({
  children,
  ...props
}: ProgressCircleLabelProps): ReactElement {
  const context = useVsProgressCircleContext()
  const mergedProps = mergeProps(context.getLabelBindings(), props)
  return (
    <CoreProgressRing.Label {...mergedProps}>{children}</CoreProgressRing.Label>
  )
}
