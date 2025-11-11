// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  Children,
  cloneElement,
  isValidElement,
  type ReactNode,
  useMemo,
} from "react"

import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"

/**
 * This utility hook iterates over a list of children and filters out invalid
 * elements while applying group metadata (count, position) to each one as data-*
 * attributes. The data attributes can be used to style the elements.
 *
 * Data attributes:
 * - `data-between`: present if the item is between two items.
 * - `data-first`: present if the item is the first child in the group.
 * - `data-last`: present if the item is the last child in the group.
 * - `data-group-item`: always present.
 * - `data-group-count`: the total number of child items in the group.
 * - `data-group-index` the index of the child in the group.
 *
 * @param children React children prop.
 */
export function useGroupedChildren(children: ReactNode): {
  children: ReactNode
  count: number
} {
  const count = Children.count(children)

  return useMemo(() => {
    return {
      children: Children.toArray(children)
        .filter(isValidElement)
        .map((child, index) => {
          const childProps = child.props as any
          return cloneElement(child, {
            ...childProps,
            "data-between": booleanDataAttr(index > 0 && index < count - 1),
            "data-first": booleanDataAttr(index === 0),
            "data-group-count": count,
            "data-group-index": index,
            "data-group-item": "",
            "data-last": booleanDataAttr(index === count - 1),
          })
        }),
      count,
    }
  }, [children, count])
}
