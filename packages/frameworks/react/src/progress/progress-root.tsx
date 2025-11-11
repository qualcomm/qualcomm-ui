// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useMemo} from "react"

import {
  createQdsProgressApi,
  type QdsProgressApiProps,
} from "@qualcomm-ui/qds-core/progress"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {
  CoreProgress,
  type CoreProgressRootProps,
} from "@qualcomm-ui/react-core/progress"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {QdsProgressContextProvider} from "./qds-progress-context"

export interface ProgressRootProps
  extends CoreProgressRootProps,
    QdsProgressApiProps {}

/**
 * Root container for a progress indicator. Renders a `<div>` element by default.
 */
export function ProgressRoot({
  emphasis,
  labelOrientation,
  size,
  ...props
}: ProgressRootProps): ReactElement {
  const api = useMemo(
    () =>
      createQdsProgressApi(
        {
          emphasis,
          labelOrientation,
          size,
        },
        normalizeProps,
      ),
    [emphasis, labelOrientation, size],
  )

  const rootProps = mergeProps(api.getRootBindings(), props)
  return (
    <QdsProgressContextProvider value={api}>
      <CoreProgress.Root {...rootProps} />
    </QdsProgressContextProvider>
  )
}
