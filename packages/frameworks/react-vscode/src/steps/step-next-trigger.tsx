import type {ReactElement} from "react"

import {
  CoreStepper,
  type CoreStepperNextTriggerProps,
} from "@qualcomm-ui/react-core/stepper"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface StepNextTriggerProps extends CoreStepperNextTriggerProps {}

export function StepNextTrigger(props: StepNextTriggerProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-steps__next-trigger"}, props)
  return <CoreStepper.NextTrigger {...mergedProps} />
}
