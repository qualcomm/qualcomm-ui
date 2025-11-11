// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {InputErrorText} from "@qualcomm-ui/react/input"
import {useOnDestroy} from "@qualcomm-ui/react-core/effects"
import {
  type CoreProgressErrorTextProps,
  useProgressContext,
} from "@qualcomm-ui/react-core/progress"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsProgressContext} from "./qds-progress-context"

export interface ProgressErrorTextProps extends CoreProgressErrorTextProps {}

/**
 * Error text displayed when the progress is in an invalid state. Renders a styled
 * error text element.
 */
export function ProgressErrorText({
  id,
  ...props
}: ProgressErrorTextProps): ReactElement {
  const qdsProgressContext = useQdsProgressContext()
  const progressContext = useProgressContext()

  const mergedProps = mergeProps(
    progressContext.getErrorTextBindings({
      id: useControlledId(id),
      onDestroy: useOnDestroy(),
    }),
    qdsProgressContext.getErrorTextBindings(),
    props,
  )
  return <InputErrorText {...mergedProps} />
}
