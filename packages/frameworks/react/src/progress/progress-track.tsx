// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  CoreProgress,
  type CoreProgressTrackProps,
} from "@qualcomm-ui/react-core/progress"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {ProgressBar} from "./progress-bar"
import {useQdsProgressContext} from "./qds-progress-context"

export interface ProgressTrackProps extends CoreProgressTrackProps {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   *
   * @default `<ProgressBar />`
   */
  children?: ReactNode
}

/**
 * Container for the progress bar. Renders a `<div>` element by default.
 */
export function ProgressTrack(props: ProgressTrackProps): ReactElement {
  const progressContext = useQdsProgressContext()

  const mergedProps = mergeProps(progressContext.getTrackBindings(), props)
  return (
    <CoreProgress.Track {...mergedProps}>
      {props.children || <ProgressBar />}
    </CoreProgress.Track>
  )
}
