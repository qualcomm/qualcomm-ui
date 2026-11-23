// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {useQdsTableRootContext} from "@qualcomm-ui/react/table"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface TableToolbarStartProps extends ElementRenderProp<"div"> {}

/**
 * Groups controls aligned to the start of the toolbar, such as filters.
 * Renders a `<div>` element by default.
 */
export function TableToolbarStart(props: TableToolbarStartProps): ReactElement {
  const qdsContext = useQdsTableRootContext()

  const mergedProps = mergeProps(qdsContext.getToolbarStartBindings(), props)
  return <PolymorphicElement as="div" {...mergedProps} />
}
