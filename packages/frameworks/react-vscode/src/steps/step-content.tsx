import type {ReactElement} from "react"

import {
  CoreStepper,
  type CoreStepperContentProps,
} from "@qualcomm-ui/react-core/stepper"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface StepContentProps extends CoreStepperContentProps {}

export function StepContent(props: StepContentProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-steps__content"}, props)
  return <CoreStepper.Content {...mergedProps} />
}
