// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  CoreTour,
  type CoreTourDescriptionProps,
} from "@qualcomm-ui/react-core/tour"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsTourContext} from "./qds-tour-context.js"

export interface TourDescriptionProps extends CoreTourDescriptionProps {
  children?: ReactNode
}

export function TourDescription({
  children,
  ...props
}: TourDescriptionProps): ReactElement {
  const mergedProps = mergeProps(
    useQdsTourContext().getDescriptionBindings(),
    props,
  )
  return (
    <CoreTour.Description {...mergedProps}>{children}</CoreTour.Description>
  )
}
