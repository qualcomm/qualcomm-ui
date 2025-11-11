// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {type InputErrorTextProps, useQdsInputContext} from "@qualcomm-ui/react/input"
import {CoreNumberInput} from "@qualcomm-ui/react-core/number-input"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface NumberInputErrorTextProps extends InputErrorTextProps {}

export function NumberInputErrorText(
  props: NumberInputErrorTextProps,
): ReactElement {
  const qdsContext = useQdsInputContext(false)

  const mergedProps = mergeProps(qdsContext?.getErrorTextBindings(), props)

  return <CoreNumberInput.ErrorText {...mergedProps} />
}
