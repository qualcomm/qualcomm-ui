import type {ReactElement} from "react"

import {
  CoreProgressRing,
  type CoreProgressRingErrorTextProps,
} from "@qualcomm-ui/react-core/progress-ring"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useVsProgressCircleContext} from "./vs-progress-circle-context"

export interface ProgressCircleErrorTextProps extends CoreProgressRingErrorTextProps {}

/**
 * Error message displayed when the progress circle is in an invalid state.
 * Renders a `<div>` element by default.
 */
export function ProgressCircleErrorText(
  props: ProgressCircleErrorTextProps,
): ReactElement {
  const context = useVsProgressCircleContext()
  const mergedProps = mergeProps(context.getErrorTextBindings(), props)
  return <CoreProgressRing.ErrorText {...mergedProps} />
}
