// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, type ReactNode, useMemo} from "react"

import type {FilterDefinitions} from "@qualcomm-ui/core/filters"
import {createQdsFilterControlApi} from "@qualcomm-ui/qds-core/filter-control"
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
import {QdsFilterControlContextProvider} from "@qualcomm-ui/react/filters"
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
  const {size: controlSize} = value.getFilterControlProps()
  const filterControlContext = useMemo(
    () => createQdsFilterControlApi({size: controlSize}, normalizeProps),
    [controlSize],
  )

  return (
    <QdsFilterPanelContextProvider value={value}>
      <QdsFilterControlContextProvider value={filterControlContext}>
        <ButtonPropsContextProvider value={value.getButtonProps()}>
          {children}
        </ButtonPropsContextProvider>
      </QdsFilterControlContextProvider>
    </QdsFilterPanelContextProvider>
  )
}

export interface FilterPanelRootProps<
  TDefs extends FilterDefinitions = FilterDefinitions,
>
  extends CoreFilterPanelRootProps<TDefs>, QdsFilterPanelApiProps {}

/**
 * The root element of the filter panel. Owns the panel's filter set. To share
 * the filter set with content outside the panel, create it with
 * `useFilterSet` and render `FilterPanel.RootProvider` instead. Renders a
 * `<div>` element by default.
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
