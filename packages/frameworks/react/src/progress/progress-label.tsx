// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreProgress,
  type CoreProgressLabelProps,
} from "@qualcomm-ui/react-core/progress"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsProgressContext} from "./qds-progress-context"

export interface ProgressLabelProps extends CoreProgressLabelProps {}

/**
 * Label for the progress indicator. Renders a `<div>` element by default.
 */
export function ProgressLabel(props: ProgressLabelProps): ReactElement {
  const progressContext = useQdsProgressContext()

  const mergedProps = mergeProps(progressContext.getLabelBindings(), props)
  return <CoreProgress.Label {...mergedProps} />
}
