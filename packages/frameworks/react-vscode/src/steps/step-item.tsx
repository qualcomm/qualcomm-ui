import type {ReactElement, ReactNode} from "react"

import {
  CoreStepper,
  type CoreStepperItemProps,
} from "@qualcomm-ui/react-core/stepper"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

/**
 * @public
 */
export type StepItemProps = CoreStepperItemProps & {
  children?: ReactNode
}

export function StepItem({children, ...props}: StepItemProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-steps__item"}, props)

  return <CoreStepper.Item {...mergedProps}>{children}</CoreStepper.Item>
}
