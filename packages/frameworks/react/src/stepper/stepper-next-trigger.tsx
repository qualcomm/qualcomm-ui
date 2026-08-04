// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreStepper,
  type CoreStepperNextTriggerProps,
} from "@qualcomm-ui/react-core/stepper"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsStepperContext} from "./qds-stepper-context.js"

export interface StepperNextTriggerProps extends CoreStepperNextTriggerProps {}

/**
 * Navigates to the next step. Renders a `<button>` element by default.
 */
export function StepperNextTrigger(
  props: StepperNextTriggerProps,
): ReactElement {
  const qdsContext = useQdsStepperContext()
  const mergedProps = mergeProps(qdsContext.getNextTriggerBindings(), props)

  return <CoreStepper.NextTrigger {...mergedProps} />
}
