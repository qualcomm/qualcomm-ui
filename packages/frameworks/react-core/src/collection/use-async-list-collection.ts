// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {useCallback, useMemo, useRef} from "react"

import {ListCollection, type ListCollectionOptions} from "@qualcomm-ui/utils/collection"

export interface UseAsyncListCollectionProps<T>
  extends Omit<ListCollectionOptions<T>, "items"> {
  /**
   * Filter function to determine which items match the filter text. This is
   * typically one of the functions returned from the `useFilter` hook.
   */
  filter?: (itemText: string, filterText: string, item: T) => boolean
  /**
   * Current filter text to apply
   */
  filterText?: string
  /**
   * Source items to filter and limit
   */
  items: T[]
  /**
   * Maximum number of items to include in the collection
   */
  limit?: number
}

/**
 * Creates a filtered and limited ListCollection from source items. Dynamically updates when source items change. Great for filtering static data.
 * @template T - The type of items in the collection
 * @param props - Configuration options
 * @returns Object containing the filtered and limited collection
 */
export function useAsyncListCollection<T>(
  props: UseAsyncListCollectionProps<T>,
): UseAsyncListCollectionReturn<T> {
  const {filter, filterText, items = [], limit, ...collectionOptions} = props

  const collectionOptionsRef = useRef(collectionOptions)
  collectionOptionsRef.current = collectionOptions

  const create = useCallback((items: T[]) => {
    return new ListCollection({...collectionOptionsRef.current, items})
  }, [])

  const collection = useMemo(() => {
    let activeItems = items

    if (filterText && filter) {
      activeItems = create(items).filter(
        (itemString: string, _index: number, item: T) =>
          filter(itemString, filterText, item),
      ).items
    }

    const limitedItems =
      limit == null ? activeItems : activeItems.slice(0, limit)
    return new ListCollection({
      ...collectionOptionsRef.current,
      items: limitedItems,
    })
  }, [items, filterText, filter, limit, create])

  return {
    collection,
  }
}

/**
 * Return type for useAsyncListCollection hook
 * @template T - The type of items in the collection
 */
export interface UseAsyncListCollectionReturn<T> {
  /**
   * The filtered and limited collection
   */
  collection: ListCollection<T>
}
