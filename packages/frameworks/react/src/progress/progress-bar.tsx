// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreProgress,
  type CoreProgressBarProps,
} from "@qualcomm-ui/react-core/progress"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsProgressContext} from "./qds-progress-context"

export interface ProgressBarProps extends CoreProgressBarProps {}

/**
 * Visual indicator that shows progress completion. Renders a `<div>` element by
 * default.
 */
export function ProgressBar(props: ProgressBarProps): ReactElement {
  const progressContext = useQdsProgressContext()

  const mergedProps = mergeProps(progressContext.getBarBindings(), props)
  return <CoreProgress.Bar {...mergedProps} />
}
