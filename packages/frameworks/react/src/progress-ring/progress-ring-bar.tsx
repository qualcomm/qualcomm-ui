// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreProgressRing,
  type CoreProgressRingBarProps,
} from "@qualcomm-ui/react-core/progress-ring"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsProgressRingContext} from "./qds-progress-ring-context"

export interface ProgressRingBarProps extends CoreProgressRingBarProps {}

/**
 * The filled portion of the progress ring that represents the current progress
 * value. Renders a `<circle>` element.
 */
export function ProgressRingBar(props: ProgressRingBarProps): ReactElement {
  const progressContext = useQdsProgressRingContext()

  const mergedProps = mergeProps(progressContext.getBarBindings(), props)
  return <CoreProgressRing.Bar {...mergedProps} />
}
