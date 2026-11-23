// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsFilterPanelContext} from "./qds-filter-panel-context.js"

export interface FilterPanelHeaderProps extends ElementRenderProp<"div"> {}

/**
 * The header of the filter panel. Renders a `<div>` element by default.
 */
export function FilterPanelHeader(props: FilterPanelHeaderProps): ReactElement {
  const qdsContext = useQdsFilterPanelContext()

  const mergedProps = mergeProps(qdsContext.getHeaderBindings(), props)
  return <PolymorphicElement as="div" {...mergedProps} />
}
