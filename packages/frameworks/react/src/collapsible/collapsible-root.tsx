// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreCollapsible,
  type CoreCollapsibleRootProps,
} from "@qualcomm-ui/react-core/collapsible"

export interface CollapsibleRootProps extends CoreCollapsibleRootProps {}

/**
 * Groups all parts of the collapsible. Renders a `<div>` element by default.
 */
export function CollapsibleRoot(props: CollapsibleRootProps): ReactElement {
  return <CoreCollapsible.Root {...props} />
}
