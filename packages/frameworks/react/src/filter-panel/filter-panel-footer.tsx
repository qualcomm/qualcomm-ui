// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsFilterPanelContext} from "./qds-filter-panel-context.js"

export interface FilterPanelFooterProps extends ElementRenderProp<"div"> {}

/**
 * The footer of the filter panel. Renders a `<div>` element by default.
 */
export function FilterPanelFooter(props: FilterPanelFooterProps): ReactElement {
  const qdsContext = useQdsFilterPanelContext()

  const mergedProps = mergeProps(qdsContext.getFooterBindings(), props)
  return <PolymorphicElement as="div" {...mergedProps} />
}
