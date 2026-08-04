// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreStepper,
  type CoreStepperTriggerProps,
} from "@qualcomm-ui/react-core/stepper"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsStepperContext} from "./qds-stepper-context.js"

export interface StepperTriggerProps extends CoreStepperTriggerProps {}

/**
 * Used to make each step item clickable. Renders a `<button>` element by default.
 */
export function StepperTrigger(props: StepperTriggerProps): ReactElement {
  const qdsContext = useQdsStepperContext()
  const mergedProps = mergeProps(qdsContext.getTriggerBindings(), props)

  return <CoreStepper.Trigger {...mergedProps} />
}
