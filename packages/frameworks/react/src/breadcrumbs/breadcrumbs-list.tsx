// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, type ReactNode, useMemo} from "react"

import {
  getItemSegments,
  type QdsBreadcrumbItemData,
  type QdsBreadcrumbsMaxItems,
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
   * collapsed into a dropdown menu. Set to `"auto"` to dynamically
   * collapse items based on container width.
   */
  maxItems?: QdsBreadcrumbsMaxItems

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
  ref,
  startItems = 1,
  ...props
}: BreadcrumbsListProps): ReactElement {
  const qdsContext = useQdsBreadcrumbsContext()

  const segments = useMemo(
    () =>
      items
        ? getItemSegments(
            items,
            maxItems as number | undefined,
            startItems,
            endItems,
          )
        : null,
    [items, maxItems, startItems, endItems],
  )

  const mergedProps = mergeProps(qdsContext.getListBindings(), props)

  return (
    <PolymorphicElement ref={ref} as="ol" {...mergedProps}>
      {segments ? (
        <DataDrivenItems segments={segments} />
      ) : (
        children
      )}
    </PolymorphicElement>
  )
}

function getTriggerRender(item: BreadcrumbsItemData): ReactElement | undefined {
  return item.link ? (
    item.link
  ) : item.href ? (
    <a href={item.href} />
  ) : (
    <a href="" />
  )
}

function DataDrivenItems({
  segments: {after, before, collapsed},
}: {
  segments: ReturnType<typeof getItemSegments<BreadcrumbsItemData>>
}): ReactElement {
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
      {collapsed.length > 0 && (
        <BreadcrumbsOverflowItem>
          {collapsed.map((item, index) => (
            <Menu.Item
              key={index}
              disabled={item.disabled}
              render={getTriggerRender(item)}
              value={item.href ?? `breadcrumb-overflow-${index}`}
            >
              {item.icon ? <Menu.ItemStartIcon icon={item.icon} /> : null}
              {item.label}
            </Menu.Item>
          ))}
        </BreadcrumbsOverflowItem>
      )}
      {after.map((item, index) => (
        <BreadcrumbsItemRoot
          key={before.length + collapsed.length + index}
          disabled={item.disabled}
        >
          <BreadcrumbsItemTrigger
            aria-current={index === after.length - 1 ? "page" : undefined}
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
