import {
  type CollectionItem,
  ListCollection,
  type ListCollectionOptions,
} from "@qualcomm-ui/utils/collection"

export const comboboxCollection = <T extends CollectionItem = CollectionItem>(
  options: ListCollectionOptions<T>,
): ListCollection<T> => {
  return new ListCollection<T>(options)
}

export const emptyCollection = <
  T extends CollectionItem = CollectionItem,
>(): ListCollection<T> => {
  return new ListCollection<T>({items: []})
}
