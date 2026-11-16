// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useMemo} from "react"

import {
  createQdsFilterPanelApi,
  type QdsFilterPanelApiProps,
} from "@qualcomm-ui/qds-core/filter-panel"
import {
  CoreFilterPanel,
  type CoreFilterPanelRootProps,
} from "@qualcomm-ui/react-core/filter-panel"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {ButtonPropsContextProvider} from "@qualcomm-ui/react/button"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {QdsFilterPanelContextProvider} from "./qds-filter-panel-context.js"

export interface FilterPanelRootProps
  extends CoreFilterPanelRootProps, QdsFilterPanelApiProps {}

/**
 * The root element of the filter panel. Renders a `<div>` element by default.
 */
export function FilterPanelRoot({
  size,
  ...props
}: FilterPanelRootProps): ReactElement {
  const qdsContext = useMemo(
    () => createQdsFilterPanelApi({size}, normalizeProps),
    [size],
  )

  const mergedProps = mergeProps(qdsContext.getRootBindings(), props)

  return (
    <QdsFilterPanelContextProvider value={qdsContext}>
      <ButtonPropsContextProvider value={qdsContext.getButtonProps()}>
        <CoreFilterPanel.Root {...mergedProps} />
      </ButtonPropsContextProvider>
    </QdsFilterPanelContextProvider>
  )
}
