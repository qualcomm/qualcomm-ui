// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreCollapsible,
  type CoreCollapsibleTriggerProps,
} from "@qualcomm-ui/react-core/collapsible"

export interface CollapsibleTriggerProps extends CoreCollapsibleTriggerProps {}

/**
 * A button that opens and closes the collapsible content panel. Renders a
 * `<button>` element by default.
 */
export function CollapsibleTrigger(
  props: CollapsibleTriggerProps,
): ReactElement {
  return <CoreCollapsible.Trigger {...props} />
}
