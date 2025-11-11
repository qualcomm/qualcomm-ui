// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useMemo} from "react"

import {createQdsInputApi} from "@qualcomm-ui/qds-core/input"
import {createQdsNumberInputApi} from "@qualcomm-ui/qds-core/number-input"
import {
  QdsInputContextProvider,
  type QdsReactInputApiProps,
} from "@qualcomm-ui/react/input"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {
  CoreNumberInput,
  type CoreNumberInputRootProps,
} from "@qualcomm-ui/react-core/number-input"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {QdsNumberInputContextProvider} from "./qds-number-input-context"

export interface NumberInputRootProps
  extends CoreNumberInputRootProps,
    QdsReactInputApiProps {}

export function NumberInputRoot({
  endIcon,
  size,
  startIcon,
  ...props
}: NumberInputRootProps): ReactElement {
  const qdsContext = useMemo(
    () => createQdsInputApi({endIcon, size, startIcon}, normalizeProps),
    [endIcon, size, startIcon],
  )
  const numberInputContext = useMemo(
    () => createQdsNumberInputApi({size}, normalizeProps),
    [size],
  )

  const mergedProps = mergeProps(qdsContext.getRootBindings(), props)

  return (
    <QdsInputContextProvider value={qdsContext}>
      <QdsNumberInputContextProvider value={numberInputContext}>
        <CoreNumberInput.Root {...mergedProps} />
      </QdsNumberInputContextProvider>
    </QdsInputContextProvider>
  )
}
