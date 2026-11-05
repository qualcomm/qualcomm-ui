// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreListbox,
  type CoreListboxItemProps,
} from "@qualcomm-ui/react-core/listbox"
import {ListItem} from "@qualcomm-ui/react/list-item"
import type {CollectionItem} from "@qualcomm-ui/utils/collection"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsListboxContext} from "./qds-listbox-context.js"

export interface ListboxItemProps<
  T extends CollectionItem = CollectionItem,
> extends CoreListboxItemProps<T> {}

/**
 * An interactive option in the listbox. Renders a `<li>` element by default.
 */
export function ListboxItem<T extends CollectionItem = CollectionItem>(
  props: ListboxItemProps<T>,
): ReactElement {
  const qdsContext = useQdsListboxContext()
  const mergedProps = mergeProps(qdsContext.getItemBindings(), props)

  return (
    <CoreListbox.Item
      render={<ListItem.Root interactive size={qdsContext.size} />}
      {...mergedProps}
    />
  )
}
