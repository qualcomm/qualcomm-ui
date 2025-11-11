// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreProgress,
  type CoreProgressValueTextProps,
} from "@qualcomm-ui/react-core/progress"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsProgressContext} from "./qds-progress-context"

export interface ProgressValueTextProps extends CoreProgressValueTextProps {}

/**
 * Text that displays the progress value. Renders a `<div>` element by default.
 */
export function ProgressValueText(props: ProgressValueTextProps): ReactElement {
  const progressContext = useQdsProgressContext()

  const mergedProps = mergeProps(progressContext.getValueTextBindings(), props)
  return <CoreProgress.ValueText {...mergedProps} />
}
