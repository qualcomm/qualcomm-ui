// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreNumberInput,
  type CoreNumberInputControlProps,
} from "@qualcomm-ui/react-core/number-input"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {NumberInputDecrementTrigger} from "./number-input-decrement-trigger"
import {NumberInputIncrementTrigger} from "./number-input-increment-trigger"
import {useQdsNumberInputContext} from "./qds-number-input-context"

export interface NumberInputControlProps extends CoreNumberInputControlProps {}

export function NumberInputControl({
  children,
  ...props
}: NumberInputControlProps): ReactElement {
  const qdsContext = useQdsNumberInputContext()
  const mergedProps = mergeProps(qdsContext.getControlBindings(), props)

  return (
    <CoreNumberInput.Control {...mergedProps}>
      {children || (
        // provide this shortcut if the user omits children.
        <>
          <NumberInputDecrementTrigger />
          <NumberInputIncrementTrigger />
        </>
      )}
    </CoreNumberInput.Control>
  )
}
