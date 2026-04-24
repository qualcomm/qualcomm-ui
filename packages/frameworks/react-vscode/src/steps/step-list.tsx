import type {ReactElement, ReactNode} from "react"

import {
  CoreStepper,
  type CoreStepperListProps,
} from "@qualcomm-ui/react-core/stepper"
import {clsx} from "@qualcomm-ui/utils/clsx"

/**
 * @public
 */
export type StepListProps = CoreStepperListProps & {
  children?: ReactNode
}

export function StepList({
  children,
  className,
  ...props
}: StepListProps): ReactElement {
  return (
    <CoreStepper.List className={clsx("vs-steps--list", className)} {...props}>
      {children}
    </CoreStepper.List>
  )
}
