// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, type ReactNode, useMemo} from "react"

import {
  getCollapsedRange,
  type QdsBreadcrumbItemData,
} from "@qualcomm-ui/qds-core/breadcrumbs"
import {Menu} from "@qualcomm-ui/react/menu"
import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {BreadcrumbsItemIcon} from "./breadcrumbs-item-icon"
import {BreadcrumbsItemRoot} from "./breadcrumbs-item-root"
import {BreadcrumbsItemSeparator} from "./breadcrumbs-item-separator"
import {BreadcrumbsItemTrigger} from "./breadcrumbs-item-trigger"
import {BreadcrumbsOverflowItem} from "./breadcrumbs-overflow-item"
import {useQdsBreadcrumbsContext} from "./qds-breadcrumbs-context"

export type BreadcrumbsItemData = QdsBreadcrumbItemData<
  LucideIconOrElement,
  ReactElement
>

export interface BreadcrumbsListProps extends ElementRenderProp<"ol"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode

  /**
   * Number of items to always show after the overflow indicator when
   * `maxItems` triggers collapsing.
   * @default 1
   */
  endItems?: number

  /**
   * Data-driven breadcrumb items. When provided, the list renders items
   * automatically instead of using `children`.
   */
  items?: BreadcrumbsItemData[]

  /**
   * When the number of items exceeds this value, intermediate items are
   * collapsed into a dropdown menu.
   */
  maxItems?: number

  /**
   * Number of items to always show before the overflow indicator when
   * `maxItems` triggers collapsing.
   * @default 1
   */
  startItems?: number
}

/**
 * The list of breadcrumbs. Renders an `<ol>` element by default.
 */
export function BreadcrumbsList({
  children,
  endItems = 1,
  items,
  maxItems,
  startItems = 1,
  ...props
}: BreadcrumbsListProps): ReactElement {
  const qdsContext = useQdsBreadcrumbsContext()
  const mergedProps = mergeProps(qdsContext.getListBindings(), props)

  const range = useMemo(
    () =>
      items
        ? getCollapsedRange(items.length, maxItems, startItems, endItems)
        : null,
    [items, maxItems, startItems, endItems],
  )

  return (
    <PolymorphicElement as="ol" {...mergedProps}>
      {items ? <DataDrivenItems items={items} range={range} /> : children}
    </PolymorphicElement>
  )
}

function getTriggerRender(item: BreadcrumbsItemData): ReactElement | undefined {
  return item.link ? item.link : item.href ? <a href={item.href} /> : undefined
}

function DataDrivenItems({
  items,
  range,
}: {
  items: BreadcrumbsItemData[]
  range: ReturnType<typeof getCollapsedRange>
}): ReactElement {
  const lastIndex = items.length - 1

  if (!range) {
    return (
      <>
        {items.map((item, index) => (
          <BreadcrumbsItemRoot key={index} disabled={item.disabled}>
            <BreadcrumbsItemTrigger
              aria-current={index === lastIndex ? "page" : undefined}
              render={getTriggerRender(item)}
            >
              {item.icon ? <BreadcrumbsItemIcon icon={item.icon} /> : null}
              {item.label}
            </BreadcrumbsItemTrigger>
            <BreadcrumbsItemSeparator />
          </BreadcrumbsItemRoot>
        ))}
      </>
    )
  }

  const before = items.slice(0, range.start)
  const collapsed = items.slice(range.start, range.end)
  const after = items.slice(range.end)

  return (
    <>
      {before.map((item, index) => (
        <BreadcrumbsItemRoot key={index} disabled={item.disabled}>
          <BreadcrumbsItemTrigger render={getTriggerRender(item)}>
            {item.icon ? <BreadcrumbsItemIcon icon={item.icon} /> : null}
            {item.label}
          </BreadcrumbsItemTrigger>
          <BreadcrumbsItemSeparator />
        </BreadcrumbsItemRoot>
      ))}
      <BreadcrumbsOverflowItem>
        {collapsed.map((item, index) => (
          <Menu.Item
            key={index}
            render={getTriggerRender(item)}
            value={item.href ?? `breadcrumb-overflow-${index}`}
          >
            {item.icon ? <Menu.ItemStartIcon icon={item.icon} /> : null}
            {item.label}
          </Menu.Item>
        ))}
      </BreadcrumbsOverflowItem>
      {after.map((item, index) => (
        <BreadcrumbsItemRoot key={range.end + index} disabled={item.disabled}>
          <BreadcrumbsItemTrigger
            aria-current={range.end + index === lastIndex ? "page" : undefined}
            render={getTriggerRender(item)}
          >
            {item.icon ? <BreadcrumbsItemIcon icon={item.icon} /> : null}
            {item.label}
          </BreadcrumbsItemTrigger>
          <BreadcrumbsItemSeparator />
        </BreadcrumbsItemRoot>
      ))}
    </>
  )
}
