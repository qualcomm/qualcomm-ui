// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {collapsibleClasses} from "@qualcomm-ui/qds-core/collapsible"
import {
  CoreCollapsible,
  type CoreCollapsibleContentProps,
} from "@qualcomm-ui/react-core/collapsible"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface CollapsibleContentProps extends CoreCollapsibleContentProps {}

/**
 * A panel with collapsible contents. Renders a `<div>` element by default.
 */
export function CollapsibleContent(
  props: CollapsibleContentProps,
): ReactElement {
  const mergedProps = mergeProps(
    {
      className: collapsibleClasses.content,
    },
    props,
  )

  return <CoreCollapsible.Content {...mergedProps} />
}
