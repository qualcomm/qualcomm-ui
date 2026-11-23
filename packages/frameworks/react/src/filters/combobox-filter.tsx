// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ComponentProps, type ReactElement, useMemo, useState} from "react"

import {
  createComboboxFilterApi,
  narrowFilterCollection,
} from "@qualcomm-ui/core/filter-control"
import type {ListFilterDefinition} from "@qualcomm-ui/core/filters"
import {useFilter} from "@qualcomm-ui/react-core/filter-set"
import {useFilter as useLocaleFilter} from "@qualcomm-ui/react-core/locale"
import {Combobox} from "@qualcomm-ui/react/combobox"

import {useQdsFilterControlContext} from "./qds-filter-control-context.js"

export interface ComboboxFilterProps extends Omit<
  ComponentProps<typeof Combobox>,
  "collection" | "defaultValue" | "onValueChange" | "value"
> {}

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
  const api = createComboboxFilterApi(useFilter<ListFilterDefinition>())
  const qdsContext = useQdsFilterControlContext()
  const {contains} = useLocaleFilter(localeFilterOptions)
  const [inputValue, setInputValue] = useState("")
  const collection = useMemo(
    () => narrowFilterCollection(api.collection, inputValue, contains),
    [api.collection, contains, inputValue],
  )

  return (
    <Combobox
      {...api.getLabelProps()}
      collection={collection}
      onInputValueChange={(details) => {
        setInputValue(details.inputValue)
        onInputValueChange?.(details)
      }}
      onValueChange={(details) => api.setValue(details.value)}
      size={qdsContext.size}
      value={api.value}
      {...props}
    />
  )
}
