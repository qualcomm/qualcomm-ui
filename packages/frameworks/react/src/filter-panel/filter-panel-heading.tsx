// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsFilterPanelContext} from "./qds-filter-panel-context.js"

export interface FilterPanelHeadingProps extends ElementRenderProp<"h2"> {}

/**
 * The title of the filter panel. Renders an `<h2>` element by default.
 */
export function FilterPanelHeading(
  props: FilterPanelHeadingProps,
): ReactElement {
  const qdsContext = useQdsFilterPanelContext()

  const mergedProps = mergeProps(qdsContext.getHeadingBindings(), props)
  return <PolymorphicElement as="h2" {...mergedProps} />
}
