// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useMemo} from "react"

import {createQdsInputApi} from "@qualcomm-ui/qds-core/input"
import {
  createQdsSelectApi,
  type QdsSelectApiProps,
} from "@qualcomm-ui/qds-core/select"
import {
  QdsInputContextProvider,
  type QdsReactInputApi,
} from "@qualcomm-ui/react/input"
import {
  CoreCombobox,
  type CoreComboboxRootProps,
} from "@qualcomm-ui/react-core/combobox"
import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import type {CollectionItem} from "@qualcomm-ui/utils/collection"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {QdsComboboxContextProvider} from "./qds-combobox-context"

export interface ComboboxRootProps<T extends CollectionItem>
  extends CoreComboboxRootProps<T>,
    QdsSelectApiProps {
  /**
   * {@link https://lucide.dev lucide} icon, positioned at the start of the
   * input field.
   */
  icon?: LucideIconOrElement
}

/**
 * Groups all parts of the combobox. Renders a `<div>` element by default.
 */
export function ComboboxRoot<T extends CollectionItem = CollectionItem>({
  icon,
  size,
  ...props
}: ComboboxRootProps<T>): ReactElement {
  const qdsContext = useMemo(
    () => createQdsSelectApi({size}, normalizeProps),
    [size],
  )
  const qdsInputApi: QdsReactInputApi = useMemo(
    () => createQdsInputApi({size, startIcon: icon}, normalizeProps),
    [icon, size],
  )

  const mergedProps = mergeProps(qdsContext.getRootBindings(), props)

  return (
    <QdsComboboxContextProvider value={qdsContext}>
      <QdsInputContextProvider value={qdsInputApi}>
        <CoreCombobox.Root {...mergedProps} />
      </QdsInputContextProvider>
    </QdsComboboxContextProvider>
  )
}
