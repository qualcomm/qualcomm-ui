// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreStepper,
  type CoreStepperItemProps,
} from "@qualcomm-ui/react-core/stepper"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsStepperContext} from "./qds-stepper-context"

export interface StepperItemProps extends CoreStepperItemProps {}

/**
 * Wrapper for a single step. Renders a `<div>` element by default.
 */
export function StepperItem(props: StepperItemProps): ReactElement {
  const qdsContext = useQdsStepperContext()
  const mergedProps = mergeProps(qdsContext.getItemBindings(), props)

  return <CoreStepper.Item {...mergedProps} />
}
