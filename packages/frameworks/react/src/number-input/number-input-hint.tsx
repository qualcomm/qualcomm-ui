// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {useQdsInputContext} from "@qualcomm-ui/react/input"
import {
  CoreNumberInput,
  type CoreNumberInputHintProps,
} from "@qualcomm-ui/react-core/number-input"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface NumberInputHintProps extends CoreNumberInputHintProps {}

export function NumberInputHint(props: NumberInputHintProps): ReactElement {
  const qdsContext = useQdsInputContext()
  const mergedProps = mergeProps(qdsContext.getHintBindings(), props)

  return <CoreNumberInput.Hint {...mergedProps} />
}
