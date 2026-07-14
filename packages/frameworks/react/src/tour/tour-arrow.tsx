// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {CoreTour, type CoreTourArrowProps} from "@qualcomm-ui/react-core/tour"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsTourContext} from "./qds-tour-context.js"
import {TourArrowTip} from "./tour-arrow-tip.js"

export interface TourArrowProps extends CoreTourArrowProps {
  children?: ReactNode
}

export function TourArrow({
  children = <TourArrowTip />,
  ...props
}: TourArrowProps): ReactElement {
  const mergedProps = mergeProps(useQdsTourContext().getArrowBindings(), props)
  return <CoreTour.Arrow {...mergedProps}>{children}</CoreTour.Arrow>
}
