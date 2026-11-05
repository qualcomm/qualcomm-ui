// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreStepper,
  type CoreStepperListProps,
} from "@qualcomm-ui/react-core/stepper"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsStepperContext} from "./qds-stepper-context.js"

export interface StepperListProps extends CoreStepperListProps {}

/**
 * Container for the step items. Renders a `<div>` element by default.
 */
export function StepperList(props: StepperListProps): ReactElement {
  const qdsContext = useQdsStepperContext()
  const mergedProps = mergeProps(qdsContext.getListBindings(), props)

  return <CoreStepper.List {...mergedProps} />
}
