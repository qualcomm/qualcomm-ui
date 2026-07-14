// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import {type RenderProp, renderProp} from "@qualcomm-ui/react-core/system"
import {CoreTour} from "@qualcomm-ui/react-core/tour"

import type {TourApi} from "./tour.types.js"

export interface TourContextProps {
  children: RenderProp<TourApi>
}

export function TourContext({children}: TourContextProps): ReactNode {
  return (
    <CoreTour.Context>
      {(context) => renderProp(children, context as TourApi)}
    </CoreTour.Context>
  )
}
