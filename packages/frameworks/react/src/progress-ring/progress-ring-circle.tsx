// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreProgressRing,
  type CoreProgressRingCircleProps,
} from "@qualcomm-ui/react-core/progress-ring"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {ProgressRingBar} from "./progress-ring-bar"
import {ProgressRingTrack} from "./progress-ring-track"
import {useQdsProgressRingContext} from "./qds-progress-ring-context"

export interface ProgressRingCircleProps extends CoreProgressRingCircleProps {}

/**
 * The SVG element that contains the track and bar. Renders an `<svg>` element.
 */
export function ProgressRingCircle({
  children,
  ...props
}: ProgressRingCircleProps): ReactElement {
  const progressContext = useQdsProgressRingContext()

  const mergedProps = mergeProps(progressContext.getCircleBindings(), props)
  return (
    <CoreProgressRing.Circle {...mergedProps}>
      {children || (
        <>
          <ProgressRingTrack />
          <ProgressRingBar />
        </>
      )}
    </CoreProgressRing.Circle>
  )
}
