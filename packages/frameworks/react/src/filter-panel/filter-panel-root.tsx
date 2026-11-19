// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, type ReactNode, useMemo} from "react"

import type {FilterDefinitions} from "@qualcomm-ui/core/filters"
import {
  createQdsFilterPanelApi,
  type QdsFilterPanelApi,
  type QdsFilterPanelApiProps,
  type QdsFilterPanelSize,
} from "@qualcomm-ui/qds-core/filter-panel"
import {
  CoreFilterPanel,
  type CoreFilterPanelRootProps,
} from "@qualcomm-ui/react-core/filter-panel"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {ButtonPropsContextProvider} from "@qualcomm-ui/react/button"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {QdsFilterPanelContextProvider} from "./qds-filter-panel-context.js"

export function useQdsFilterPanel(
  size: QdsFilterPanelSize | undefined,
): QdsFilterPanelApi {
  return useMemo(() => createQdsFilterPanelApi({size}, normalizeProps), [size])
}

export function QdsFilterPanelProviders({
  children,
  value,
}: {
  children: ReactNode
  value: QdsFilterPanelApi
}): ReactElement {
  return (
    <QdsFilterPanelContextProvider value={value}>
      <ButtonPropsContextProvider value={value.getButtonProps()}>
        {children}
      </ButtonPropsContextProvider>
    </QdsFilterPanelContextProvider>
  )
}

export interface FilterPanelRootProps<
  TDefs extends FilterDefinitions = FilterDefinitions,
>
  extends CoreFilterPanelRootProps<TDefs>, QdsFilterPanelApiProps {}

/**
 * The root element of the filter panel. Owns the panel's state. To share the
 * state with content outside the panel, create it with `useFilterPanel` and
 * render `FilterPanel.RootProvider` instead. Renders a `<div>` element by
 * default.
 */
export function FilterPanelRoot<
  TDefs extends FilterDefinitions = FilterDefinitions,
>({size, ...props}: FilterPanelRootProps<TDefs>): ReactElement {
  const qdsContext = useQdsFilterPanel(size)

  return (
    <QdsFilterPanelProviders value={qdsContext}>
      <CoreFilterPanel.Root
        {...mergeProps(qdsContext.getRootBindings(), props)}
      />
    </QdsFilterPanelProviders>
  )
}
