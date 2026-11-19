// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ComponentProps, type ReactElement, useMemo, useState} from "react"

import type {
  FilterOption,
  OptionFilterDefinition,
} from "@qualcomm-ui/core/filters"
import {selectCollection} from "@qualcomm-ui/core/select"
import {useFilter as useLocaleFilter} from "@qualcomm-ui/react-core/locale"
import {Combobox} from "@qualcomm-ui/react/combobox"
import type {ListCollection} from "@qualcomm-ui/utils/collection"

import {getSelectedLabels} from "./internal/get-selected-labels.js"
import {useFilterOptions} from "./internal/use-filter-options.js"
import {
  getFilterLabelProps,
  useFilterWidget,
} from "./internal/use-filter-widget.js"
import {useQdsFilterControlContext} from "./qds-filter-control-context.js"

export interface ComboboxFilterProps extends Omit<
  ComponentProps<typeof Combobox>,
  "collection" | "defaultValue" | "onValueChange" | "value"
> {
  /**
   * A collection to render instead of `options`. Use for custom item shapes
   * or server-side search, together with `onInputValueChange`.
   */
  collection?: ListCollection<any> | undefined

  /**
   * The options to render, filtered by the input text. Takes precedence over
   * the definition's options and the filter set's resolver.
   */
  options?: FilterOption[] | undefined
}

/**
 * A searchable combobox listing the filter's options. Supports `multiple`.
 * Writes a `string[]`.
 */
export function ComboboxFilter({
  collection: collectionProp,
  onInputValueChange,
  options,
  ...props
}: ComboboxFilterProps): ReactElement {
  const filter = useFilterWidget<OptionFilterDefinition>(
    "ComboboxFilter",
    "option",
  )
  const qdsContext = useQdsFilterControlContext()
  const {contains} = useLocaleFilter({sensitivity: "base"})
  const [inputValue, setInputValue] = useState("")
  const items = useFilterOptions(collectionProp ? [] : options)
  const matches = inputValue
    ? items.filter((item) => contains(item.label, inputValue))
    : items
  const matchesKey = JSON.stringify(matches)
  const optionsCollection = useMemo(
    () => selectCollection({items: matches}),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [matchesKey],
  )
  const collection: ListCollection<any> = collectionProp ?? optionsCollection

  return (
    <Combobox
      {...getFilterLabelProps(filter)}
      collection={collection}
      onInputValueChange={(details) => {
        setInputValue(details.inputValue)
        onInputValueChange?.(details)
      }}
      onValueChange={(details) =>
        filter.setValue(details.value, {
          labels: getSelectedLabels(collection, details.value, details.items),
        })
      }
      size={qdsContext.size}
      value={filter.value ?? []}
      {...props}
    />
  )
}
