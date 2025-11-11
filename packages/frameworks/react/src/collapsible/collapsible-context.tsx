// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import {
  CoreCollapsible,
  type CoreCollapsibleContextProps,
} from "@qualcomm-ui/react-core/collapsible"

export interface CollapsibleContextProps extends CoreCollapsibleContextProps {}

export function CollapsibleContext(props: CollapsibleContextProps): ReactNode {
  return <CoreCollapsible.Context {...props} />
}
