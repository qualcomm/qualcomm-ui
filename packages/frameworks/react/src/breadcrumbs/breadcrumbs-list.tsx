// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, type ReactNode, useMemo} from "react"

import {
  breadcrumbsClasses,
  getItemSegments,
  type QdsBreadcrumbItemData,
  type QdsBreadcrumbsMaxItems,
} from "@qualcomm-ui/qds-core/breadcrumbs"
import {Menu} from "@qualcomm-ui/react/menu"
import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"
import {useMergedRef} from "@qualcomm-ui/react-core/refs"
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
import {BreadcrumbsOverflowTrigger} from "./breadcrumbs-overflow-trigger"
import {useQdsBreadcrumbsContext} from "./qds-breadcrumbs-context"
import {useAutoMaxItems} from "./use-auto-max-items"

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
  const isAutoOverflow = maxItems === "auto" && !!items

  const {computedMaxItems, isMeasuring, listRef, triggerMeasureRef} =
    useAutoMaxItems({
      enabled: isAutoOverflow,
      endItems,
      items,
      startItems,
    })

  const effectiveMaxItems = maxItems === "auto" ? computedMaxItems : maxItems

  const segments = useMemo(
    () =>
      items && !isMeasuring
        ? getItemSegments(items, effectiveMaxItems, startItems, endItems)
        : null,
    [items, isMeasuring, effectiveMaxItems, startItems, endItems],
  )

  const mergedRef = useMergedRef(ref, listRef)

  const mergedProps = mergeProps(qdsContext.getListBindings(), props, {
    ...(isAutoOverflow ? {"data-auto-overflow": ""} : undefined),
    ...(isMeasuring ? {"data-measuring": ""} : undefined),
  })

  return (
    <>
      <PolymorphicElement ref={mergedRef} as="ol" {...mergedProps}>
        {isMeasuring && items ? (
          items.map((item, index) => (
            <BreadcrumbsItemRoot key={index} disabled={item.disabled}>
              <BreadcrumbsItemTrigger render={getTriggerRender(item)}>
                {item.icon ? <BreadcrumbsItemIcon icon={item.icon} /> : null}
                {item.label}
              </BreadcrumbsItemTrigger>
              <BreadcrumbsItemSeparator />
            </BreadcrumbsItemRoot>
          ))
        ) : segments ? (
          <DataDrivenItems segments={segments} />
        ) : (
          children
        )}
      </PolymorphicElement>
      {isAutoOverflow && (
        <div
          ref={triggerMeasureRef}
          aria-hidden
          className={breadcrumbsClasses.measureContainer}
        >
          <BreadcrumbsItemRoot>
            <BreadcrumbsOverflowTrigger />
            <BreadcrumbsItemSeparator />
          </BreadcrumbsItemRoot>
        </div>
      )}
    </>
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
