// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {Minus} from "lucide-react"

import {CoreNumberInput} from "@qualcomm-ui/react-core/number-input"
import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"
import {IconButton} from "@qualcomm-ui/react/button"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsNumberInputContext} from "./qds-number-input-context.js"

export interface NumberInputDecrementTriggerProps extends ElementRenderProp<"button"> {}

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
      <IconButton density="compact" variant="ghost" icon={Minus} />
    </CoreNumberInput.DecrementTrigger>
  )
}
