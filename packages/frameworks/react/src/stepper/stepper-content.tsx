// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreStepper,
  type CoreStepperContentProps,
} from "@qualcomm-ui/react-core/stepper"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsStepperContext} from "./qds-stepper-context"

export interface StepperContentProps extends CoreStepperContentProps {}

/**
 * Content area for a step. Renders a `<div>` element by default.
 */
export function StepperContent(props: StepperContentProps): ReactElement {
  const qdsContext = useQdsStepperContext()
  const mergedProps = mergeProps(qdsContext.getContentBindings(), props)

  return <CoreStepper.Content {...mergedProps} />
}
