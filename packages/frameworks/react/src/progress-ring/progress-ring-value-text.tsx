// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreProgressRing,
  type CoreProgressRingValueTextProps,
} from "@qualcomm-ui/react-core/progress-ring"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsProgressRingContext} from "./qds-progress-ring-context"

export interface ProgressRingValueTextProps
  extends CoreProgressRingValueTextProps {}

/**
 * Displays the current progress value as text. Only visible when size is `lg` or
 * `xl`. Renders a `<div>` element by default.
 */
export function ProgressRingValueText(
  props: ProgressRingValueTextProps,
): ReactElement {
  const progressContext = useQdsProgressRingContext()

  const mergedProps = mergeProps(progressContext.getValueTextBindings(), props)
  return <CoreProgressRing.ValueText {...mergedProps} />
}
