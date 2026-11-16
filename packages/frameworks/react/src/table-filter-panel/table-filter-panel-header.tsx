// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {useQdsTableRootContext} from "@qualcomm-ui/react/table"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface TableFilterPanelHeaderProps extends ElementRenderProp<"div"> {}

/**
 * The header of the filter panel. Renders a `<div>` element by default.
 */
export function TableFilterPanelHeader(
  props: TableFilterPanelHeaderProps,
): ReactElement {
  const qdsContext = useQdsTableRootContext()

  const mergedProps = mergeProps(
    qdsContext.getFilterPanelHeaderBindings(),
    props,
  )
  return <PolymorphicElement as="div" {...mergedProps} />
}
