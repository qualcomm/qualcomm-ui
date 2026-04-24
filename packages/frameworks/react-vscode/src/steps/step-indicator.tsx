import type {ReactElement, ReactNode} from "react"

import {
  CoreStepper,
  type CoreStepperIndicatorProps,
} from "@qualcomm-ui/react-core/stepper"
import {clsx} from "@qualcomm-ui/utils/clsx"

/**
 * @public
 */
export type StepIndicatorProps = CoreStepperIndicatorProps & {
  children?: ReactNode
}

export function StepIndicator({
  children,
  className,
  ...props
}: StepIndicatorProps): ReactElement {
  return (
    <CoreStepper.Indicator
      className={clsx("vs-steps--indicator", className)}
      {...props}
    >
      {children}
    </CoreStepper.Indicator>
  )
}
