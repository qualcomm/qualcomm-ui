import type {ReactElement} from "react"

import {
  CoreStepper,
  type CoreStepperSeparatorProps,
} from "@qualcomm-ui/react-core/stepper"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

/**
 * @public
 */
export type StepSeparatorProps = CoreStepperSeparatorProps

export function StepSeparator(props: StepSeparatorProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-steps__separator"}, props)

  return <CoreStepper.Separator {...mergedProps} />
}
