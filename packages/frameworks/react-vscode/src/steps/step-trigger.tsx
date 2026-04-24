import type {ReactElement, ReactNode} from "react"

import {
  CoreStepper,
  type CoreStepperTriggerProps,
} from "@qualcomm-ui/react-core/stepper"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

/**
 * @public
 */
export type StepTriggerProps = CoreStepperTriggerProps & {
  children?: ReactNode
}

export function StepTrigger({
  children,
  ...props
}: StepTriggerProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-steps__trigger"}, props)

  return <CoreStepper.Trigger {...mergedProps}>{children}</CoreStepper.Trigger>
}
