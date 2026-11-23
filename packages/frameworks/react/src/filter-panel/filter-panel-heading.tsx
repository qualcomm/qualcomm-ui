// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {Funnel} from "lucide-react"

import type {LucideIconOrNode} from "@qualcomm-ui/react-core/lucide"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {IconOrNode} from "@qualcomm-ui/react/icon"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsFilterPanelContext} from "./qds-filter-panel-context.js"

export interface FilterPanelHeadingProps extends ElementRenderProp<"div"> {
  /**
   * Icon rendered before the heading text. Pass `null` to hide it.
   *
   * @default Funnel
   */
  icon?: LucideIconOrNode | null
}

/**
 * The title of the filter panel. Renders a div element by default.
 */
export function FilterPanelHeading({
  children,
  icon = Funnel,
  ...props
}: FilterPanelHeadingProps): ReactElement {
  const qdsContext = useQdsFilterPanelContext()

  const mergedProps = mergeProps(qdsContext.getHeadingBindings(), props)

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {icon ? (
        <IconOrNode aria-hidden icon={icon} {...qdsContext.getIconProps()} />
      ) : null}
      {children}
    </PolymorphicElement>
  )
}
