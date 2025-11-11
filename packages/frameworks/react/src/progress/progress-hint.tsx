// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreProgress,
  type CoreProgressHintProps,
} from "@qualcomm-ui/react-core/progress"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsProgressContext} from "./qds-progress-context"

export interface ProgressHintProps extends CoreProgressHintProps {}

export function ProgressHint(props: ProgressHintProps): ReactElement {
  const qdsContext = useQdsProgressContext()
  const mergedProps = mergeProps(qdsContext.getHintBindings(), props)

  return <CoreProgress.Hint {...mergedProps} />
}
