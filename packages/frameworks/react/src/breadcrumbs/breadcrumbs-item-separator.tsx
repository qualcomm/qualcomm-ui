// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {ChevronRight} from "lucide-react"

import {IconOrNode} from "@qualcomm-ui/react/icon"
import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsBreadcrumbsContext} from "./qds-breadcrumbs-context"

export interface BreadcrumbsItemSeparatorProps
  extends Omit<ElementRenderProp<"span">, "children"> {
  /**
   * The separator element to render between items.
   * @default `ChevronRight`
   */
  icon?: LucideIconOrElement
}

export function BreadcrumbsItemSeparator({
  icon = ChevronRight,
  ...props
}: BreadcrumbsItemSeparatorProps): ReactElement {
  const qdsContext = useQdsBreadcrumbsContext()
  const mergedProps = mergeProps(qdsContext.getItemSeparatorBindings(), props)

  return (
    <PolymorphicElement as="span" {...mergedProps}>
      <IconOrNode icon={icon} skipWrapper />
    </PolymorphicElement>
  )
}
