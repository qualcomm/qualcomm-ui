// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {Plus} from "lucide-react"

import {InlineIconButton} from "@qualcomm-ui/react/inline-icon-button"
import {CoreNumberInput} from "@qualcomm-ui/react-core/number-input"
import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsNumberInputContext} from "./qds-number-input-context"

export interface NumberInputIncrementTriggerProps
  extends ElementRenderProp<"button"> {}

export function NumberInputIncrementTrigger(
  props: NumberInputIncrementTriggerProps,
): ReactElement {
  const qdsContext = useQdsNumberInputContext()
  const mergedProps = mergeProps(
    qdsContext.getIncrementTriggerBindings(),
    props,
  )

  return (
    <CoreNumberInput.IncrementTrigger {...mergedProps}>
      <InlineIconButton icon={Plus} />
    </CoreNumberInput.IncrementTrigger>
  )
}
