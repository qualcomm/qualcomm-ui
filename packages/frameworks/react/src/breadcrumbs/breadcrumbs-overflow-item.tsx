// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import type {QdsMenuSize} from "@qualcomm-ui/qds-core/menu"
import {Menu} from "@qualcomm-ui/react/menu"
import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"
import {Portal} from "@qualcomm-ui/react-core/portal"

import {
  BreadcrumbsItemRoot,
  type BreadcrumbsItemRootProps,
} from "./breadcrumbs-item-root"
import {
  BreadcrumbsItemSeparator,
  type BreadcrumbsItemSeparatorProps,
} from "./breadcrumbs-item-separator"
import {
  BreadcrumbsOverflowTrigger,
  type BreadcrumbsOverflowTriggerProps,
} from "./breadcrumbs-overflow-trigger"
import {useQdsBreadcrumbsContext} from "./qds-breadcrumbs-context"

const breadcrumbsSizeToMenuSize: Record<string, QdsMenuSize> = {
  lg: "md",
  md: "sm",
  sm: "sm",
}

export interface BreadcrumbsOverflowItemProps extends BreadcrumbsItemRootProps {
  /**
   * Accessible label for the overflow trigger button.
   * @default "Show more"
   */
  "aria-label"?: string

  /**
   * Menu items to display in the overflow dropdown.
   */
  children?: ReactNode

  /**
   * The icon to display next to the ellipsis.
   */
  icon?: LucideIconOrElement

  /**
   * Props applied to the overflow trigger element.
   * @inheritDoc
   */
  overflowTriggerProps?: BreadcrumbsOverflowTriggerProps

  /**
   * The separator element to render after the overflow item.
   * @default ChevronRight
   */
  separator?: LucideIconOrElement

  /**
   * Props applied to the separator element.
   * @inheritDoc
   */
  separatorProps?: BreadcrumbsItemSeparatorProps
}

export function BreadcrumbsOverflowItem({
  "aria-label": ariaLabel = "Show more",
  children,
  icon,
  overflowTriggerProps,
  separator,
  separatorProps,
  ...props
}: BreadcrumbsOverflowItemProps): ReactElement {
  const qdsContext = useQdsBreadcrumbsContext()
  const menuSize = breadcrumbsSizeToMenuSize[qdsContext.size] ?? "sm"

  return (
    <BreadcrumbsItemRoot {...props}>
      <Menu.Root size={menuSize}>
        <Menu.Trigger>
          <BreadcrumbsOverflowTrigger
            aria-label={ariaLabel}
            icon={icon}
            {...overflowTriggerProps}
          />
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>{children}</Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
      <BreadcrumbsItemSeparator icon={separator} {...separatorProps} />
    </BreadcrumbsItemRoot>
  )
}
