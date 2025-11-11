// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useMemo} from "react"

import {
  createQdsProgressRingApi,
  type QdsProgressRingApiProps,
} from "@qualcomm-ui/qds-core/progress-ring"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {
  CoreProgressRing,
  type CoreProgressRingRootProps,
} from "@qualcomm-ui/react-core/progress-ring"
import type {Explicit} from "@qualcomm-ui/utils/guard"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {QdsProgressRingContextProvider} from "./qds-progress-ring-context"

export interface ProgressRingRootProps
  extends CoreProgressRingRootProps,
    QdsProgressRingApiProps {}

/**
 * The root container element for the progress ring component. Renders a `<div>`
 * element by default.
 */
export function ProgressRingRoot({
  emphasis,
  size,
  thickness,
  ...props
}: ProgressRingRootProps): ReactElement {
  const api = useMemo(
    () =>
      createQdsProgressRingApi(
        {
          emphasis,
          size,
          thickness,
        } satisfies Explicit<QdsProgressRingApiProps>,
        normalizeProps,
      ),
    [emphasis, size, thickness],
  )

  const rootProps = mergeProps(api.getRootBindings(), props)
  return (
    <QdsProgressRingContextProvider value={api}>
      <CoreProgressRing.Root {...rootProps} />
    </QdsProgressRingContextProvider>
  )
}
