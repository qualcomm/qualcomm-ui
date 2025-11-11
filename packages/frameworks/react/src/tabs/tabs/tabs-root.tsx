// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useMemo} from "react"

import {
  createQdsTabsApi,
  type QdsTabsApiProps,
} from "@qualcomm-ui/qds-core/tabs"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {CoreTabs, type CoreTabsRootProps} from "@qualcomm-ui/react-core/tabs"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {QdsTabsContextProvider} from "../qds-tabs-context"

export interface TabsRootProps extends CoreTabsRootProps, QdsTabsApiProps {}

/**
 * Groups all parts of the tabs. Renders a `<div>` element by default.
 */
export function TabsRoot({
  animateIndicator,
  iconVariant,
  size,
  variant,
  ...props
}: TabsRootProps): ReactElement {
  const qdsContext = useMemo(
    () =>
      createQdsTabsApi(
        {animateIndicator, iconVariant, size, variant},
        normalizeProps,
      ),
    [animateIndicator, iconVariant, size, variant],
  )

  const mergedProps = mergeProps(qdsContext.getRootBindings(), props)

  return (
    <QdsTabsContextProvider value={qdsContext}>
      <CoreTabs.Root {...mergedProps} />
    </QdsTabsContextProvider>
  )
}
