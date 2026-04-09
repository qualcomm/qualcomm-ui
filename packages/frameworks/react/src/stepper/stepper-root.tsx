// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useMemo} from "react"

import {
  createQdsStepperApi,
  type QdsStepperApiProps,
} from "@qualcomm-ui/qds-core/stepper"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {
  CoreStepper,
  type CoreStepperRootProps,
} from "@qualcomm-ui/react-core/stepper"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {QdsStepperContextProvider} from "./qds-stepper-context"

export interface StepperRootProps
  extends CoreStepperRootProps,
    QdsStepperApiProps {}

/**
 * Groups all parts of the stepper. Renders a `<div>` element by default.
 */
export function StepperRoot({size, ...props}: StepperRootProps): ReactElement {
  const qdsContext = useMemo(
    () => createQdsStepperApi({size}, normalizeProps),
    [size],
  )

  const mergedProps = mergeProps(qdsContext.getRootBindings(), props)

  return (
    <QdsStepperContextProvider value={qdsContext}>
      <CoreStepper.Root {...mergedProps} />
    </QdsStepperContextProvider>
  )
}
