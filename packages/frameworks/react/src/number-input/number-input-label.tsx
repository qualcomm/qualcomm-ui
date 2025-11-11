// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {InputLabel, type InputLabelProps} from "@qualcomm-ui/react/input"
import {useOnDestroy} from "@qualcomm-ui/react-core/effects"
import {useNumberInputContext} from "@qualcomm-ui/react-core/number-input"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import type {IdProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface NumberInputLabelProps extends IdProp, InputLabelProps {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function NumberInputLabel({
  id,
  ...props
}: NumberInputLabelProps): ReactElement {
  const numberInputContext = useNumberInputContext()

  const mergedProps = mergeProps(
    numberInputContext.getLabelBindings({
      id: useControlledId(id),
      onDestroy: useOnDestroy(),
    }),
    props,
  )

  return <InputLabel required={numberInputContext.required} {...mergedProps} />
}
