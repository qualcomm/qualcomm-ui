// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreStepper,
  type CoreStepperSeparatorProps,
} from "@qualcomm-ui/react-core/stepper"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsStepperContext} from "./qds-stepper-context"

export interface StepperSeparatorProps extends CoreStepperSeparatorProps {}

/**
 * Visual connector between steps. Renders a `<div>` element by default.
 */
export function StepperSeparator(props: StepperSeparatorProps): ReactElement {
  const qdsContext = useQdsStepperContext()
  const mergedProps = mergeProps(qdsContext.getSeparatorBindings(), props)

  return <CoreStepper.Separator {...mergedProps} />
}
