// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import {
  CoreStepper,
  type CoreStepperContextProps,
} from "@qualcomm-ui/react-core/stepper"

export interface StepperContextProps extends CoreStepperContextProps {}

/**
 * Render prop that provides the current stepper API context.
 */
export function StepperContext({children}: StepperContextProps): ReactNode {
  return <CoreStepper.Context>{children}</CoreStepper.Context>
}
