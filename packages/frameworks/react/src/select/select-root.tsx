// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useMemo} from "react"

import {createQdsInputApi} from "@qualcomm-ui/qds-core/input"
import {createQdsSelectApi, type QdsSelectApiProps} from "@qualcomm-ui/qds-core/select"
import {QdsInputContextProvider, type QdsReactInputApi} from "@qualcomm-ui/react/input"
import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {CoreSelect, type CoreSelectRootProps} from "@qualcomm-ui/react-core/select"
import type {Explicit} from "@qualcomm-ui/utils/guard"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {QdsSelectContextProvider} from "./qds-select-context"

export interface SelectRootProps
  extends CoreSelectRootProps,
    QdsSelectApiProps {
  /**
   * {@link https://lucide.dev lucide} icon, positioned at the start of the
   * input field.
   */
  icon?: LucideIconOrElement
}

/**
 * Groups all parts of the select. Renders a `<div>` element by default.
 */
export function SelectRoot({
  children,
  icon,
  size,
  ...props
}: SelectRootProps): ReactElement {
  const qdsSelectApi = useMemo(
    () =>
      createQdsSelectApi(
        {size} satisfies Explicit<QdsSelectApiProps>,
        normalizeProps,
      ),
    [size],
  )
  const mergedProps = mergeProps(qdsSelectApi.getRootBindings(), props)
  const qdsInputApi: QdsReactInputApi = useMemo(
    () => createQdsInputApi({size, startIcon: icon}, normalizeProps),
    [icon, size],
  )

  return (
    <QdsInputContextProvider value={qdsInputApi}>
      <QdsSelectContextProvider value={qdsSelectApi}>
        <CoreSelect.Root {...mergedProps}>{children}</CoreSelect.Root>
      </QdsSelectContextProvider>
    </QdsInputContextProvider>
  )
}
