// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreProgressRing,
  type CoreProgressRingTrackProps,
} from "@qualcomm-ui/react-core/progress-ring"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsProgressRingContext} from "./qds-progress-ring-context"

export interface ProgressRingTrackProps extends CoreProgressRingTrackProps {}

/**
 * The background track of the progress ring. Renders a `<circle>` element.
 */
export function ProgressRingTrack(props: ProgressRingTrackProps): ReactElement {
  const progressContext = useQdsProgressRingContext()

  const mergedProps = mergeProps(progressContext.getTrackBindings(), props)
  return <CoreProgressRing.Track {...mergedProps} />
}
