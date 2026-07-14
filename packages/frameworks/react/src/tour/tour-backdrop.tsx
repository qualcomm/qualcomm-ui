// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreTour,
  type CoreTourBackdropProps,
} from "@qualcomm-ui/react-core/tour"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsTourContext} from "./qds-tour-context.js"

export interface TourBackdropProps extends CoreTourBackdropProps {}

export function TourBackdrop(props: TourBackdropProps): ReactElement {
  const mergedProps = mergeProps(
    useQdsTourContext().getBackdropBindings(),
    props,
  )
  return <CoreTour.Backdrop {...mergedProps} />
}
