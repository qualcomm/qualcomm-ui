import type {ReactElement, ReactNode} from "react"

import {
  CoreStepper,
  type CoreStepperItemProps,
} from "@qualcomm-ui/react-core/stepper"
import {clsx} from "@qualcomm-ui/utils/clsx"

/**
 * @public
 */
export type StepItemProps = CoreStepperItemProps & {
  children?: ReactNode
}

export function StepItem({
  children,
  className,
  ...props
}: StepItemProps): ReactElement {
  return (
    <CoreStepper.Item className={clsx("vs-steps--item", className)} {...props}>
      {children}
    </CoreStepper.Item>
  )
}
