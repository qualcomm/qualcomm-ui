// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreStepper,
  type CoreStepperPrevTriggerProps,
} from "@qualcomm-ui/react-core/stepper"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsStepperContext} from "./qds-stepper-context.js"

export interface StepperPrevTriggerProps extends CoreStepperPrevTriggerProps {}

/**
 * Navigates to the previous step. Renders a `<button>` element by default.
 */
export function StepperPrevTrigger(
  props: StepperPrevTriggerProps,
): ReactElement {
  const qdsContext = useQdsStepperContext()
  const mergedProps = mergeProps(qdsContext.getPrevTriggerBindings(), props)

  return <CoreStepper.PrevTrigger {...mergedProps} />
}
