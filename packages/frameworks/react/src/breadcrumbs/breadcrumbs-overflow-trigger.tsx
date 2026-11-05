// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {
  BreadcrumbsItemIcon,
  type BreadcrumbsItemIconProps,
} from "./breadcrumbs-item-icon.js"
import {useQdsBreadcrumbsContext} from "./qds-breadcrumbs-context.js"

/**
 * @since 1.21.0
 */
export interface BreadcrumbsOverflowTriggerProps extends ElementRenderProp<"button"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   * @default "…"
   */
  children?: ReactNode

  /**
   * The icon to display next to the ellipsis.
   */
  icon?: LucideIconOrElement

  /**
   * Props applied to the item icon element.
   * @inheritDoc
   */
  itemIconProps?: BreadcrumbsItemIconProps
}

/**
 * @since 1.21.0
 */
export function BreadcrumbsOverflowTrigger({
  children = "\u2026",
  icon,
  itemIconProps,
  ...props
}: BreadcrumbsOverflowTriggerProps): ReactElement {
  const qdsContext = useQdsBreadcrumbsContext()
  const mergedProps = mergeProps(qdsContext.getOverflowTriggerBindings(), props)

  return (
    <PolymorphicElement as="button" {...mergedProps}>
      {icon ? <BreadcrumbsItemIcon icon={icon} {...itemIconProps} /> : null}
      {children}
    </PolymorphicElement>
  )
}
