// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"
import type {BindingRenderProp} from "@qualcomm-ui/react-core/system"

import {
  BreadcrumbsItemIcon,
  type BreadcrumbsItemIconProps,
} from "./breadcrumbs-item-icon"
import {
  BreadcrumbsItemRoot,
  type BreadcrumbsItemRootProps,
} from "./breadcrumbs-item-root"
import {
  BreadcrumbsItemSeparator,
  type BreadcrumbsItemSeparatorProps,
} from "./breadcrumbs-item-separator"
import {
  BreadcrumbsItemTrigger,
  type BreadcrumbsItemTriggerProps,
} from "./breadcrumbs-item-trigger"

export interface BreadcrumbsItemProps extends BreadcrumbsItemRootProps {
  /**
   * The `aria-current` attribute, should be set to `page` when the item is
   * the current page.
   */
  "aria-current"?: "page" | undefined

  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode

  /**
   * The icon to display next to the item trigger.
   */
  icon?: LucideIconOrElement

  /**
   * Props applied to the item icon element.
   * @inheritDoc
   */
  itemIconProps?: BreadcrumbsItemIconProps

  /**
   * Props applied to the item trigger element.
   * @inheritDoc
   */
  itemTriggerProps?: BreadcrumbsItemTriggerProps

  /**
   * Allows you to replace the component's HTML element with a different tag, or
   * compose it with another component. {@link https://react-next.qui.qualcomm.com/polymorphic-components Learn more}
   */
  render?: BindingRenderProp<object>

  /**
   * The separator element to render between items.
   * @default ChevronRight
   */
  separator?: LucideIconOrElement

  /**
   * Props applied to the separator element.
   * @inheritDoc
   */
  separatorProps?: BreadcrumbsItemSeparatorProps
}

export function BreadcrumbsItem({
  "aria-current": ariaCurrent,
  children,
  icon,
  itemIconProps,
  itemTriggerProps,
  render,
  separator,
  separatorProps,
  ...props
}: BreadcrumbsItemProps): ReactElement {
  return (
    <BreadcrumbsItemRoot {...props}>
      <BreadcrumbsItemTrigger
        aria-current={ariaCurrent}
        render={render}
        {...itemTriggerProps}
      >
        {icon ? <BreadcrumbsItemIcon icon={icon} {...itemIconProps} /> : null}
        {children}
      </BreadcrumbsItemTrigger>
      <BreadcrumbsItemSeparator icon={separator} {...separatorProps} />
    </BreadcrumbsItemRoot>
  )
}
