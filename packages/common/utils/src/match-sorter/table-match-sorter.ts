// Modified from https://github.com/kentcdodds/match-sorter
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {defaultKeyAttributes, getMatchRanking, Rankings} from "./utils"

export type AccessorAttributes = {
  maxRanking: Rankings
  minRanking: Rankings
  threshold?: Rankings
}

export interface ItemRankingInfo {
  accessorIndex: number
  accessorThreshold: Rankings | undefined
  passed: boolean
  rank: Rankings
  rankedValue: any
}

export interface AccessorOptions<TItem> {
  accessor: AccessorFn<TItem>
  maxRanking?: Rankings
  minRanking?: Rankings
  threshold?: Rankings
}

export type AccessorFn<TItem> = (item: TItem) => string | Array<string>

export type Accessor<TItem> = AccessorFn<TItem> | AccessorOptions<TItem>

export interface RankItemOptions<TItem = unknown> {
  accessors?: ReadonlyArray<Accessor<TItem>>
  keepDiacritics?: boolean
  threshold?: Rankings
}

/**
 * Gets the highest ranking for value for the given item based on its values for the given keys
 * @param {*} item - the item to rank
 * @param {String} value - the value to rank against
 * @param {Object} options - options to control the ranking
 * @return {{rank: Number, accessorIndex: Number, accessorThreshold: Number}} - the highest ranking
 */
export function rankItem<TItem>(
  item: TItem,
  value: string,
  options?: RankItemOptions<TItem>,
): ItemRankingInfo {
  options = options || {}

  options.threshold = options.threshold ?? Rankings.MATCHES

  if (!options.accessors) {
    // if keys is not specified, then we assume the item given is ready to be matched
    const rank = getMatchRanking(item as unknown as string, value, options)
    return {
      accessorIndex: -1,
      accessorThreshold: options.threshold,
      passed: rank >= options.threshold,
      rank,
      // ends up being duplicate of 'item' in matches but consistent
      rankedValue: item,
    }
  }

  const valuesToRank = getAllValuesToRank(item, options.accessors)

  const rankingInfo: ItemRankingInfo = {
    accessorIndex: -1,
    accessorThreshold: options.threshold,
    passed: false,
    rank: Rankings.NO_MATCH,
    rankedValue: item,
  }

  for (let i = 0; i < valuesToRank.length; i++) {
    const rankValue = valuesToRank[i]

    let newRank = getMatchRanking(rankValue.itemValue, value, options)

    const {
      maxRanking,
      minRanking,
      threshold = options.threshold,
    } = rankValue.attributes

    if (newRank < minRanking && newRank >= Rankings.MATCHES) {
      newRank = minRanking
    } else if (newRank > maxRanking) {
      newRank = maxRanking
    }

    newRank = Math.min(newRank, maxRanking) as Rankings

    if (newRank >= threshold && newRank > rankingInfo.rank) {
      rankingInfo.rank = newRank
      rankingInfo.passed = true
      rankingInfo.accessorIndex = i
      rankingInfo.accessorThreshold = threshold
      rankingInfo.rankedValue = rankValue.itemValue
    }
  }

  return rankingInfo
}

/**
 * Sorts items that have a rank, index, and accessorIndex
 * @param {Object} a - the first item to sort
 * @param {Object} b - the second item to sort
 * @return {Number} -1 if a should come first, 1 if b should come first, 0 if equal
 */
export function compareItems(a: ItemRankingInfo, b: ItemRankingInfo): number {
  return a.rank === b.rank ? 0 : a.rank > b.rank ? -1 : 1
}

/**
 * Gets value for key in item at arbitrarily nested keypath
 * @param {Object} item - the item
 * @param {Object|Function} key - the potentially nested keypath or property callback
 * @return {Array} - an array containing the value(s) at the nested keypath
 */
function getItemValues<TItem>(
  item: TItem,
  accessor: Accessor<TItem>,
): Array<string> {
  let accessorFn = accessor as AccessorFn<TItem>

  if (typeof accessor === "object") {
    accessorFn = accessor.accessor
  }

  const value = accessorFn(item)

  // because `value` can also be undefined
  if (value == null) {
    return []
  }

  if (Array.isArray(value)) {
    return value
  }

  return [String(value)]
}

/**
 * Gets all the values for the given keys in the given item and returns an array of those values
 * @param item - the item from which the values will be retrieved
 * @param accessors - the accessors to use to retrieve the values
 * @return objects with {itemValue, attributes}
 */
function getAllValuesToRank<TItem>(
  item: TItem,
  accessors: ReadonlyArray<Accessor<TItem>>,
) {
  const allValues: Array<{
    attributes: AccessorAttributes
    itemValue: string
  }> = []
  for (let j = 0, J = accessors.length; j < J; j++) {
    const accessor = accessors[j]
    const attributes = getAccessorAttributes(accessor)
    const itemValues = getItemValues(item, accessor)
    for (let i = 0, I = itemValues.length; i < I; i++) {
      allValues.push({
        attributes,
        itemValue: itemValues[i],
      })
    }
  }
  return allValues
}

/**
 * Gets all the attributes for the given accessor
 * @param accessor - the accessor from which the attributes will be retrieved
 * @return object containing the accessor's attributes
 */
function getAccessorAttributes<TItem>(
  accessor: Accessor<TItem>,
): AccessorAttributes {
  if (typeof accessor === "function") {
    return defaultKeyAttributes
  }
  return {...defaultKeyAttributes, ...accessor}
}
