// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  InputEndIcon,
  InputStartIcon,
  useQdsInputContext,
} from "@qualcomm-ui/react/input"
import {
  CoreNumberInput,
  type CoreNumberInputInputGroupProps,
} from "@qualcomm-ui/react-core/number-input"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsNumberInputContext} from "./qds-number-input-context"

export interface NumberInputInputGroupProps
  extends CoreNumberInputInputGroupProps {}

export function NumberInputInputGroup({
  children,
  ...props
}: NumberInputInputGroupProps): ReactElement {
  const {endIcon, startIcon} = useQdsInputContext()
  const qdsNumberInputContext = useQdsNumberInputContext()
  const mergedProps = mergeProps(
    qdsNumberInputContext.getInputGroupBindings(),
    props,
  )

  return (
    <CoreNumberInput.InputGroup {...mergedProps}>
      {startIcon ? <InputStartIcon icon={startIcon} /> : null}
      {children}
      {endIcon ? <InputEndIcon icon={endIcon} /> : null}
    </CoreNumberInput.InputGroup>
  )
}
