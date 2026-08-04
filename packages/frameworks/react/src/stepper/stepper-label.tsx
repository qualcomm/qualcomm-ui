// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreStepper,
  type CoreStepperLabelProps,
} from "@qualcomm-ui/react-core/stepper"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsStepperContext} from "./qds-stepper-context.js"

export interface StepperLabelProps extends CoreStepperLabelProps {}

/**
 * Displays the step title. Renders a `<span>` element by default.
 */
export function StepperLabel(props: StepperLabelProps): ReactElement {
  const qdsContext = useQdsStepperContext()
  const mergedProps = mergeProps(qdsContext.getLabelBindings(), props)

  return <CoreStepper.Label {...mergedProps} />
}
