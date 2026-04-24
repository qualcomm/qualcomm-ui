import type {ReactElement} from "react"

import {
  CoreStepper,
  type CoreStepperCompletedContentProps,
} from "@qualcomm-ui/react-core/stepper"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface StepCompletedContentProps extends CoreStepperCompletedContentProps {}

export function StepCompletedContent(
  props: StepCompletedContentProps,
): ReactElement {
  const mergedProps = mergeProps(
    {className: "vs-steps__completed-content"},
    props,
  )
  return <CoreStepper.CompletedContent {...mergedProps} />
}
