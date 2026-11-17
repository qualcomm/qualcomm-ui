// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {ChevronDown} from "lucide-react"

import {useCollapsibleContext} from "@qualcomm-ui/react-core/collapsible"
import type {LucideIconOrNode} from "@qualcomm-ui/react-core/lucide"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {IconOrNode} from "@qualcomm-ui/react/icon"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsFilterPanelContext} from "./qds-filter-panel-context.js"

export interface FilterPanelFilterIndicatorProps extends ElementRenderProp<"span"> {
  /**
   * Indicator icon for the filter trigger.
   *
   * @default ChevronDown
   */
  icon?: LucideIconOrNode
}

/**
 * Indicates whether the filter is expanded. Renders a `<span>` element by
 * default.
 */
export function FilterPanelFilterIndicator({
  icon = ChevronDown,
  ...props
}: FilterPanelFilterIndicatorProps): ReactElement {
  const collapsible = useCollapsibleContext()
  const qdsContext = useQdsFilterPanelContext()

  const mergedProps = mergeProps(
    qdsContext.getFilterIndicatorBindings(),
    {"aria-hidden": true, "data-state": collapsible.open ? "open" : "closed"},
    props,
  )

  return (
    <PolymorphicElement as="span" {...mergedProps}>
      <IconOrNode icon={icon} {...qdsContext.getFilterIndicatorIconProps()} />
    </PolymorphicElement>
  )
}
