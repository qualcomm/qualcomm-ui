import type {ReactElement, ReactNode} from "react"

import {
  CoreStepper,
  type CoreStepperIndicatorProps,
} from "@qualcomm-ui/react-core/stepper"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

/**
 * @public
 */
export type StepIndicatorProps = CoreStepperIndicatorProps & {
  children?: ReactNode
}

export function StepIndicator({
  children,
  ...props
}: StepIndicatorProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-steps__indicator"}, props)

  return (
    <CoreStepper.Indicator {...mergedProps}>{children}</CoreStepper.Indicator>
  )
}
