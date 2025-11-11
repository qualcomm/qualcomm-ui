// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {Minus} from "lucide-react"

import {InlineIconButton} from "@qualcomm-ui/react/inline-icon-button"
import {CoreNumberInput} from "@qualcomm-ui/react-core/number-input"
import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsNumberInputContext} from "./qds-number-input-context"

export interface NumberInputDecrementTriggerProps
  extends ElementRenderProp<"button"> {}

export function NumberInputDecrementTrigger(
  props: NumberInputDecrementTriggerProps,
): ReactElement {
  const qdsContext = useQdsNumberInputContext()
  const mergedProps = mergeProps(
    qdsContext.getDecrementTriggerBindings(),
    props,
  )

  return (
    <CoreNumberInput.DecrementTrigger {...mergedProps}>
      <InlineIconButton icon={Minus} />
    </CoreNumberInput.DecrementTrigger>
  )
}
