// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  CoreTour,
  type CoreTourProgressTextProps,
} from "@qualcomm-ui/react-core/tour"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsTourContext} from "./qds-tour-context.js"

export interface TourProgressTextProps extends CoreTourProgressTextProps {
  children?: ReactNode
}

export function TourProgressText({
  children,
  ...props
}: TourProgressTextProps): ReactElement {
  const mergedProps = mergeProps(
    useQdsTourContext().getProgressTextBindings(),
    props,
  )
  return (
    <CoreTour.ProgressText {...mergedProps}>{children}</CoreTour.ProgressText>
  )
}
