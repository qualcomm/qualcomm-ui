// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreTour,
  type CoreTourArrowTipProps,
} from "@qualcomm-ui/react-core/tour"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsTourContext} from "./qds-tour-context.js"

export interface TourArrowTipProps extends CoreTourArrowTipProps {}

export function TourArrowTip(props: TourArrowTipProps): ReactElement {
  const mergedProps = mergeProps(
    useQdsTourContext().getArrowTipBindings(),
    props,
  )
  return <CoreTour.ArrowTip {...mergedProps} />
}
