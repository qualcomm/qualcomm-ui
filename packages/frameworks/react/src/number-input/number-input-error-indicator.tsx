// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  InputErrorIndicator,
  type InputErrorIndicatorProps,
} from "@qualcomm-ui/react/input"
import {useNumberInputContext} from "@qualcomm-ui/react-core/number-input"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsNumberInputContext} from "./qds-number-input-context"

export interface NumberInputErrorIndicatorProps
  extends InputErrorIndicatorProps {}

export function NumberInputErrorIndicator(
  props: NumberInputErrorIndicatorProps,
): ReactElement {
  const context = useNumberInputContext()
  const qdsContext = useQdsNumberInputContext()
  const mergedProps = mergeProps(
    context.getErrorIndicatorBindings(),
    qdsContext.getErrorIndicatorBindings(),
    props,
  )
  return <InputErrorIndicator {...mergedProps} />
}
