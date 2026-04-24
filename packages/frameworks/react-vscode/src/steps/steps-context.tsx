import type {ReactNode} from "react"

import {
  CoreStepper,
  type CoreStepperContextProps,
} from "@qualcomm-ui/react-core/stepper"

export interface StepsContextProps extends CoreStepperContextProps {}

/**
 * Render prop that provides the current stepper API context.
 */
export function StepsContext({children}: StepsContextProps): ReactNode {
  return <CoreStepper.Context>{children}</CoreStepper.Context>
}
