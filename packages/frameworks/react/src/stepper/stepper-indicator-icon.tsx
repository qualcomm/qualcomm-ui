// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {IconOrNode, type IconOrNodeProps} from "@qualcomm-ui/react/icon"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsStepperContext} from "./qds-stepper-context"

export interface StepperIndicatorIconProps
  extends Omit<IconOrNodeProps, "size"> {}

export function StepperIndicatorIcon(
  props: StepperIndicatorIconProps,
): ReactElement {
  const qdsContext = useQdsStepperContext()
  const mergedProps = mergeProps(qdsContext.getIndicatorIconBindings(), props)

  return <IconOrNode {...mergedProps} />
}
