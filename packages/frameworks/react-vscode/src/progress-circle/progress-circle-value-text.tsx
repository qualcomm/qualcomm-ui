import type {ReactElement} from "react"

import {
  CoreProgressRing,
  type CoreProgressRingValueTextProps,
} from "@qualcomm-ui/react-core/progress-ring"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useVsProgressCircleContext} from "./vs-progress-circle-context"

export interface ProgressCircleValueTextProps extends CoreProgressRingValueTextProps {}

/**
 * Displays the current progress value as text. Renders a `<div>` element by
 * default.
 */
export function ProgressCircleValueText(
  props: ProgressCircleValueTextProps,
): ReactElement {
  const context = useVsProgressCircleContext()
  const mergedProps = mergeProps(context.getValueTextBindings(), props)
  return <CoreProgressRing.ValueText {...mergedProps} />
}
