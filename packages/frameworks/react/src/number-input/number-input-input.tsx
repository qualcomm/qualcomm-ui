// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreNumberInput,
  type CoreNumberInputInputProps,
} from "@qualcomm-ui/react-core/number-input"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsNumberInputContext} from "./qds-number-input-context"

export interface NumberInputInputProps extends CoreNumberInputInputProps {}

export function NumberInputInput(props: NumberInputInputProps): ReactElement {
  const qdsContext = useQdsNumberInputContext()

  const mergedProps = mergeProps(qdsContext.getInputBindings(), props)

  return <CoreNumberInput.Input {...mergedProps} />
}
