// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ComponentProps, type ReactElement, useMemo, useState} from "react"

import type {ListFilterDefinition} from "@qualcomm-ui/core/filters"
import {useFilter as useLocaleFilter} from "@qualcomm-ui/react-core/locale"
import {Combobox} from "@qualcomm-ui/react/combobox"
import {ListCollection} from "@qualcomm-ui/utils/collection"

import {
  getFilterLabelProps,
  useFilterWidget,
} from "./internal/use-filter-widget.js"
import {useQdsFilterControlContext} from "./qds-filter-control-context.js"

export interface ComboboxFilterProps extends Omit<
  ComponentProps<typeof Combobox>,
  "collection" | "defaultValue" | "onValueChange" | "value"
> {}

const emptyCollection = new ListCollection<any>({items: []})

const localeFilterOptions = {sensitivity: "base"} as const

/**
 * A searchable combobox listing the items of the filter's list collection.
 * Supports `multiple`. Writes a `string[]`. The input text narrows the items
 * shown, never the filter's collection. For server-side search, read the text
 * with `onInputValueChange` and narrow the collection resolved by
 * `getFilterCollection`. Keep the selected items in the narrowed collection,
 * since the filter labels its values from the collection.
 */
export function ComboboxFilter({
  onInputValueChange,
  ...props
}: ComboboxFilterProps): ReactElement {
  const filter = useFilterWidget<ListFilterDefinition>("ComboboxFilter", "list")
  const qdsContext = useQdsFilterControlContext()
  const {contains} = useLocaleFilter(localeFilterOptions)
  const [inputValue, setInputValue] = useState("")
  const source =
    filter.collection instanceof ListCollection
      ? filter.collection
      : emptyCollection
  const collection = useMemo(
    () =>
      inputValue
        ? source.copy(
            source.items.filter((item) =>
              contains(source.stringifyItem(item) ?? "", inputValue),
            ),
          )
        : source,
    [contains, inputValue, source],
  )

  return (
    <Combobox
      {...getFilterLabelProps(filter)}
      collection={collection}
      onInputValueChange={(details) => {
        setInputValue(details.inputValue)
        onInputValueChange?.(details)
      }}
      onValueChange={(details) => filter.setValue(details.value)}
      size={qdsContext.size}
      value={filter.value ?? []}
      {...props}
    />
  )
}
