import type {ReactElement, ReactNode} from "react"

import {
  CoreStepper,
  type CoreStepperTriggerProps,
} from "@qualcomm-ui/react-core/stepper"
import {clsx} from "@qualcomm-ui/utils/clsx"

/**
 * @public
 */
export type StepTriggerProps = CoreStepperTriggerProps & {
  children?: ReactNode
}

export function StepTrigger({
  children,
  className,
  ...props
}: StepTriggerProps): ReactElement {
  return (
    <CoreStepper.Trigger
      className={clsx("vs-steps--trigger", className)}
      {...props}
    >
      {children}
    </CoreStepper.Trigger>
  )
}
