// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreProgressRing,
  type CoreProgressRingErrorTextProps,
} from "@qualcomm-ui/react-core/progress-ring"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsProgressRingContext} from "./qds-progress-ring-context"

export interface ProgressRingErrorTextProps
  extends CoreProgressRingErrorTextProps {}

/**
 * Error message displayed when the progress ring is in an invalid state. Renders a
 * `<div>` element by default.
 */
export function ProgressRingErrorText(
  props: ProgressRingErrorTextProps,
): ReactElement {
  const progressContext = useQdsProgressRingContext()

  const mergedProps = mergeProps(progressContext.getErrorTextBindings(), props)
  return <CoreProgressRing.ErrorText {...mergedProps} />
}
