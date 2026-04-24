import type {ReactElement, ReactNode} from "react"

import {
  CoreStepper,
  type CoreStepperRootProps,
} from "@qualcomm-ui/react-core/stepper"
import {clsx} from "@qualcomm-ui/utils/clsx"

/**
 * @public
 */
export type StepsRootProps = Omit<CoreStepperRootProps, "children"> & {
  children?: ReactNode
}

export function StepsRoot({
  children,
  className,
  ...props
}: StepsRootProps): ReactElement {
  return (
    <CoreStepper.Root className={clsx("vs-steps", className)} {...props}>
      {children}
    </CoreStepper.Root>
  )
}
