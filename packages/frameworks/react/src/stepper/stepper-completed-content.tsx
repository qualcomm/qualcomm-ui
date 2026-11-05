// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreStepper,
  type CoreStepperCompletedContentProps,
} from "@qualcomm-ui/react-core/stepper"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsStepperContext} from "./qds-stepper-context.js"

export interface StepperCompletedContentProps extends CoreStepperCompletedContentProps {}

/**
 * Content area displayed when all steps are completed. Renders a `<div>` element by
 * default.
 */
export function StepperCompletedContent(
  props: StepperCompletedContentProps,
): ReactElement {
  const qdsContext = useQdsStepperContext()
  const mergedProps = mergeProps(
    qdsContext.getCompletedContentBindings(),
    props,
  )

  return <CoreStepper.CompletedContent {...mergedProps} />
}
