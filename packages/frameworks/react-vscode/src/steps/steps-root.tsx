import type {ReactElement, ReactNode} from "react"

import {
  CoreStepper,
  type CoreStepperRootProps,
} from "@qualcomm-ui/react-core/stepper"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

/**
 * @public
 */
export type StepsRootProps = Omit<CoreStepperRootProps, "children"> & {
  children?: ReactNode
}

export function StepsRoot({children, ...props}: StepsRootProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-steps"}, props)

  return <CoreStepper.Root {...mergedProps}>{children}</CoreStepper.Root>
}
