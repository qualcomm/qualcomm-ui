import type {ReactElement} from "react"

import {
  CoreStepper,
  type CoreStepperSeparatorProps,
} from "@qualcomm-ui/react-core/stepper"
import {clsx} from "@qualcomm-ui/utils/clsx"

/**
 * @public
 */
export type StepSeparatorProps = CoreStepperSeparatorProps

export function StepSeparator({
  className,
  ...props
}: StepSeparatorProps): ReactElement {
  return (
    <CoreStepper.Separator
      className={clsx("vs-steps--separator", className)}
      {...props}
    />
  )
}
