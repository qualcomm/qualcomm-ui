import type {ReactElement, ReactNode} from "react"

import {
  CoreStepper,
  type CoreStepperListProps,
} from "@qualcomm-ui/react-core/stepper"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

/**
 * @public
 */
export type StepListProps = CoreStepperListProps & {
  children?: ReactNode
}

export function StepList({children, ...props}: StepListProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-steps__list"}, props)

  return <CoreStepper.List {...mergedProps}>{children}</CoreStepper.List>
}
