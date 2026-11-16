// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {useQdsTableRootContext} from "@qualcomm-ui/react/table"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface TableFilterPanelHeadingProps extends ElementRenderProp<"h2"> {}

/**
 * The title of the filter panel. Renders an `<h2>` element by default.
 */
export function TableFilterPanelHeading(
  props: TableFilterPanelHeadingProps,
): ReactElement {
  const qdsContext = useQdsTableRootContext()

  const mergedProps = mergeProps(
    qdsContext.getFilterPanelHeadingBindings(),
    props,
  )
  return <PolymorphicElement as="h2" {...mergedProps} />
}
