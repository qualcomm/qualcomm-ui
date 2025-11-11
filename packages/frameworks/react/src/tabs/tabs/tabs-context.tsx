// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {CoreTabs, type CoreTabsContextProps} from "@qualcomm-ui/react-core/tabs"

export interface TabsContextProps extends CoreTabsContextProps {}

export function TabsContext(props: TabsContextProps): ReactElement {
  return <CoreTabs.Context {...props} />
}
