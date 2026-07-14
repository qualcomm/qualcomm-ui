// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {CoreTour, type CoreTourContentProps} from "@qualcomm-ui/react-core/tour"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsTourContext} from "./qds-tour-context.js"

export interface TourContentProps extends CoreTourContentProps {
  children?: ReactNode
}

export function TourContent({
  children,
  ...props
}: TourContentProps): ReactElement {
  const mergedProps = mergeProps(
    useQdsTourContext().getContentBindings(),
    props,
  )
  return <CoreTour.Content {...mergedProps}>{children}</CoreTour.Content>
}
