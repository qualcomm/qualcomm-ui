import type {ReactElement} from "react"

import {
  CoreStepper,
  type CoreStepperPrevTriggerProps,
} from "@qualcomm-ui/react-core/stepper"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface StepPrevTriggerProps extends CoreStepperPrevTriggerProps {}

export function StepPrevTrigger(props: StepPrevTriggerProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-steps__prev-trigger"}, props)
  return <CoreStepper.PrevTrigger {...mergedProps} />
}
