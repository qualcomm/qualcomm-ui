// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

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
