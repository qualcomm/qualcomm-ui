// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, type ReactNode, useMemo} from "react"

import {createQdsTourApi} from "@qualcomm-ui/qds-core/tour"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {CoreTour, type CoreTourRootProps} from "@qualcomm-ui/react-core/tour"

import {QdsTourContextProvider} from "./qds-tour-context.js"
import type {TourRootApiProps} from "./tour.types.js"

export interface TourRootProps extends TourRootApiProps {
  /** Parts and controls associated with this tour. */
  children: ReactNode
}

/** Groups Tour parts without rendering a wrapper element. */
export function TourRoot({children, ...props}: TourRootProps): ReactElement {
  const qdsTour = useMemo(() => createQdsTourApi(normalizeProps), [])

  return (
    <QdsTourContextProvider value={qdsTour}>
      <CoreTour.Root {...(props as CoreTourRootProps)}>
        {children}
      </CoreTour.Root>
    </QdsTourContextProvider>
  )
}
