// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  CoreTour,
  type CoreTourPositionerProps,
} from "@qualcomm-ui/react-core/tour"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsTourContext} from "./qds-tour-context.js"

export interface TourPositionerProps extends CoreTourPositionerProps {
  children?: ReactNode
}

export function TourPositioner({
  children,
  ...props
}: TourPositionerProps): ReactElement {
  const mergedProps = mergeProps(
    useQdsTourContext().getPositionerBindings(),
    props,
  )
  return <CoreTour.Positioner {...mergedProps}>{children}</CoreTour.Positioner>
}
