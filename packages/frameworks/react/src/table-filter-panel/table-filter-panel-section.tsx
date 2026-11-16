// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {useQdsTableRootContext} from "@qualcomm-ui/react/table"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface TableFilterPanelSectionProps extends ElementRenderProp<"div"> {}

/**
 * A group of related filter controls within the filter panel. Renders a
 * `<div>` element by default.
 */
export function TableFilterPanelSection(
  props: TableFilterPanelSectionProps,
): ReactElement {
  const qdsContext = useQdsTableRootContext()

  const mergedProps = mergeProps(
    qdsContext.getFilterPanelSectionBindings(),
    props,
  )
  return <PolymorphicElement as="div" {...mergedProps} />
}
