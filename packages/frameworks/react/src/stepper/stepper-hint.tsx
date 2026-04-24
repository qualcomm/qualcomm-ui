// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreStepper,
  type CoreStepperHintProps,
} from "@qualcomm-ui/react-core/stepper"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsStepperContext} from "./qds-stepper-context"

export interface StepperHintProps extends CoreStepperHintProps {}

/**
 * Displays a step subtitle or hint. Renders a `<span>` element by default.
 */
export function StepperHint(props: StepperHintProps): ReactElement {
  const qdsContext = useQdsStepperContext()
  const mergedProps = mergeProps(qdsContext.getHintBindings(), props)

  return <CoreStepper.Hint {...mergedProps} />
}
