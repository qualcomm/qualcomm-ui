// Modified from https://github.com/kentcdodds/match-sorter
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear
import {isFalsy} from "./is-falsy"
import {defaultKeyAttributes, getMatchRanking, Rankings} from "./utils"

type KeyAttributes = {
  maxRanking: Rankings
  minRanking: Rankings
  threshold?: Rankings
}
interface RankingInfo {
  keyIndex: number
  keyThreshold: Rankings | undefined
  rank: Rankings
  rankedValue: string
}

interface ValueGetterKey<ItemType> {
  (item: ItemType): string | Array<string>
}
interface IndexedItem<ItemType> {
  index: number
  item: ItemType
}
interface RankedItem<ItemType> extends RankingInfo, IndexedItem<ItemType> {}

interface BaseSorter<ItemType> {
  (a: RankedItem<ItemType>, b: RankedItem<ItemType>): number
}

interface Sorter<ItemType> {
  (matchItems: Array<RankedItem<ItemType>>): Array<RankedItem<ItemType>>
}

interface KeyAttributesOptions<ItemType> {
  key?: string | ValueGetterKey<ItemType>
  maxRanking?: Rankings
  minRanking?: Rankings
  threshold?: Rankings
}

type KeyOption<ItemType> =
  | KeyAttributesOptions<ItemType>
  | ValueGetterKey<ItemType>
  | string

interface MatchSorterOptions<ItemType = unknown> {
  baseSort?: BaseSorter<ItemType>
  keepDiacritics?: boolean
  keys?: ReadonlyArray<KeyOption<ItemType>>
  sorter?: Sorter<ItemType>
  threshold?: Rankings
}
type IndexableByString = Record<string, unknown>

const defaultBaseSortFn: BaseSorter<unknown> = (a, b) =>
  String(a.rankedValue).localeCompare(String(b.rankedValue))

/**
 * Takes an array of items and a value and returns a new array with the items that
 * match the given value
 *
 * @param {Array} items - the items to sort
 * @param {String} value - the value to use for ranking
 * @param {Object} options - Some options to configure the sorter
 * @returns {Array} - the new sorted array
 */
function matchSorter<ItemType = string>(
  items: ReadonlyArray<ItemType>,
  value: string,
  options: MatchSorterOptions<ItemType> = {},
): Array<ItemType> {
  const {
    baseSort = defaultBaseSortFn,
    keys,
    sorter = (matchedItems) =>
      matchedItems.sort((a, b) => sortRankedValues(a, b, baseSort)),
    threshold = Rankings.MATCHES,
  } = options
  const matchedItems = items.reduce(reduceItemsToRanked, [])
  return sorter(matchedItems).map(({item}) => item)

  function reduceItemsToRanked(
    matches: Array<RankedItem<ItemType>>,
    item: ItemType,
    index: number,
  ): Array<RankedItem<ItemType>> {
    const rankingInfo = getHighestRanking(item, keys, value, options)
    const {keyThreshold = threshold, rank} = rankingInfo
    if (rank >= keyThreshold) {
      matches.push({...rankingInfo, index, item})
    }
    return matches
  }
}

/**
 * Gets the highest ranking for value for the given item based on its values for
 * the given keys
 *
 * @param {*} item - the item to rank
 * @param {Array} keys - the keys to get values from the item for the ranking
 * @param {String} value - the value to rank against
 * @param {Object} options - options to control the ranking
 * @returns {{rank: Number, keyIndex: Number, keyThreshold: Number}} - the highest ranking
 */
function getHighestRanking<ItemType>(
  item: ItemType,
  keys: ReadonlyArray<KeyOption<ItemType>> | undefined,
  value: string,
  options: MatchSorterOptions<ItemType>,
): RankingInfo {
  if (!keys) {
    // if keys is not specified, then we assume the item given is ready to be matched
    const stringItem = item as unknown as string
    return {
      keyIndex: -1,

      keyThreshold: options.threshold,

      rank: getMatchRanking(stringItem, value, options),
      // ends up being duplicate of 'item' in matches but consistent
      rankedValue: stringItem,
    }
  }
  const valuesToRank = getAllValuesToRank(item, keys)
  return valuesToRank.reduce(
    (
      {keyIndex, keyThreshold, rank, rankedValue},
      {attributes, itemValue},
      i,
    ) => {
      let newRank = getMatchRanking(itemValue, value, options)
      let newRankedValue = rankedValue
      const {maxRanking, minRanking, threshold} = attributes
      if (newRank < minRanking && newRank >= Rankings.MATCHES) {
        newRank = minRanking
      } else if (newRank > maxRanking) {
        newRank = maxRanking
      }
      if (newRank > rank) {
        rank = newRank
        keyIndex = i
        keyThreshold = threshold
        newRankedValue = itemValue
      }
      return {keyIndex, keyThreshold, rank, rankedValue: newRankedValue}
    },
    {
      keyIndex: -1,
      keyThreshold: options.threshold,
      rank: Rankings.NO_MATCH as Rankings,
      rankedValue: item as unknown as string,
    },
  )
}

/**
 * Sorts items that have a rank, index, and keyIndex
 *
 * @param {Object} a - the first item to sort
 * @param {Object} b - the second item to sort
 * @returns {Number} -1 if a should come first, 1 if b should come first, 0 if equal
 */
function sortRankedValues<ItemType>(
  a: RankedItem<ItemType>,
  b: RankedItem<ItemType>,
  baseSort: BaseSorter<ItemType>,
): number {
  const aFirst = -1
  const bFirst = 1
  const {keyIndex: aKeyIndex, rank: aRank} = a
  const {keyIndex: bKeyIndex, rank: bRank} = b
  const same = aRank === bRank
  if (same) {
    if (aKeyIndex === bKeyIndex) {
      // use the base sort function as a tie-breaker
      return baseSort(a, b)
    } else {
      return aKeyIndex < bKeyIndex ? aFirst : bFirst
    }
  } else {
    return aRank > bRank ? aFirst : bFirst
  }
}

/**
 * Gets value for key in item at arbitrarily nested keypath
 *
 * @param {Object} item - the item
 * @param {Object|Function} key - the potentially nested keypath or property callback
 * @returns {Array} - an array containing the value(s) at the nested keypath
 */
function getItemValues<ItemType>(
  item: ItemType,
  key: KeyOption<ItemType>,
): Array<string> {
  if (typeof key === "object") {
    key = key.key as string
  }
  let value: string | Array<string> | null | unknown
  if (typeof key === "function") {
    value = key(item)
  } else if (isFalsy(item)) {
    value = null
  } else if (Object.hasOwnProperty.call(item, key)) {
    value = (item as IndexableByString)[key]
  } else if (key.includes(".")) {
    return getNestedValues<ItemType>(key, item)
  } else {
    value = null
  }

  // because `value` can also be undefined
  if (isFalsy(value)) {
    return []
  }
  if (Array.isArray(value)) {
    return value
  }
  return [String(value)]
}

/**
 * Given path: "foo.bar.baz"
 * And item: {foo: {bar: {baz: 'buzz'}}}
 * -> 'buzz'
 *
 * @param path a dot-separated set of keys
 * @param item the item to get the value from
 */
function getNestedValues<ItemType>(
  path: string,
  item: ItemType,
): Array<string> {
  const keys = path.split(".")

  type ValueA = Array<ItemType | IndexableByString | string>
  let values: ValueA = [item]

  for (let i = 0, I = keys.length; i < I; i++) {
    const nestedKey = keys[i]
    let nestedValues: ValueA = []

    for (let j = 0, J = values.length; j < J; j++) {
      const nestedItem = values[j]

      if (isFalsy(nestedItem)) {
        continue
      }

      if (Object.hasOwnProperty.call(nestedItem, nestedKey)) {
        const nestedValue = (nestedItem as IndexableByString)[nestedKey]
        if (!isFalsy(nestedValue)) {
          nestedValues.push(nestedValue as IndexableByString | string)
        }
      } else if (nestedKey === "*") {
        // ensure that values is an array
        nestedValues = nestedValues.concat(nestedItem)
      }
    }

    values = nestedValues
  }

  if (Array.isArray(values[0])) {
    // keep allowing the implicit wildcard for an array of strings at the end of
    // the path; don't use `.flat()` because that's not available in node.js v10
    const result: Array<string> = []
    return result.concat(...(values as Array<string>))
  }
  // Based on our logic it should be an array of strings by now...
  // assuming the user's path terminated in strings
  return values as Array<string>
}

/**
 * Gets all the values for the given keys in the given item and returns an array of
 * those values
 *
 * @param item - the item from which the values will be retrieved
 * @param keys - the keys to use to retrieve the values
 * @returns objects with {itemValue, attributes}
 */
function getAllValuesToRank<ItemType>(
  item: ItemType,
  keys: ReadonlyArray<KeyOption<ItemType>>,
) {
  const allValues: Array<{attributes: KeyAttributes; itemValue: string}> = []
  for (let j = 0, J = keys.length; j < J; j++) {
    const key = keys[j]
    const attributes = getKeyAttributes(key)
    const itemValues = getItemValues(item, key)
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
 * Gets all the attributes for the given key
 *
 * @param key - the key from which the attributes will be retrieved
 * @returns object containing the key's attributes
 */
function getKeyAttributes<ItemType>(key: KeyOption<ItemType>): KeyAttributes {
  if (typeof key === "string") {
    return defaultKeyAttributes
  }
  return {...defaultKeyAttributes, ...key}
}

export {matchSorter, defaultBaseSortFn}

export type {
  MatchSorterOptions,
  KeyAttributesOptions,
  KeyOption,
  KeyAttributes,
  RankingInfo,
  ValueGetterKey,
}
