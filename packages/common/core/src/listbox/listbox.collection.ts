import {
  GridCollection,
  ListCollection,
  type CollectionItem,
  type ListCollectionOptions,
  type GridCollectionOptions,
} from "@qualcomm-ui/utils/collection"

export const listboxCollection = <T extends CollectionItem>(
  options: ListCollectionOptions<T>,
): ListCollection<T> => {
  return new ListCollection<T>(options)
}

export const gridCollection = <T extends CollectionItem>(
  options: GridCollectionOptions<T>,
): GridCollection<T> => {
  return new GridCollection<T>(options)
}
