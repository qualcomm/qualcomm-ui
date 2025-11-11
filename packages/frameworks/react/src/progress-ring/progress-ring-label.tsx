// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreProgressRing,
  type CoreProgressRingLabelProps,
} from "@qualcomm-ui/react-core/progress-ring"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsProgressRingContext} from "./qds-progress-ring-context"

export interface ProgressRingLabelProps extends CoreProgressRingLabelProps {}

/**
 * Label text associated with the progress ring. Renders a `<label>` element by
 * default.
 */
export function ProgressRingLabel(props: ProgressRingLabelProps): ReactElement {
  const progressContext = useQdsProgressRingContext()

  const mergedProps = mergeProps(progressContext.getLabelBindings(), props)
  return <CoreProgressRing.Label {...mergedProps} />
}
