// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ComponentProps, type ReactElement, useMemo, useState} from "react"

import type {ListFilterDefinition} from "@qualcomm-ui/core/filters"
import {selectCollection} from "@qualcomm-ui/core/select"
import {useFilterSetContext} from "@qualcomm-ui/react-core/filter-set"
import {useFilter as useLocaleFilter} from "@qualcomm-ui/react-core/locale"
import {Combobox} from "@qualcomm-ui/react/combobox"
import {ProgressRing} from "@qualcomm-ui/react/progress-ring"

import {
  defaultLoadErrorText,
  defaultLoadingText,
  type FilterCollectionStatusTextProps,
  isInitialLoad,
} from "./internal/filter-collection-status.js"
import {
  getFilterLabelProps,
  useFilterWidget,
} from "./internal/use-filter-widget.js"
import {useQdsFilterControlContext} from "./qds-filter-control-context.js"

export interface ComboboxFilterProps
  extends
    Omit<
      ComponentProps<typeof Combobox>,
      "collection" | "defaultValue" | "onValueChange" | "value"
    >,
    Omit<FilterCollectionStatusTextProps, "retryLabel"> {}

const localeFilterOptions = {sensitivity: "base"} as const

/**
 * A searchable combobox listing the items of the filter's list collection.
 * Supports `multiple`. Writes a `string[]`. The input text narrows the items
 * shown, never the filter's collection. For server-side search, read the text
 * with `onInputValueChange` and narrow the collection resolved by
 * `getFilterCollection`.
 */
export function ComboboxFilter({
  loadErrorText = defaultLoadErrorText,
  loadingText = defaultLoadingText,
  onInputValueChange,
  ...props
}: ComboboxFilterProps): ReactElement {
  const filter = useFilterWidget<ListFilterDefinition>("ComboboxFilter", "list")
  const api = useFilterSetContext()
  const qdsContext = useQdsFilterControlContext()
  const {contains} = useLocaleFilter(localeFilterOptions)
  const [inputValue, setInputValue] = useState("")
  const options = api.getFilterOptions(filter.id)
  const collection = useMemo(
    () =>
      selectCollection({
        items: inputValue
          ? options.filter((option) => contains(option.label, inputValue))
          : options,
      }),
    [contains, inputValue, options],
  )
  const state = filter.collectionState
  const status = state?.status

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
      emptyMessage={isInitialLoad(state) ? loadingText : props.emptyMessage}
      errorText={status === "error" ? loadErrorText : props.errorText}
      icon={
        isInitialLoad(state) ? (
          <ProgressRing aria-hidden size="xs" />
        ) : (
          props.icon
        )
      }
      invalid={status === "error" || props.invalid}
    />
  )
}
