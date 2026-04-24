import type {ReactElement} from "react"

import {
  CoreStepper,
  type CoreStepperLabelProps,
} from "@qualcomm-ui/react-core/stepper"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface StepLabelProps extends CoreStepperLabelProps {}

export function StepLabel(props: StepLabelProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-steps__label"}, props)
  return <CoreStepper.Label {...mergedProps} />
}
