import type {ReactElement} from "react"

import {
  CoreStepper,
  type CoreStepperHintProps,
} from "@qualcomm-ui/react-core/stepper"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface StepHintProps extends CoreStepperHintProps {}

export function StepHint(props: StepHintProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-steps__hint"}, props)
  return <CoreStepper.Hint {...mergedProps} />
}
