// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {useQdsTableRootContext} from "@qualcomm-ui/react/table"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface TableToolbarEndProps extends ElementRenderProp<"div"> {}

/**
 * Groups controls aligned to the end of the toolbar, such as view options and
 * primary actions. Renders a `<div>` element by default.
 */
export function TableToolbarEnd(props: TableToolbarEndProps): ReactElement {
  const qdsContext = useQdsTableRootContext()

  const mergedProps = mergeProps(qdsContext.getToolbarEndBindings(), props)
  return <PolymorphicElement as="div" {...mergedProps} />
}
