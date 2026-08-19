import type {CollectionItem} from "./types.js"

export interface SelectionMapCollection<
  T extends CollectionItem = CollectionItem,
> {
  find: (value: string | null | undefined) => T | null
  getItemValue: (item: T | null | undefined) => string | null
}

export function resolveSelectedItems<T extends CollectionItem>({
  collection,
  selectedItemMap,
  values,
}: {
  collection: SelectionMapCollection<T>
  selectedItemMap: Map<string, T>
  values: string[]
}): T[] {
  const result: T[] = []
  for (const value of values) {
    const item = collection.find(value) ?? selectedItemMap.get(value)
    if (item != null) {
      result.push(item)
    }
  }
  return result
}

export function updateSelectedItemMap<T extends CollectionItem>({
  collection,
  selectedItemMap,
  selectedItems,
  values,
}: {
  collection: SelectionMapCollection<T>
  selectedItemMap: Map<string, T>
  selectedItems: T[]
  values: string[]
}): Map<string, T> {
  const nextMap = new Map(selectedItemMap)
  for (const item of selectedItems) {
    const value = collection.getItemValue(item)
    if (value != null) {
      nextMap.set(value, item)
    }
  }

  const allowedValues = new Set(values)
  for (const value of nextMap.keys()) {
    if (!allowedValues.has(value)) {
      nextMap.delete(value)
    }
  }

  return nextMap
}

export function deriveSelectionState<T extends CollectionItem>({
  collection,
  selectedItemMap,
  values,
}: {
  collection: SelectionMapCollection<T>
  selectedItemMap: Map<string, T>
  values: string[]
}): {nextSelectedItemMap: Map<string, T>; selectedItems: T[]} {
  const selectedItems = resolveSelectedItems({
    collection,
    selectedItemMap,
    values,
  })
  const nextSelectedItemMap = updateSelectedItemMap({
    collection,
    selectedItemMap,
    selectedItems,
    values,
  })

  return {nextSelectedItemMap, selectedItems}
}

export function createSelectedItemMap<T extends CollectionItem>({
  collection,
  selectedItems,
}: {
  collection: SelectionMapCollection<T>
  selectedItems: T[]
}): Map<string, T> {
  return updateSelectedItemMap({
    collection,
    selectedItemMap: new Map(),
    selectedItems,
    values: selectedItems
      .map((item) => collection.getItemValue(item)!)
      .filter(Boolean),
  })
}
